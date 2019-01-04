/**
 * Abstract class to represent a generic piece.
 * @abstract
 */

class Piece extends CGFobject {


	constructor(scene, position, type){

		super(scene);

		this.type = type;

		this.position = position ? position : [0, 0, 0];

		this.positionMatrix = mat4.create();
        mat4.translate(this.positionMatrix, this.positionMatrix, this.position);

		this.boardPosition = null;

		this.isSelected = false;

		this.body = new Cylinder2(scene, 0.2, 0.2, 0.1, 15, 5);

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

}
