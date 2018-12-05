/**
 * CircularAnimation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class CircularAnimation extends Animation {


	constructor(scene, span, center, radius, startAng, rotAng){

		super(scene, span);
		this.center = center;
		let degToRad = Math.PI/180;
		this.radius = radius;
		this.startAng = startAng*degToRad;
		this.rotAng = rotAng*degToRad;
		this.deltaT = 0;

	};

	update(currTime){
		currTime = (Math.round(currTime/10))/100;

		if(this.deltaT == 0){
		this.deltaT = currTime;
		return null;
	 }


		 let timeDelta = (currTime) - this.deltaT;

		 if (timeDelta > this.span){
		 	 this.ended = true;
			 return null;
		 }

		var currAng = (this.rotAng*timeDelta)/this.span;
		mat4.identity(this.transMatrix);
		mat4.translate(this.transMatrix, this.transMatrix, this.center);
		mat4.rotateY(this.transMatrix, this.transMatrix, currAng);
		mat4.rotateY(this.transMatrix, this.transMatrix, this.startAng);
		mat4.translate(this.transMatrix, this.transMatrix, [this.radius,0,0]);



	}








};
