/**
 * Component
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Component {


	constructor(scene, id, transformations, materials, texture, children){

		this.scene = scene;
		this.id = id;
		this.transformations = transformations;
		this.materials = materials;
		this.texture = texture;
		this.children = children;


	};

	display(){

		this.scene.pushMatrix();

		//var matrix = mat4.create();
		//mat4.translate(matrix , matrix , [3,0,0]);	
		this.scene.multMatrix(this.transformations);

		var mat = this.scene.graph.materials[this.materials[0]] ;
		

		mat.setTexture(this.scene.graph.textures[this.texture.id]);
		mat.apply();

		console.log(mat);
		for(var i = 0 ; i < this.children.length ; i++){

			if(this.children[i].type == "primitive"){
				this.scene.graph.elements[this.children[i].id].display();
			}
			else {
			this.scene.graph.components[this.children[i].id].display();
			}
		}

		this.scene.popMatrix();



	};



};