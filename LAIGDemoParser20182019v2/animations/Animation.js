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
		this.matrix = mat4.create();
	};


	apply(){
		this.scene.multMatrix(this.matrix);
	}


	



};