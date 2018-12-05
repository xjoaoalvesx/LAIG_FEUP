/**
 * Animation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */


class Animation  {


	constructor(scene, span){

		this.scene = scene;
		this.span = span;
		this.x_ang = 0;  // rotation in xx axis
		this.y_ang = 0;  // rotation in yy axis
		this.transMatrix = mat4.create();
		this.ended = false;
	};


	apply(){
		this.scene.multMatrix(this.transMatrix);

	}

	getEnded(){
		return this.ended;
	}





};
