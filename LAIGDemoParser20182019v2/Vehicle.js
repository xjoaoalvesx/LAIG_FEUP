/**
 * Vehicle
 *
 *
 */


 class Vehicle extends CGFobject{

   	constructor(scene){
        super(scene)
        this.boatfloar = new Patch(this.scene, 10, 10, [[[-1.5,-1.5,0,1],[-1.5,1.5,0,1]],[[0,-1.5,3,1],[0,1.5,3,1]],[[1.5,-1.5,0,1],[1.5,1.5,0,1]]]);
        this.boatfloor = new MyRectangle(this.scene, -0.5, 0.5, -0.5, 0.5);
        this.boathead = new Patch(this.scene, 10, 10, [[[-1.5,-1.5,0,1],[-1,0.8,0,1]],[[0,-1.5,3,1],[0,1.5,0,1]],[[1.5,-1.5,0,1],[1,0.8,0,1]]]);
        this.boatheadfloor = new Patch(this.scene, 10, 10, [[[-1.5,-1.5,0,1],[-1,0.8,0,1]],[[0,-1.5,0,1],[0,1.5,0,1]],[[1.5,-1.5,0,1],[1,0.8,0,1]]]);
        this.boatend = new Patch(this.scene, 10, 10, [[[-1.5,-0.3,0,1],[-1,0.6,0,1]],[[0,-0.3,0,1],[0,1.8,0,1]],[[1.5,-0.3,0,1],[1,0.6,0,1]]]);
        this.pole = new Cylinder2(this.scene, 0.5, 0.5, 2.0, 15, 5);
        this.sail = new Patch(this.scene, 10, 10, [[[-2.5,-2.5,0,1],[-2.5,2.5,0,1]],[[0,-2.5,1.5,1],[0,2.5,1.5,1]],[[2.5,-2.5,0,1],[2.5,2.5,0,1]]]);
        this.reversesail = new Patch(this.scene, 10, 10, [[[-2.5,-2.5,0,1],[-2.5,2.5,0,1]],[[0,-2.5,-1.5,1],[0,2.5,-1.5,1]],[[2.5,-2.5,0,1],[2.5,2.5,0,1]]]);

        this.appearance = new CGFappearance(this.scene);

        this.appearance.setAmbient(0.2,0.2,0.2,1);
        this.appearance.setDiffuse(1,1,1,1);
        this.appearance.setSpecular(0.1,0.,0.1,1);
        this.appearance.setEmission(0,0,0,1);
        this.appearance.setShininess(1);

        this.appearance.setTexture(null);

    };


    display(){

      this.scene.pushMatrix();
      this.scene.scale(0.1,0.1,0.1);

      this.scene.pushMatrix();
      this.scene.rotate(90 * DEGREE_TO_RAD, 1,0,0);
      this.boatfloar.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.scale(3,1,3);
      this.scene.rotate(-90 * DEGREE_TO_RAD, 1,0,0);
      this.boatfloor.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(0,0,3);
      this.scene.rotate(90 * DEGREE_TO_RAD, 1,0,0);
      this.boathead.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(0,0,3);
      this.scene.rotate(-90 * DEGREE_TO_RAD, 1,0,0);
      this.scene.rotate(180 * DEGREE_TO_RAD, 0,0,1);
      this.boatheadfloor.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(0,-0.3,-1.5);
      this.scene.rotate(180 * DEGREE_TO_RAD, 0,0,1);
      this.scene.rotate(180 * DEGREE_TO_RAD, 0,1,0);
      this.boatend.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(0,6,0);
      this.scene.rotate(90 * DEGREE_TO_RAD, 1,0,0);
      this.scene.scale(0.25,0.25,3);
      this.pole.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.appearance.apply();
      this.scene.translate(0,3,0);
      this.scene.rotate(90 * DEGREE_TO_RAD, 0,0,1);
      this.sail.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.appearance.apply();
      this.scene.rotate(180 * DEGREE_TO_RAD, 0,1,0);
      this.scene.translate(0,3,0);
      this.scene.rotate(90 * DEGREE_TO_RAD, 0,0,1);
      this.reversesail.display();
      this.scene.popMatrix();

      this.scene.popMatrix();

    };

    updateTextCoords(length_s, length_t){

    };
  }
