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

		this.body = new Cylinder2(scene, 0.02, 0.02, 0.01, 15, 5);
		this.top = new Sphere(scene, 1, 10, 10);

		this.squeezeMatrix = mat4.create();
			mat4.scale(this.squeezeMatrix, this.squeezeMatrix, [0.02,0,0.02]);
		this.translateMatrix = mat4.create();
			mat4.translate(this.translateMatrix, this.translateMatrix, [0,0.01,0]);
		this.rotateMatrix = mat4.create();
			mat4.rotate(this.rotateMatrix, this.rotateMatrix, -(Math.PI/2), [1,0,0]);

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
