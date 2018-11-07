/**
 * LinearAnimation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class LinearAnimation extends Animation {


	constructor(scene, span, controlPoints){

		super(scene,span);
		this.controlPoints = controlPoints;
		this.orientationMatrix = mat4.create();

	};





};

