/**
 * Triangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Triangle extends CGFobject
{
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3)
	{
        super(scene);

        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;

        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;

        this.x3 = x3;
        this.y3 = y3;
        this.z3 = z3;

		this.u = 1;
		this.v = 1;

		this.a = Math.sqrt(Math.pow(x3 - x2 , 2) + Math.pow(y3 - y2, 2) + Math.pow(z3 - z2, 2));
		this.b = Math.sqrt(Math.pow(x1 - x3 , 2) + Math.pow(y1 - y3, 2) + Math.pow(z1 - z3, 2));
		this.c = Math.sqrt(Math.pow(x2 - x1 , 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
	



        this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = [
				this.x1, this.y1, this.z1,
				this.x2, this.y2, this.z2,
				this.x3, this.y3, this.z3
				];

		this.indices = [
        2, 1, 0
		];

    	this.normals = [
        	0, 0, -1,
        	0, 0, -1,
        	0, 0, -1
		];
	
		var ang = Math.acos((this.a * this.a - this.b * this.b + this.c * this.c) / (2 * this.a * this.c));



		this.texCoords = [
			0, 0,
			this.c, 0,
			this.c - this.a * (this.a * this.a - this.b * this.b + this.c * this.c) / (2 * this.a * this.c), -this.a * Math.sin(ang)
		];

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	updateTextCoords(length_s, length_t){
        

    };

};