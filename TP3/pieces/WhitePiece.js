/**
 * A class representing a white piece.
 *
*/

class WhitePiece extends Piece {

	constructor(scene, position){
		super(scene, position, "white");

		this.material = new CGFappearance(this.scene);
		this.material.setAmbient(0.2,0.2,0.2,1);
		this.material.setDiffuse(1,1,1,1);
		this.material.setSpecular(0.1,0.1,0.1,1);
		this.material.setEmission(0,0,0,1);
		this.material.setShininess(1);
	}

	display(){
		this.scene.pushMatrix();
		this.material.apply();
		this.body.display();
		this.scene.popMatrix();
	}
}
