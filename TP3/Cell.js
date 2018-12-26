/**
 * Cell
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Cell extends CGFobject
{

	constructor(scene)
	{
		super(scene);
		this.cell = new MyRectangle(this.scene, -0.5, 0.5, -0.5, 0.5);
	};

	display(id){

		this.scene.pushMatrix();
		this.scene.registerForPick(id, this.cell);
		this.cell.display();
		this.scene.popMatrix();
	}

	updateTextCoords(length_s, length_t){

    }

};