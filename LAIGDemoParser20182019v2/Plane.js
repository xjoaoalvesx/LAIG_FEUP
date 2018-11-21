/**
 * Plane
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Plane extends CGFobject
{

	constructor(scene, divU, divV){
		super(scene);
		this.divU = divU;
		this.divV = divV;
		this.controlPoints = [
			// U = 0
			[	
				[-0.5, 0.0, 0.5, 1],
				[-0.5, 0.0, -0.5, 1]
			],

			// U = 1
			[
				[0.5, 0.0,  0.5, 1],
				[0.5, 0.0, -0.5, 1]
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