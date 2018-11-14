/**
 * LinearAnimation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class LinearAnimation extends Animation {


	constructor(scene, span, controlPoints){

		super(scene,span);
		this.controlPoints = [];
		this.controlPoints = controlPoints;
		this.orientationMatrix = mat4.create();

		this.deltaT = 0;
		this.numVec = controlPoints.length - 1;
		this.time_per_vec = this.span/this.numVec;
		this.currVect = 0;
		this.previousVectors = [0,0,0];

	};

	update(currTime){
		currTime = (Math.round(currTime/10))/100;

		if(this.deltaT == 0){
		 this.deltaT = currTime;
		 return null;
		}

		let timeDelta = (currTime) - this.deltaT;

		if(this.currVect >= this.numVec || timeDelta > this.span){
			return null;
		}

		if((this.currVect+1)/this.numVec <= Math.floor(timeDelta/this.time_per_vec)/this.numVec){
			this.previousVectors = [this.previousVectors[0]+(this.controlPoints[this.currVect+1][0]-this.controlPoints[this.currVect][0]),
														 this.previousVectors[1]+(this.controlPoints[this.currVect+1][1]-this.controlPoints[this.currVect][1]),
														 this.previousVectors[2]+(this.controlPoints[this.currVect+1][2]-this.controlPoints[this.currVect][2])];
			this.currVect++;
		}

		let progress = (timeDelta%this.time_per_vec) / this.time_per_vec;
		let translateVec = [];

		if(this.currVect == 0){
				translateVec = [(this.controlPoints[this.currVect+1][0]-this.controlPoints[this.currVect][0])*progress,
												(this.controlPoints[this.currVect+1][1]-this.controlPoints[this.currVect][1])*progress,
												(this.controlPoints[this.currVect+1][2]-this.controlPoints[this.currVect][2])*progress];
		}
		else {
			translateVec = [this.previousVectors[0]+(this.controlPoints[this.currVect+1][0]-this.controlPoints[this.currVect][0])*progress,
											this.previousVectors[1]+(this.controlPoints[this.currVect+1][1]-this.controlPoints[this.currVect][1])*progress,
											this.previousVectors[2]+(this.controlPoints[this.currVect+1][2]-this.controlPoints[this.currVect][2])*progress];
		}

		console.log(translateVec);

		mat4.identity(this.transMatrix);

		mat4.translate(this.transMatrix, this.transMatrix, translateVec);
		console.log("ProgVect: " + (this.currVect+1)/this.numVec);
		console.log("Quociente: " + Math.floor(this.span/timeDelta));
		console.log("ProgressTotal: " + 1/Math.floor(this.span/timeDelta));

	}




};
