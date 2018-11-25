/**
 * Terrain
 * 
 * @constructor
 */

class Terrain extends Plane
{
     constructor(scene, idtexture, idheightmap, parts, heightscale)
     {
       super(scene, parts, parts, 10);
       this.texture = scene.graph.textures[idtexture];
       this.heightmap = scene.graph.textures[idheightmap];
       this.heightscale = heightscale;
       this.app = new CGFappearance(scene);
       this.app.setTexture(this.texture);
       this.scene.terrainShader.setUniformsValues({heightScale: heightscale});

     };

     display(){

      this.app.apply();
     	this.scene.setActiveShader(this.scene.terrainShader);
     	this.heightmap.bind(1);
     	this.planeObj.display();  
     	this.scene.setActiveShader(this.scene.defaultShader);

     };

    

};

