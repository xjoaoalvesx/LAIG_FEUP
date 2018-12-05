/**
 * Cylinder2
 * 
 * 
 */

class Cylinder2 extends CGFobject{


		constructor(scene, base, top, height, slices, stacks){

			super(scene);
			this.base = base;
			this.top = top;
			this.height = height;
			this.divU = slices;
			this.divV = stacks;
			this.degreeU = 3;
			this.degreeV = 1;
			this.setControlPoints();

			var nurbsSurface = new CGFnurbsSurface(this.degreeU, this.degreeV, this.controlPoints);
			this.cylinder2obj = new CGFnurbsObject(this.scene, this.divU, this.divV, nurbsSurface);
		};

		setControlPoints(){

			let xbot = this.base;
			let xtop = this.top;
			let ybot = 2*(2/3)*xbot;
			let ytop = 2*(2/3)*xtop;

			var controlPointsTemp = [];

			controlPointsTemp.push([xbot, 0, 0, 1.0]);
			controlPointsTemp.push([xtop, 0, this.height, 1.0]);
			controlPointsTemp.push([xbot, ybot, 0, 1, 0]);
			controlPointsTemp.push([xtop, ytop, this.height, 1.0]);
			controlPointsTemp.push([-xbot, ybot, 0, 1, 0]);
			controlPointsTemp.push([-xtop, ytop, this.height, 1.0]);
			controlPointsTemp.push([-xbot, 0, 0, 1, 0]);
			controlPointsTemp.push([-xtop, 0, this.height, 1.0]);

			this.controlPoints = [];

			for(var a = 0; a <= this.degreeU; a++){
				var aux = [];

				for(var u = 0; u <= this.degreeV; u++){
					aux.push(controlPointsTemp.shift());
				}

				this.controlPoints.push(aux);
			}


		};

		display(){

			this.cylinder2obj.display();
			this.scene.pushMatrix();
			this.scene.rotate(Math.PI, 0, 0, 1);
			this.cylinder2obj.display();
			this.scene.popMatrix();

		};

		updateTextCoords(length_s, length_t){
        
    	};




};