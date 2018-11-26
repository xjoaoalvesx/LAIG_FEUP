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
		

		this.component = {};
		this.positionVec = [0,0,0];

	};

	update(currTime){
		currTime = (Math.round(currTime/10))/100;

		if(this.deltaT == 0){
		 this.deltaT = currTime;
		 return null;
		}

		let timeDelta = (currTime) - this.deltaT;
		if(this.currVect >= this.numVec || timeDelta >= this.span){
			this.ended = true;
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

		mat4.identity(this.transMatrix);

		mat4.translate(this.transMatrix, this.transMatrix, translateVec);

		let rotationVec =[translateVec[0] - this.previousVectors[0],translateVec[1] - this.previousVectors[1],translateVec[2] - this.previousVectors[2]]

		let angleY = Math.acos((rotationVec[2])/(1 * Math.sqrt(rotationVec[2]*rotationVec[2] + rotationVec[0]*rotationVec[0])));
		if((1 * Math.sqrt(rotationVec[2]*rotationVec[2] + rotationVec[0]*rotationVec[0])) == 0){
			angleY = 0;
		}else if (rotationVec[0] < 0){
			angleY = - angleY;
		}
		var rotationMatrix = mat4.create();
		mat4.identity(rotationMatrix)

		mat4.rotateY(rotationMatrix, rotationMatrix, angleY);
		mat4.multiply(this.transMatrix, this.transMatrix, rotationMatrix);

	};





};
