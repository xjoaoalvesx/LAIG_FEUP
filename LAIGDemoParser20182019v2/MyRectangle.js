/**
 * MyRectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyRectangle extends CGFobject
{
	constructor(scene, x1, x2, y1, y2)
	{
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		this.minS = 0;
		this.minT = 0;
		this.maxS = x2-x1;
		this.maxT = y2-y1;
		this.initBuffers();

	};

	initBuffers()
	{
		this.vertices = [
				this.x1, this.y1, 0,
				this.x2, this.y1, 0,
				this.x1, this.y2, 0,
				this.x2, this.y2, 0
				];

		this.indices = [
				0, 1, 2,
				3, 2, 1
			];

		this.normals = [
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,
				0, 0, 1
		];

		this.texCoords = [
				this.minS, this.minT,
				this.maxS, this.minT,
				this.minS, this.maxT,
				this.maxS, this.maxT
		];

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};


	updateTextCoords(length_s, length_t){
		var mS = this.maxS/length_s;
		var mT = this.maxT/length_t;
		this.textCoords  = [
			0,0,
			mS,0,
			0,mT,
			mS,mT
		];

		this.updateTexCoordsGLBuffers();
	};
};
