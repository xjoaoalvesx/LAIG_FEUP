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

	display(textureFather = "" , materialFather = ""){

		this.scene.pushMatrix();

		//var matrix = mat4.create();
		//mat4.translate(matrix , matrix , [3,0,0]);	
		this.scene.multMatrix(this.transformations);

		if(this.materials[0] == "inherit"){
			var mat = this.scene.graph.materials[materialFather] ;
		}
		else {
			var mat = this.scene.graph.materials[this.materials[0]] ;
		}
		
		switch(this.texture.id){

			case "inherit" :
				mat.setTexture(this.scene.graph.textures[textureFather]);
				break;

			case "none" :
				mat.setTexture(null);
				break;

			default :
				mat.setTexture(this.scene.graph.textures[this.texture.id]);
				break;
		}

		
		mat.apply();

		for(var i = 0 ; i < this.children.length ; i++){

			if(this.children[i].type == "primitive"){
				this.scene.graph.elements[this.children[i].id].display();
			}
			else {
			this.scene.graph.components[this.children[i].id].display(this.texture.id , this.materials[0]);
			}
		}

		this.scene.popMatrix();



	};



};