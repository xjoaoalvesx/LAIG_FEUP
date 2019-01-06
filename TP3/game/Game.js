/**
 * Game
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Game {


	constructor(scene){

		this.scene = scene;

		this.communication = new PrologCommunication(this);

		this.elements = new Elements(scene);

		this.history = new GameHistory(scene);

		this.tablepos = [2.5,0,2.5,1];

		this.player1 = null;
		this.player2 = null;

		this.currentPlayer = null;

		this.perspective1 = [3.2,4,2.5,1];
		this.perspective2 = [1.8,4,2.5,1];

		this.playercamera = new CGFcamera(0.4, 0.1, 500, this.perspective1, this.tablepos);

		this.currentperspective = this.perspective1;
		this.objectiveperspective = this.perspective1;

		this.boardId = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

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

		this.pickedCell = null;
		this.pickedPiece = null;


		this.begin = false;

		this.deltaTime = 0;

	};

	resetPickedElements() {
        this.pickedPiece = null;
        this.pickedCell = null;
    }


	changeplayer(){
		if(this.currentPlayer == "white")
			this.currentPlayer = "black";
		else {
			this.currentPlayer = "white";
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

		switch(this.currentPlayer){

			case "white" :

				if(pieceId < 20000){
					this.pickedCell = [row, line];
					this.pickedPiece = pieceId;
				}
				return;

			case "black" :

				if(pieceId > 20000){
					this.pickedCell = [row, line];
					this.pickedPiece = pieceId;
				}
				return;

			default :
				break;
		}

	}

	putInBoard(id, row, line){
		this.boardId[row-1][line-1] = id;
		this.history.addmove([row, line], this.boardId);
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
			this.communication.getPrologRequest('begin');
			this.setPlayers(player1, player2);
			this.currentPlayer = 2;
			this.setCurrentState(nextState);
			let playerText1 = player1.toUpperCase() + (player1 != 'human'? ' AI' : '');
        	let playerText2 = player2.toUpperCase() + (player2 != 'human'? ' AI' : '');
			swal (
				'The Game begins...',
				playerText1 + '  vs  ' + playerText2,
            	'success'
			);

		}
		else{
			swal (
            'FAILED TO START GAME',
            'There is a game in progress...',
            'error'
        	);
		}
	}

	resetGame(answer){

		this.setCurrentState(this.state.NO_GAME);

		let message = answer.split(" ");

		if(message[0]=='victory'){

			let results = message[1].split("-");
			let str = results[0] == "white"? 2 : 1;

			let endGameCallbackFunction = function (winner, result) {
            if (result.value || result.dismiss === 'overlay') {
                swal({
                    title: 'What to do now?',
                    type: 'question',
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonColor: '#248f24',
                    confirmButtonText: 'Watch Game Movie',
                    cancelButtonColor: '#BC1510',
                    cancelButtonText: 'Reset Game',
                }).then((result) => {
                    if (result.value) {
                        //this.game.playGameFilm(this.showWinner.bind(this, str));
                    } else if(result.dismiss === 'overlay' ||
                              result.dismiss === 'cancel') {
                        //this.game.boardHistory.reset();
                        this.elements.reset();
                        //this.game.scoreboard.playerWin(winner);
                        this.communication.resetBoard();
                    }
                });
            }
        };

        if (str == 1 || str == 2) {
            swal(
                'Player ' + str + ' wins!',
                'Congratulations!',
                'success'
            ).then(endGameCallbackFunction.bind(this, str));
        }
		}

	}


	update(currTime){
		this.elements.update(currTime);

		this.elements.update(currTime);

		switch(this.currentState){

			case this.state.NO_GAME :
				break;

			case this.state.HUMAN_VS_HUMAN :
				this.currentPlayer = "black";
				this.waitHumanPiece(this.state.WAIT_PIECE_H_VS_H);
				break;

			case this.state.HUMAN_VS_AI :
				this.currentPlayer = "black";
				this.waitHumanPiece(this.state.AI_PLAY_H_VS_AI);
				break;

			case this.state.AI_VS_AI :
				// this.aiPlay(this.state.AI_VS_AI);
				break;

			case this.state.WAIT_PIECE_H_VS_H :
				this.waitHumanPiece(this.state.WAIT_PIECE_H_VS_H);
				break;

			case this.state.AI_PLAY_H_VS_AI :
				this.waitAi(this.state.WAIT_PIECE_H_VS_AI);
				break;

			case this.state.WAIT_PIECE_H_VS_AI :
				this.waitHumanPiece(this.state.AI_PLAY_H_VS_AI);
				break;



		}


	}



	waitHumanPiece(nextState){

		if(this.pickedPiece && this.pickedCell){
			console.log("LELELEL");
			console.log(this.pickedCell);

			let symbol = this.currentPlayer != 'white' ? 1 : 2;

			this.communication.getPrologRequest(
                'setPiece(' + this.pickedCell[1] + ',' +
                this.pickedCell[0] + ',' + symbol + ',' + this.communication.setBoardToRequest(this.communication.getBoard())
                + ')'
            );

			this.elements.choosenPiece(this.pickedPiece).moveToCell(this.pickedCell[0], this.pickedCell[1]);
			this.elements.playedPiece(this.pickedPiece);
			this.setCurrentState(nextState);

			this.resetPickedElements();
			this.changeplayer();
		}
	}

	waitAi(nextState){

		let symbol = this.currentPlayer != 'white' ? 1 : 2;

			this.communication.getPrologRequest(
                'ai(' +symbol + ',' +  this.communication.setBoardToRequest(this.communication.getBoard())
                + ')'
            );

		this.setCurrentState(nextState);
		this.resetPickedElements();
		this.changeplayer();
	}
};
