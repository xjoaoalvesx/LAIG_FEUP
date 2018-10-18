/**
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Triangle extends CGFobject
{
	constructor(scene, x1, x2, x3, y1, y2, y3, z1, z2, z3)
	{
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;
		this.minS = 0;
		this.minT = 0;
		this.maxS = 1;
		this.maxT = 1;
		this.initBuffers();

	};

	initBuffers()
	{
		this.vertices = [
				this.x1, this.y1, this.z1,
				this.x2, this.y2, this.z2,
				this.x3, this.y3, this.z3,
				];

		this.indices = [
				0, 1, 2,
			];


		let vec1 = [this.x2-this.x1, this.y2-this.y1, this.z2-this.z1];
		let vec2 = [this.x3-this.x1, this.y3-this.y1, this.z3-this.z1];
		let cross = vec3.fromValues(vec1[1]*vec2[2]-vec1[2]*vec1[2], vec1[2]*vec2[0]-vec1[0]*vec2[2], vec1[0]*vec2[1]-vec1[1]*vec2[0]);
		vec3.normalize(cross, cross);

		this.normals = [
				cross[0], cross[1], cross[2],
				cross[0], cross[1], cross[2],
				cross[0], cross[1], cross[2]
		];

		var d_vec1 = Math.sqrt(Math.pow(this.x0-this.x1, 2)+Math.pow(this.y0-this.y1, 2)+Math.pow(this.z0-this.z1, 2));
		var d_vec2 = Math.sqrt(Math.pow(this.x0-this.x2, 2)+Math.pow(this.y0-this.y2, 2)+Math.pow(this.z0-this.z2, 2));
		let cos = ((this.x2-this.x0)*(this.x1-this.x0)+(this.y2-this.y0)*(this.y1-this.y0)+(this.z2-this.z0)*(this.z1-this.z0))/(d_vec1*d_vec2);

		var s_coord = cos*d_vec2;
		var t_coord = -Math.sqrt(Math.pow(d_vec2,2)-Math.pow(s_coord,2));

		this.texCoords = [
				0, 0,
				d_vec1, 0,
				s_coord,-t_coord,
		];

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};
