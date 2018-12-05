/**
 * Patch
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Patch extends CGFobject
{


	constructor(scene, divU, divV, controlPoints){
		super(scene);
		this.controlPoints = controlPoints;
		this.divU = divU;
		this.divV = divV;
		this.degreeU = controlPoints.length - 1;
		this.degreeV = controlPoints[0].length - 1;

		this.obj = this.createSurface();
	}

	createSurface(){

		var nurbsSurface = new CGFnurbsSurface(this.degreeU, this.degreeV, this.controlPoints);
		this.surfaceObj = new CGFnurbsObject(this.scene, this.divU, this.divV, nurbsSurface);

		return this.surfaceObj;

	};

	display(){
		this.obj.display();
	}

	updateTextCoords(length_s, length_t){
        
    }

};