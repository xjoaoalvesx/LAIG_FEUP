/**
 * Water
 * 
 * @constructor
 */

 class Water extends Plane
 {

 		constructor(scene,  idtexture, idwavemap, parts, heightscale, texscale){
 			super(scene, parts, parts, 5);
 			this.texture = scene.graph.textures[idtexture];
       		this.wavemap = scene.graph.textures[idwavemap];
       		this.heightscale = heightscale;
       		this.texscale = texscale;
       		this.app = new CGFappearance(scene);
       		this.app.setTexture(this.texture);
       		this.scene.waterShader.setUniformsValues({heightScale: heightscale, textScale: texscale});

 		}


 		display(){

 			this.app.apply();
     		this.scene.setActiveShader(this.scene.waterShader);
     		this.wavemap.bind(1);
     		this.planeObj.display();  
     		this.scene.setActiveShader(this.scene.defaultShader);

 		}







 }