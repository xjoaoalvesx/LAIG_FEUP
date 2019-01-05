/**
 * Game
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Game {


	constructor(scene){

		this.scene = scene;

		this.elements = new Elements(scene);

		this.tablepos = [2.5,0,2.5,1];

		this.player1 = null;
		this.player2 = null;

		this.currentPlayer = null;

		this.perspective1 = [3.2,4,2.5,1];
		this.perspective2 = [1.8,4,2.5,1];

		this.playercamera = new CGFcamera(0.4, 0.1, 500, this.perspective1, this.tablepos);

		this.currentperspective = this.perspective1;
		this.objectiveperspective = this.perspective1;

		this.state = {
			NO_GAME : 1,
			HUMAN_VS_HUMAN : 2,
			HUMAN_VS_AI : 3,
			AI_VS_AI : 4,
			WAIT_PIECE_H_VS_H : 5,
			WAIT_PIECE_H_VS_AI : 6,
			AI_PLAY_H_VS_AI : 7
		}

		this.currentState = this.state.NO_GAME;
		this.previousState = null;


		this.begin = false;

		this.deltaTime = 0;

	};


	changeplayer(){
		if(this.player == "white")
			this.player = "black";
		else {
			this.player = "white";
		}
		this.changeperspective();
	}

	getPlayer(){
		return this.player;
	}

	changeperspective(){
			if(this.objectiveperspective == this.perspective1)
				this.objectiveperspective = this.perspective2;
			else
				this.objectiveperspective = this.perspective1;
	}

	setView(perspective){
		this.playercamera = new CGFcamera(0.4, 0.1, 500, perspective, this.tablepos);
		this.scene.camera = this.playercamera;
		this.scene.interface.setActiveCamera(this.scene.camera);
	}

	validatePlay(row, line){
		console.log("Row: " + row);
		console.log("Line: " + line);
		var pieceId = this.elements.isPieceSelect();
		console.log(pieceId);
		if(pieceId == -1){
			swal("Choose a Piece");
			return null;
		}
		else{
			this.elements.choosenPiece(pieceId).moveToCell(row, line);
		}
	}

	update(currTime){
		this.elements.update(currTime);
	}

	updateView(currTime){
		let newTime = Math.round(currTime/10);

		if(this.currentperspective == this.objectiveperspective)
			return null;

		if(this.deltaTime == 0){
			this.deltaTime = newTime;
			return null;
	 	}

		let movTime = newTime - this.deltaTime;
		console.log(movTime);
		if(movTime >= 200){
			this.setView(this.objectiveperspective);
			this.deltaTime = 0;
			this.currentperspective = this.objectiveperspective;
			return null;
		}

		let currAng = Math.PI*(movTime)/200;
		let x = this.currentperspective[0] - this.tablepos[0], y = this.currentperspective[1], z = this.currentperspective[2] - this.tablepos[2];
		let radious = this.tablepos[0] - this.currentperspective[0];
		let newX = ((x * Math.cos(currAng)) - (z * Math.sin(currAng))) + this.tablepos[0], newZ = ((z * Math.cos(currAng)) - (x * Math.sin(currAng))) + this.tablepos[2];
		this.setView([newX,y,newZ,1]);
	};

	displayGame(){

		this.elements.displayGame();
	}

	setCurrentState(newState) {
        this.previousState = this.currentState;
        this.currentState = newState;
    }

    setPlayers(player1, player2){
    	this.player1 = player1;
    	this.player2 = player2;
    }

	startGame(player1, player2, nextState){
		if(this.currentState == this.state.NO_GAME){
			// make prologrequest
			this.setPlayers(player1, player2);
			this.currentPlayer = 2;
			this.setCurrentState(nextState);

		}
		else{
			swal (
            'FAILED TO START GAME',
            'There is a game in progress...',
            'error'
        	);
		}
	}


	update(currTime){


		switch(this.currentState){

			case this.state.NO_GAME : 
				break;

			case this.state.HUMAN_VS_HUMAN :
				// this.waitHumanPiece(this.state.WAIT_PIECE_H_VS_H)
				break;

			case this.state.HUMAN_VS_AI :
				//
				break;

			case this.state.AI_VS_AI :
				// this.aiPlay(this.state.AI_VS_AI);
				break;

			case this.state.AI_PLAY_H_VS_AI :
				//this.aiPlay(this.state.WAIT_PIECE_H_VS_AI);
				break;

			case this.state.WAIT_PIECE_H_VS_AI : 
				//this.waitHumanPiece(this.state.AI_PLAY_H_VS_AI);



		}


	}
};
