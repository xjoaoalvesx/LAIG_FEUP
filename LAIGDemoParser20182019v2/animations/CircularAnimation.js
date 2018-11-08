/**
 * CircularAnimation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

var toSec = 1/1000;

class CircularAnimation extends Animation {


	constructor(scene, span, center, radius, startAng, rotAng){

		super(scene, span);
		this.center = center;
		let degToRad = Math.PI/180;
		this.radius = radius;
		this.startAng = startAng*degToRad;
		this.rotAng = rotAng*degToRad;
		this.deltaT = 0;
		this.animating = false;

	};

	update(currTime){
		
		 if(this.deltaT == 0){
			this.deltaT = currTime*toSec;
			return null;
		 }

		 this.deltaT = (currTime*toSec) - this.deltaT;

		 if (this.deltaT > this.span){
			 return null;
		 }

		var currAng = this.rotAng*this.deltaT/this.span;

		mat4.identity(this.matrix);
		mat4.rotateY(this.matrix, this.matrix, currAng);
		//mat4.rotateY(this.matrix, this.matrix, this.startAng);



	}




	



};