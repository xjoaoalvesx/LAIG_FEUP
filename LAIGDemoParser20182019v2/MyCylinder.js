/**
 * MyCylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder extends CGFobject
{
	constructor(scene, slices, stacks)
    {
    super(scene);
    this.slices = slices;
    this.stacks = stacks;
    this.initBuffers();
    };

	initBuffers() 
	{
		this.vertices = [
				];

		this.indices = [
			];
		
		this.normals = [
		];

		this.texCoords = [];


		let ang1, ang2;

		let i, j, k;
		var ang = 2*Math.PI/this.slices;

		for(j = 0; j <= this.stacks; j++){
			for(i = 0; i < this.slices; i++){

				ang1 = Math.cos(i*ang);
				ang2 = Math.sin(i*ang);

				this.vertices.push(ang1, ang2, j*1/this.stacks);
				this.normals.push(ang1, ang2, 0);
				this.texCoords.push(i*1/this.slices, j*1/this.stacks);
					
			}	
		}

		for(k = 0; k < (this.stacks*this.slices); k++){
			if((k+1)%this.slices==0){
    			this.indices.push(k,k+1-this.slices, k+1);
     	        this.indices.push(k,k+1, k+this.slices);
  			 }
  			 if((k+1)%this.slices!=0){
  			 	 this.indices.push(k, k+1, k+1+this.slices);
    			 this.indices.push(k, k+1+this.slices, k+this.slices);
  			 }
		}
		
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};