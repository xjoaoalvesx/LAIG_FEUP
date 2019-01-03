/**
 * Abstract class to represent a generic piece.
 * @abstract
 */

class Piece {


	constructor(scene, position, type){

		this.scene = scene;

		this.type = type;

		this.position = position ? position : [0, 0, 0];

		this.boardPosition = null;

		this.isSelected = false;

		this.body = new Cylinder2(scene, 0.5, 0.5, 20, 15, 5);

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

	display(){
		console.log("Piece does not have a type\n");
	}

}
