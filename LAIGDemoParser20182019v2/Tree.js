/**
 * Tree
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Tree extends CGFobject
{
	constructor(scene, th, tb, ch, cb, nt, tm)
	{
        super(scene);
        this.th = th;
        this.tb = tb;
        this.ch = ch;
        this.cb = cb;
        this.nt = nt;
        this.tm = tm;
        this.hightDiff = this.th - this.ch;

       this.cylinder2 = new Cylinder2(this.scene, this.tb, 0, this.th, 15, 5);
       this.angle = 2*Math.PI/this.nt;
       this.triangles =[];
       for(let t = 0; t < this.nt ; t++){
       		this.triangles.push(new Triangle(this.scene, 0, this.hightDiff, 0, this.cb, this.hightDiff, 0, 0, this.th, 0));
       }

	};

	display(){
		this.scene.pushMatrix();
		this.scene.rotate(-Math.PI/2, 1,0,0);
		this.cylinder2.display();
		this.scene.popMatrix();

		
		for(let a = 0 ; a < this.nt ; a++){
			this.scene.pushMatrix();
			this.scene.rotate(this.angle*a, 0,1,0);
			this.triangles[a].display();
			this.scene.popMatrix();
		}
	}

	updateTextCoords(length_s, length_t){
        

    };

};