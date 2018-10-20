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
		this.materialNumber = 0;


	};

	display(textureFather = "" , materialFather = ""){

		this.scene.pushMatrix();

		//var matrix = mat4.create();
		//mat4.translate(matrix , matrix , [3,0,0]);
		this.scene.multMatrix(this.transformations);
		var tempString = "";
		var tempString2 = "";

		if(this.materials[0] == "inherit"){
			var mat = this.scene.graph.materials[materialFather] ;
			tempString = materialFather;
		}
		else {
			var mat = this.scene.graph.materials[this.materials[this.materialNumber]] ;
			tempString = this.materials[this.materialNumber];
		}

		switch(this.texture.id){

			case "inherit" :
				mat.setTexture(this.scene.graph.textures[textureFather]);
				tempString2 = textureFather;
				break;

			case "none" :
				mat.setTexture(null);
				tempString2 = "none";
				break;

			default :
				mat.setTexture(this.scene.graph.textures[this.texture.id]);
				tempString2 = this.texture.id;
				break;
		}


		mat.apply();

		for(var i = 0 ; i < this.children.length ; i++){

			if(this.children[i].type == "primitive"){
				this.scene.graph.elements[this.children[i].id].display();
			}
			else {
			this.scene.graph.components[this.children[i].id].display(tempString2 , tempString);
			}
		}

		this.scene.popMatrix();



	};

	update(){
		this.materialNumber++;
		if(this.materialNumber == this.materials.length){
			this.materialNumber = 0;
		}
	}

};
