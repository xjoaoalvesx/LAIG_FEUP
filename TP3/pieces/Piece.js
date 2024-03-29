/**
 * Abstract class to represent a generic piece.
 * @abstract
 */

class Piece extends CGFobject {


	constructor(scene, position, type, id){

		super(scene);

		this.id = id;

		this.type = type;

		this.position = position ? position : [0, 0, 0];

		this.desired_position = position ? position : [0, 0, 0];

		this.positionMatrix = mat4.create();
        mat4.translate(this.positionMatrix, this.positionMatrix, this.position);

		this.boardPosition = null;

		this.isSelected = false;

		this.isPlayed = false;

		this.body = new Cylinder2(scene, 0.02, 0.02, 0.01, 15, 5);
		this.top = new Sphere(scene, 1, 10, 10);

		this.squeezeMatrix = mat4.create();
			mat4.scale(this.squeezeMatrix, this.squeezeMatrix, [0.02,0,0.02]);
		this.translateMatrix = mat4.create();
			mat4.translate(this.translateMatrix, this.translateMatrix, [0,0.01,0]);
		this.rotateMatrix = mat4.create();
			mat4.rotate(this.rotateMatrix, this.rotateMatrix, -(Math.PI/2), [1,0,0]);

		this.deltaTime = 0;
		this.moving = 0;

		this.jumpTime = 0;
		this.jumping = 0;
	}

	getBoardPosition(){
		return this.boardPosition;
	}

	setBoardPosition(cell){
		this.boardPosition = cell;
		if(! cell) return ;

	}

	getType(){
		return this.type;
	}

	getPositionMatrix() {
        this.result = mat4.clone(this.positionMatrix);

        return this.result;
  }

	moveToCell(row, line){
		if(this.isPlayed)
			return null;
		this.desired_position = [3.163 - ((line - 1) * 0.046) , 0.501, 3.165 - ((row - 1) * 0.046)];
		this.moving = 1;
		this.scene.game.putInBoard(this.id, line, row);
		this.isPlayed = true;
		this.scene.game.elements.playedPiece(this.id);
	}

	updateSelected(currTime){
		if( (this.moving == 1 && this.jumping == 0) || (this.isSelected == false && this.jumping == 0) || (this.isPlayed && this.jumping == 0)){
			return null;
		}

		if(this.jumpTime == 0){
			this.jumpTime = currTime;
			this.jumping = 1;
			return null;
	 	}

		let movTime = currTime - this.jumpTime;

		if(movTime >= 800){
			mat4.identity(this.positionMatrix);
			mat4.translate(this.positionMatrix, this.positionMatrix, this.position);
			this.jumpTime = 0;
			this.jumping = 0;
			return null;
		}

		let heigth = 0.25 * Math.sin(Math.PI*(movTime)/800);

		mat4.identity(this.positionMatrix);
		mat4.translate(this.positionMatrix, this.positionMatrix, [this.position[0], this.position[1] + heigth, this.position[2]]);
	}

	update(currTime){
		this.updateSelected(currTime);
		let newTime = Math.round(currTime/10);
		if(this.position == this.desired_position || this.jumping == 1)
			return null;

		if(this.deltaTime == 0){
			this.deltaTime = newTime;
			return null;
	 	}

		let movTime = newTime - this.deltaTime;
		if(movTime >= 200){
			mat4.identity(this.positionMatrix);
			mat4.translate(this.positionMatrix, this.positionMatrix, this.desired_position);
			this.deltaTime = 0;
			this.moving = 0;
			this.position = this.desired_position;
			this.isSelected = false;
			return null;
		}

		let heigth = 1 * Math.sin(Math.PI*(movTime)/200);
		let x = this.position[0] + ((this.desired_position[0]-this.position[0])*(movTime)/200), y = heigth + this.position[1] + ((this.desired_position[1]-this.position[1])*(movTime)/200), z = this.position[2] + ((this.desired_position[2]-this.position[2])*(movTime)/200);
		mat4.identity(this.positionMatrix);
		mat4.translate(this.positionMatrix, this.positionMatrix, [x, y, z]);
	}

}
