/**
 * A class representing a black piece.
 *
 */

class BlackPiece extends Piece {


	constructor(scene, position, id){
		super(scene, position, "black", id);

		this.material = new CGFappearance(this.scene);
		this.material.setAmbient(0.2,0.2,0.2,1);
		this.material.setDiffuse(0,0,0,1);
		this.material.setSpecular(0.1,0.1,0.1,1);
		this.material.setEmission(0,0,0,1);
		this.material.setShininess(1);
	}

	returnPiece(){
		this.desired_position = [2 + (this.id - 20001)  * .01, 0.501, 3.3 + (((this.id - 20001) % 5) * 0.04)];
		this.moving = 1;
		this.isPlayed = false;
		this.game.removeIdFromBoard(this.id);
	}

	display(id){

		this.scene.pushMatrix();
		this.material.apply();
		this.scene.multMatrix(this.getPositionMatrix());

			this.scene.pushMatrix();
			this.scene.registerForPick(id, this.body);
			this.scene.multMatrix(this.rotateMatrix);
			this.body.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
			this.scene.registerForPick(id, this.top);
			this.scene.multMatrix(this.squeezeMatrix);
			this.top.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
			this.scene.registerForPick(id, this.top);
			this.scene.multMatrix(this.translateMatrix);
			this.scene.multMatrix(this.squeezeMatrix);
			this.top.display();
			this.scene.popMatrix();

		this.scene.popMatrix();
	}
}
