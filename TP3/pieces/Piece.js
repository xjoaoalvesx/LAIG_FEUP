/**
 * Abstract class to represent a generic piece.
 * @abstract
 */

class Piece {


	constructor(position, type){

		this.type = type;

		this.position = position ? position : [0, 0, 0];

		this.boardPosition = null;

		this.isSelected = false;

	}

	get boardPosition(){
		return this.boardPosition;
	}

	set boardPosition(cell){
		this.boardPosition = cell;
		if(! cell) return ;

	}

	getType(){
		return this.type;
	}


}