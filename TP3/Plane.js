/**
 * Plane
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Plane extends CGFobject
{

	constructor(scene, divU, divV, sideSize = 1){
		super(scene);
		this.divU = divU;
		this.divV = divV;
		this.sideValue = sideSize/2.0;
		this.controlPoints = [
			// U = 0
			[	
				[-this.sideValue, 0.0, this.sideValue, 1],
				[-this.sideValue, 0.0, -this.sideValue, 1]
			],

			// U = 1
			[
				[this.sideValue, 0.0,  this.sideValue, 1],
				[this.sideValue, 0.0, -this.sideValue, 1]
			]
		];

		var nurbsSurface = new CGFnurbsSurface(1, 1, this.controlPoints);
		this.planeObj = new CGFnurbsObject(this.scene, this.divU, this.divV, nurbsSurface);
	};

	display(){
		this.planeObj.display();
	};

	updateTextCoords(length_s, length_t){
        
    };



};