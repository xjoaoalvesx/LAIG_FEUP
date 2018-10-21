var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;


/**
* MySceneGraph class, representing the scene graph.
*/
class MySceneGraph {
/**
 * @constructor
 */
 constructor(filename, scene) {
    this.loadedOk = null;

    // Establish bidirectional references between scene and graph.
    this.scene = scene;
    scene.graph = this;

    this.nodes = [];

    this.idRoot = null;                    // The id of the root element.

    this.axisCoords = [];
    this.axisCoords['x'] = [1, 0, 0];
    this.axisCoords['y'] = [0, 1, 0];
    this.axisCoords['z'] = [0, 0, 1];

    // File reading
    this.reader = new CGFXMLreader();

    /*
     * Read the contents of the xml file, and refer to this class for loading and error handlers.
     * After the file is read, the reader calls onXMLReady on this object.
     * If any error occurs, the reader calls onXMLError on this object, with an error message
     */

     this.reader.open('scenes/' + filename, this);
 }


    /*
 * Callback to be executed after successful reading
 */
 onXMLReady() {
    this.log("XML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;

    // Here should go the calls for different functions to parse the various blocks
    var error = this.parseXMLFile(rootElement);

    if (error != null) {
        this.onXMLError(error);
        return;
    }

    this.loadedOk = true;

    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
}

/**
 * Parses the XML file, processing each block.
 * @param {XML root element} rootElement
 */
 parseXMLFile(rootElement) {

    if (rootElement.nodeName != "yas")
        return "root tag <yas> missing";

    var nodes = rootElement.children;

    // Reads the names of the nodes to an auxiliary buffer.
    var nodeNames = [];

    for (var i = 0; i < nodes.length; i++) {
        nodeNames.push(nodes[i].nodeName);
    }

    var error;

    // Processes each node, verifying errors.

    // <SCENE>

    var index;
    if ((index = nodeNames.indexOf("scene")) == -1)
        return "tag <scene> missing";
    else {
        if (index != SCENE_INDEX)
            this.onXMLMinorError("tag <scene> out of order");

        //Parse SCENE block
        if ((error = this.parseScene(nodes[index])) != null)
            return error;
    }

    // <VIEWS>
    if ((index = nodeNames.indexOf("views")) == -1)
        return "tag <views> missing";
    else {
        if (index != VIEWS_INDEX)
            this.onXMLMinorError("tag <views> out of order");

        //Parse VIEWS block
        if ((error = this.parseViews(nodes[index])) != null)
            return error;
    }

    // <AMBIENT>
    if ((index = nodeNames.indexOf("ambient")) == -1)
        return "tag <ambient> missing";
    else {
        if (index != AMBIENT_INDEX)
            this.onXMLMinorError("tag <ambient> out of order");

        //Parse VIEWS block
        if ((error = this.parseAmbient(nodes[index])) != null)
            return error;
    }



    // <LIGHTS>
    if ((index = nodeNames.indexOf("lights")) == -1)
        return "tag <lights> missing";
    else {
        if (index != LIGHTS_INDEX)
            this.onXMLMinorError("tag <lights> out of order");

        //Parse LIGHTS block
        if ((error = this.parseLights(nodes[index])) != null)
            return error;
    }

    // <TEXTURES>
    if ((index = nodeNames.indexOf("textures")) == -1)
        return "tag <TEXTURES> missing";
    else {
        if (index != TEXTURES_INDEX)
            this.onXMLMinorError("tag <textures> out of order");

        //Parse TEXTURES block
        if ((error = this.parseTextures(nodes[index])) != null)
            return error;
    }

    // <MATERIALS>
    if ((index = nodeNames.indexOf("materials")) == -1)
        return "tag <materials> missing";
    else {
        if (index != MATERIALS_INDEX)
            this.onXMLMinorError("tag <materials> out of order");

        //Parse MATERIALS block
        if ((error = this.parseMaterials(nodes[index])) != null)
            return error;
    }


    // <TRANSFORMATIONS>
    if ((index = nodeNames.indexOf("transformations")) == -1)
        return "tag <transformations> missing";
    else {
        if (index != TRANSFORMATIONS_INDEX)
            this.onXMLMinorError("tag <transformations> out of order");

        //Parse MATERIALS block
        if ((error = this.parseTransformations(nodes[index])) != null)
            return error;
    }


    // <PRIMITIVES>
    if ((index = nodeNames.indexOf("primitives")) == -1)
        return "tag <primitives> missing";
    else {
        if (index != PRIMITIVES_INDEX)
            this.onXMLMinorError("tag <primitives> out of order");

        //Parse MATERIALS block
        if ((error = this.parsePrimitives(nodes[index])) != null)
            return error;
    }


    // <COMPONENTS>
    if ((index = nodeNames.indexOf("components")) == -1)
        return "tag <components> missing";
    else {
        if (index != COMPONENTS_INDEX)
            this.onXMLMinorError("tag <components> out of order");

        //Parse NODES block
        if ((error = this.parseComponents(nodes[index])) != null)
            return error;
    }

}


parseScene(sceneNode){

if (sceneNode.hasAttribute("root" ))
    this.root = this.reader.getString(sceneNode, "root");
else  this.onXMLMinorError("no root attribute");

if (sceneNode.hasAttribute("axis_length" ))
    this.axis_length = this.reader.getFloat(sceneNode, "axis_length");
else  this.onXMLMinorError("no axis_length attribute");

this.log("Parsed scene");
return null;
}

/**
 * Parses the <VIEWS> block.
 * @param {views block element} viewsNode
 */
 parseViews(viewsNode) {

    var cameras = viewsNode.children;
    this.views = [];
    for(var i = 0 ; i < cameras.length ; i++){
        var cam = {};
        if(cameras[i].nodeName == "perspective"){

            if(cameras[i].hasAttribute("id")){
                cam.id = this.reader.getString(cameras[i], "id");
            }
            else this.onXMLMinorError("no camera id attribute");

            if(cameras[i].hasAttribute("near")){
                cam.near = this.reader.getFloat(cameras[i], "near");
            }
            else this.onXMLMinorError("no near attribute");

            if(cameras[i].hasAttribute("far")){
                cam.far = this.reader.getFloat(cameras[i], "far");
            }
            else this.onXMLMinorError("no far attribute");

            if(cameras[i].hasAttribute("angle")){
                cam.angle = this.reader.getFloat(cameras[i], "angle");
            }
            else this.onXMLMinorError("no angle attribute");


            var coord1 = [];
            var coord2 =[];
            if (cameras[i].children[0].hasAttribute("x")){
                coord1.push(this.reader.getFloat(cameras[i].children[0], "x"));
            }
            else this.onXMLMinorError("no x attribute in " + cameras[i].children[0].nodeName);

            if (cameras[i].children[0].hasAttribute("y")){
                coord1.push(this.reader.getFloat(cameras[i].children[0], "y"));
            }
            else this.onXMLMinorError("no y attribute in " + cameras[i].children[0].nodeName);

            if (cameras[i].children[0].hasAttribute("z")){
             coord1.push(this.reader.getFloat(cameras[i].children[0], "z"));
            }
            else this.onXMLMinorError("no z attribute in " + cameras[i].children[0].nodeName);

            if (cameras[i].children[1].hasAttribute("x")){
                coord2.push(this.reader.getFloat(cameras[i].children[1], "x"));
            }
            else this.onXMLMinorError("no x attribute in " + cameras[i].children[1].nodeName);

            if (cameras[i].children[1].hasAttribute("y")){
                coord2.push(this.reader.getFloat(cameras[i].children[1], "y"));
            }
            else this.onXMLMinorError("no y attribute in " + cameras[i].children[1].nodeName);

            if (cameras[i].children[1].hasAttribute("z")){
                coord2.push(this.reader.getFloat(cameras[i].children[1], "z"));
            }
            else this.onXMLMinorError("no z attribute in " + cameras[i].children[1].nodeName);

            coord1.push(1);
            coord2.push(1);
            cam.from = coord1;
            cam.to = coord2;
            this.views.push(new CGFcamera(cam.angle, cam.near, cam.far, cam.from, cam.to));
        }


        else if (cameras[i].nodeName == "ortho"){

            if(cameras[i].hasAttribute("id")){
                cam.id = this.reader.getString(cameras[i], "id");
            }
            else this.onXMLMinorError("no camera id attribute");

            if(cameras[i].hasAttribute("near")){
                cam.near = this.reader.getFloat(cameras[i], "near");
            }
            else this.onXMLMinorError("no near attribute");

            if(cameras[i].hasAttribute("far")){
                cam.far = this.reader.getFloat(cameras[i], "far");
            }
            else this.onXMLMinorError("no far attribute");

            if(cameras[i].hasAttribute("left")){
                cam.left = this.reader.getFloat(cameras[i], "left");
            }
            else this.onXMLMinorError("no left attribute");

            if(cameras[i].hasAttribute("right")){
                cam.right = this.reader.getFloat(cameras[i], "right");
            }
            else this.onXMLMinorError("no right attribute");

            if(cameras[i].hasAttribute("top")){
                cam.top = this.reader.getFloat(cameras[i], "top");
            }
            else this.onXMLMinorError("no top attribute");

            if(cameras[i].hasAttribute("bottom")){
                cam.bottom = this.reader.getFloat(cameras[i], "bottom");
            }
            else this.onXMLMinorError("no bottom attribute");

            var coord1 = [];
            var coord2 =[];
            if (cameras[i].children[0].hasAttribute("x")){
                coord1.push(this.reader.getFloat(cameras[i].children[0], "x"));
            }
            else this.onXMLMinorError("no x attribute in " + cameras[i].children[0].nodeName);

            if (cameras[i].children[0].hasAttribute("y")){
                coord1.push(this.reader.getFloat(cameras[i].children[0], "y"));
            }
            else this.onXMLMinorError("no y attribute in " + cameras[i].children[0].nodeName);

            if (cameras[i].children[0].hasAttribute("z")){
             coord1.push(this.reader.getFloat(cameras[i].children[0], "z"));
            }
            else this.onXMLMinorError("no z attribute in " + cameras[i].children[0].nodeName);

            if (cameras[i].children[1].hasAttribute("x")){
                coord2.push(this.reader.getFloat(cameras[i].children[1], "x"));
            }
            else this.onXMLMinorError("no x attribute in " + cameras[i].children[1].nodeName);

            if (cameras[i].children[1].hasAttribute("y")){
                coord2.push(this.reader.getFloat(cameras[i].children[1], "y"));
            }
            else this.onXMLMinorError("no y attribute in " + cameras[i].children[1].nodeName);

            if (cameras[i].children[1].hasAttribute("z")){
                coord2.push(this.reader.getFloat(cameras[i].children[1], "z"));
            }
            else this.onXMLMinorError("no z attribute in " + cameras[i].children[1].nodeName);

            cam.from = coord1;
            cam.to = coord2;

            this.views.push(new CGFcamera( cam.left, cam.right, cam.bottom, cam.top, cam.near, cam.far, cam.position, cam.target, [0,1,0] ));

        }


    }


    this.log("Parsed views");

    return null;
}

 /**
 * Parses the <AMBIENT> node.
 * @param {ambient block element} ambientNode
 */

 parseAmbient(ambientNode){

    this.ambient = [];

    for (var i = 0 ; i < ambientNode.children.length ; i++){
        var color = {};
        if (ambientNode.children[i].hasAttribute("r")){
            color.r = this.reader.getFloat(ambientNode.children[i], "r");
        }
        else this.onXMLMinorError("no r attribute in " + ambientNode.children[i].nodeName);

        if (ambientNode.children[i].hasAttribute("g")){
            color.g = this.reader.getFloat(ambientNode.children[i], "g");
        }
        else this.onXMLMinorError("no g attribute in " + ambientNode.children[i].nodeName);

        if (ambientNode.children[i].hasAttribute("b")){
            color.b = this.reader.getFloat(ambientNode.children[i], "b");
        }
        else this.onXMLMinorError("no b attribute in " + ambientNode.children[i].nodeName);

        if (ambientNode.children[i].hasAttribute("a")){
            color.a = this.reader.getFloat(ambientNode.children[i], "a");
        }
        else this.onXMLMinorError("no a attribute in " + ambientNode.children[i].nodeName);

        this.ambient.push(color);

    }

    this.log("Parsed ambient");

    return null;
}


/**
 * Parses the <LIGHTS> node.
 * @param {lights block element} lightsNode
 */
 parseLights(lightsNode) {

    var ligthsVect = lightsNode.children;

    this.lights = [];
    var omniLights = 0;
    var spotLights = 0;



    // Any number of lights.
    for (var i = 0; i < ligthsVect.length; i++) {
        var currLight = {};

        // Get id of the current light.
        if (ligthsVect[i].hasAttribute("id")){
            currLight.id = this.reader.getString(ligthsVect[i], 'id');
        }
        else this.onXMLMinorError("no id atribute");

        for(var l = 0; l < this.lights.length; l++){
            if(currLight.id == this.lights[l].id){
                return "ID must be unique for each light (conflict: ID = " + this.lights[l].id + ")";
            }
        }

        if (ligthsVect[i].hasAttribute("enabled")){
            currLight.enabled = this.reader.getBoolean(ligthsVect[i], 'enabled');
        }
        else this.onXMLMinorError("no enabled atribute");

        if (ligthsVect[i].nodeName == "omni") {
            var loc = {};
            var amb = {};
            var dif = {};
            var spec = {};

            if (ligthsVect[i].children[0].hasAttribute("x")){
                loc.x = this.reader.getFloat(ligthsVect[i].children[0], "x");
            }
            else this.onXMLMinorError("no x attribute in " + ligthsVect[i].children[0].nodeName);

            if (ligthsVect[i].children[0].hasAttribute("y")){
                loc.y = this.reader.getFloat(ligthsVect[i].children[0], "y");
            }
            else this.onXMLMinorError("no y attribute in " + ligthsVect[i].children[0].nodeName);

            if (ligthsVect[i].children[0].hasAttribute("z")){
             loc.z = this.reader.getFloat(ligthsVect[i].children[0], "z");
         }
         else this.onXMLMinorError("no z attribute in " + ligthsVect[i].children[0].nodeName);

         if (ligthsVect[i].children[0].hasAttribute("w")){
            loc.w = this.reader.getFloat(ligthsVect[i].children[0], "w");
        }
        else this.onXMLMinorError("no w attribute in " + ligthsVect[i].children[0].nodeName);

        currLight.location = loc;

        if (ligthsVect[i].children[1].hasAttribute("r")){
            amb.r = this.reader.getFloat(ligthsVect[i].children[1], "r");
        }
        else this.onXMLMinorError("no r attribute in ambient");

        if (ligthsVect[i].children[1].hasAttribute("g")){
            amb.g = this.reader.getFloat(ligthsVect[i].children[1], "g");
        }
        else this.onXMLMinorError("no g attribute in ambient");

        if (ligthsVect[i].children[1].hasAttribute("b")){
            amb.b = this.reader.getFloat(ligthsVect[i].children[1], "b");
        }
        else this.onXMLMinorError("no b attribute in ambient");

        if (ligthsVect[i].children[1].hasAttribute("a")){
            amb.a = this.reader.getFloat(ligthsVect[i].children[1], "a");
        }
        else this.onXMLMinorError("no w attribute in ambient");

        currLight.ambient = amb;

        if (ligthsVect[i].children[2].hasAttribute("r")){
            dif.r = this.reader.getFloat(ligthsVect[i].children[2], "r");
        }
        else this.onXMLMinorError("no r attribute in diffuse");

        if (ligthsVect[i].children[2].hasAttribute("g")){
            dif.g = this.reader.getFloat(ligthsVect[i].children[2], "g");
        }
        else this.onXMLMinorError("no g attribute in diffuse");

        if (ligthsVect[i].children[2].hasAttribute("b")){
            dif.b = this.reader.getFloat(ligthsVect[i].children[2], "b");
        }
        else this.onXMLMinorError("no b attribute in diffuse");

        if (ligthsVect[i].children[2].hasAttribute("a")){
            dif.a = this.reader.getFloat(ligthsVect[i].children[2], "a");
        }
        else this.onXMLMinorError("no a attribute in diffuse");

        currLight.diffuse = dif;

        if (ligthsVect[i].children[3].hasAttribute("r")){
            spec.r = this.reader.getFloat(ligthsVect[i].children[3], "r");
        }
        else this.onXMLMinorError("no r attribute in specular");

        if (ligthsVect[i].children[3].hasAttribute("g")){
            spec.g = this.reader.getFloat(ligthsVect[i].children[3], "g");
        }
        else this.onXMLMinorError("no g attribute in specular");

        if (ligthsVect[i].children[3].hasAttribute("b")){
            spec.b = this.reader.getFloat(ligthsVect[i].children[3], "b");
        }
        else this.onXMLMinorError("no b attribute in specular");

        if (ligthsVect[i].children[3].hasAttribute("a")){
            spec.a = this.reader.getFloat(ligthsVect[i].children[3], "a");
        }
        else this.onXMLMinorError("no a attribute in specular");

        currLight.specular = spec;

        omniLights++;


    }
    else if(ligthsVect[i].nodeName == "spot"){

        if (ligthsVect[i].hasAttribute("angle")){
            currLight.angle = this.reader.getFloat(ligthsVect[i], 'angle');
        }
        else this.onXMLMinorError("no angle atribute");

        if (ligthsVect[i].hasAttribute("exponent")){
            currLight.exponent = this.reader.getFloat(ligthsVect[i], 'exponent');
        }
        else this.onXMLMinorError("no exponent atribute");

        var loc = {};
        var targ = {};
        var amb = {};
        var dif = {};
        var spec = {};

        if (ligthsVect[i].children[0].hasAttribute("x")){
            loc.x = this.reader.getFloat(ligthsVect[i].children[0], "x");
        }
        else this.onXMLMinorError("no x attribute in " + children[i].children[0].nodeName);

        if (ligthsVect[i].children[0].hasAttribute("y")){
            loc.y = this.reader.getFloat(ligthsVect[i].children[0], "y");
        }
        else this.onXMLMinorError("no y attribute in " + ligthsVect[i].children[0].nodeName);

        if (ligthsVect[i].children[0].hasAttribute("z")){
         loc.z = this.reader.getFloat(ligthsVect[i].children[0], "z");
     }
     else this.onXMLMinorError("no z attribute in " + ligthsVect[i].children[0].nodeName);

     if (ligthsVect[i].children[0].hasAttribute("w")){
        loc.w = this.reader.getFloat(ligthsVect[i].children[0], "w");
    }
    else this.onXMLMinorError("no w attribute in " + ligthsVect[i].children[0].nodeName);

    currLight.location = loc;

    if (ligthsVect[i].children[1].hasAttribute("x")){
        targ.x = this.reader.getFloat(ligthsVect[i].children[1], "x");
    }
    else this.onXMLMinorError("no x attribute in " + ligthsVect[i].children[1].nodeName);

    if (ligthsVect[i].children[1].hasAttribute("y")){
        targ.y = this.reader.getFloat(ligthsVect[i].children[1], "y");
    }
    else this.onXMLMinorError("no y attribute in " + ligthsVect[i].children[1].nodeName);

    if (ligthsVect[i].children[1].hasAttribute("z")){
     targ.z = this.reader.getFloat(ligthsVect[i].children[1], "z");
 }
 else this.onXMLMinorError("no z attribute in " + ligthsVect[i].children[1].nodeName);

 currLight.target = targ;

 if (ligthsVect[i].children[2].hasAttribute("r")){
    amb.r = this.reader.getFloat(ligthsVect[i].children[2], "r");
}
else this.onXMLMinorError("no r attribute in ambient");

if (ligthsVect[i].children[2].hasAttribute("g")){
    amb.g = this.reader.getFloat(ligthsVect[i].children[2], "g");
}
else this.onXMLMinorError("no g attribute in ambient");

if (ligthsVect[i].children[2].hasAttribute("b")){
    amb.b = this.reader.getFloat(ligthsVect[i].children[2], "b");
}
else this.onXMLMinorError("no b attribute in ambient");

if (ligthsVect[i].children[2].hasAttribute("a")){
    amb.a = this.reader.getFloat(ligthsVect[i].children[2], "a");
}
else this.onXMLMinorError("no w attribute in ambient");

currLight.ambient = amb;

if (ligthsVect[i].children[3].hasAttribute("r")){
    dif.r = this.reader.getFloat(ligthsVect[i].children[3], "r");
}
else this.onXMLMinorError("no r attribute in diffuse");

if (ligthsVect[i].children[3].hasAttribute("g")){
    dif.g = this.reader.getFloat(ligthsVect[i].children[3], "g");
}
else this.onXMLMinorError("no g attribute in diffuse");

if (ligthsVect[i].children[3].hasAttribute("b")){
    dif.b = this.reader.getFloat(ligthsVect[i].children[3], "b");
}
else this.onXMLMinorError("no b attribute in diffuse");

if (ligthsVect[i].children[3].hasAttribute("a")){
    dif.a = this.reader.getFloat(ligthsVect[i].children[3], "a");
}
else this.onXMLMinorError("no a attribute in diffuse");

currLight.diffuse = dif;

if (ligthsVect[i].children[4].hasAttribute("r")){
    spec.r = this.reader.getFloat(ligthsVect[i].children[4], "r");
}
else this.onXMLMinorError("no r attribute in specular");

if (ligthsVect[i].children[4].hasAttribute("g")){
    spec.g = this.reader.getFloat(ligthsVect[i].children[4], "g");
}
else this.onXMLMinorError("no g attribute in specular");

if (ligthsVect[i].children[4].hasAttribute("b")){
    spec.b = this.reader.getFloat(ligthsVect[i].children[4], "b");
}
else this.onXMLMinorError("no b attribute in specular");

if (ligthsVect[i].children[4].hasAttribute("a")){
    spec.a = this.reader.getFloat(ligthsVect[i].children[4], "a");
}
else this.onXMLMinorError("no a attribute in specular");

currLight.specular = spec;
spotLights++;

}else{
    this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
    continue;
}

this.lights.push(currLight);


}

if (omniLights == 0)
    return "at least one omni light must be defined";
else if(spotLights == 0)
    return "at least one spot light must be defined";
else if (omniLights + spotLights > 8)
    this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

this.log("Parsed lights");

return null;
}

/**
 * Parses the <TEXTURES> block.
 * @param {textures block element} texturesNode
 */
 parseTextures(texturesNode) {

    this.textures = [];
    var text = texturesNode.children;

    // Any number of textures.
    for (var i = 0; i < text.length; i++) {

       if (text[i].nodeName != "texture") {
           this.onXMLMinorError("unknown tag <" + text[i].nodeName + ">");
           continue;
       }

       // Get id of the current texture.
       var textureId = this.reader.getString(text[i], 'id');
       if (textureId == null)
           return "no ID defined for texture";

       // Checks for repeated IDs.
       if (this.textures[textureId] != null)
           return "ID must be unique for each texture (conflict: ID = " + textureId + ")";

       var texturePath = this.reader.getString(text[i], 'file');
       if (texturePath == null)
           return "no file path defined for texture with ID = " + textureId + ")";

       this.textures[textureId] = new CGFtexture(this.scene, texturePath);
   }

   console.log("Parsed textures");

   return null;

}

/**
 * Parses the <MATERIALS> node.
 * @param {materials block element} materialsNode
 */
 parseMaterials(materialsNode) {

    this.materials = [];
    var numMaterials = 0;

    var mater = materialsNode.children;

    for (var i = 0; i < mater.length; i++) {
        var currMaterial = {};

        if (mater[i].nodeName != "material") {
            this.onXMLMinorError("unknown tag <" + mater[i].nodeName + ">");
            continue;
        }

        // Get id of the current material.
        currMaterial.materId = this.reader.getString(mater[i], 'id');

        if (currMaterial.materId == null)
            return "no ID defined for material";

        // Checks for repeated IDs.
        if (this.materials[currMaterial.materId] != null)
            return "ID must be unique for each material (conflict: ID = " + currMaterial.materId + ")";

        // Get shininess of current material
        if(mater[i].hasAttribute("shininess"))
            currMaterial.shininess = this.reader.getFloat(mater[i], 'shininess');
        else this.onXMLMinorError("no shininess attribute in material " + mater[i].id);

        currMaterial.emission = [];

        if(mater[i].children[0].nodeName != "emission"){
            this.onXMLMinorError("unknown tag <" + mater[i].children[0].nodeName + ">");
            continue;
        }
        if (mater[i].children[0].hasAttribute("r")){
            currMaterial.emission.push(this.reader.getFloat(mater[i].children[0], "r"));
        }
        else this.onXMLMinorError("no r attribute in emission");

        if (mater[i].children[0].hasAttribute("g")){
            currMaterial.emission.push(this.reader.getFloat(mater[i].children[0], "g"));
        }

        else this.onXMLMinorError("no g attribute in emission");

        if (mater[i].children[0].hasAttribute("b")){
            currMaterial.emission.push(this.reader.getFloat(mater[i].children[0], "b"));
        }

        else this.onXMLMinorError("no b attribute in emission");

        if (mater[i].children[0].hasAttribute("a")){
            currMaterial.emission.push(this.reader.getFloat(mater[i].children[0], "a"));
        }

        else this.onXMLMinorError("no a attribute in emission");


        currMaterial.ambient = [];

        if(mater[i].children[1].nodeName != "ambient"){
            this.onXMLMinorError("unknown tag <" + mater[i].children[1].nodeName + ">");
            continue;
        }

        if (mater[i].children[1].hasAttribute("r")){
            currMaterial.ambient.push(this.reader.getFloat(mater[i].children[1], "r"));
        }

        else this.onXMLMinorError("no r attribute in ambient");

        if (mater[i].children[1].hasAttribute("g")){
            currMaterial.ambient.push(this.reader.getFloat(mater[i].children[1], "g"));
        }

        else this.onXMLMinorError("no g attribute in ambient");

        if (mater[i].children[1].hasAttribute("b")){
            currMaterial.ambient.push(this.reader.getFloat(mater[i].children[1], "b"));
        }

        else this.onXMLMinorError("no b attribute in ambient");

        if (mater[i].children[1].hasAttribute("a")){
            currMaterial.ambient.push(this.reader.getFloat(mater[i].children[1], "a"));
        }

        else this.onXMLMinorError("no a attribute in ambient");


        currMaterial.diffuse = [];

        if(mater[i].children[2].nodeName != "diffuse"){
            this.onXMLMinorError("unknown tag <" + mater[i].children[2].nodeName + ">");
            continue;
        }

        if (mater[i].children[2].hasAttribute("r")){
            currMaterial.diffuse.push(this.reader.getFloat(mater[i].children[2], "r"));
        }

        else this.onXMLMinorError("no r attribute in diffuse");

        if(mater[i].children[2].hasAttribute("g")){
            currMaterial.diffuse.push(this.reader.getFloat(mater[i].children[2], "g"));
        }

        else this.onXMLMinorError("no g attribute in diffuse");

        if(mater[i].children[2].hasAttribute("b")){
            currMaterial.diffuse.push(this.reader.getFloat(mater[i].children[2], "b"));
        }

        else this.onXMLMinorError("no b attribute in diffuse");

        if(mater[i].children[2].hasAttribute("a")){
            currMaterial.diffuse.push(this.reader.getFloat(mater[i].children[2], "a"));
        }

        else this.onXMLMinorError("no a attribute in diffuse");


        currMaterial.specular = [];

        if(mater[i].children[3].nodeName != "specular"){
            this.onXMLMinorError("unknown tag <" + mater[i].children[3].nodeName + ">");
            continue;
        }

        if (mater[i].children[3].hasAttribute("r")){
            currMaterial.specular.push(this.reader.getFloat(mater[i].children[3], "r"));

        }

        else this.onXMLMinorError("no r attribute in specular");

        if (mater[i].children[3].hasAttribute("g")){
            currMaterial.specular.push(this.reader.getFloat(mater[i].children[3], "g"));
        }

        else this.onXMLMinorError("no g attribute in specular");

        if (mater[i].children[3].hasAttribute("b")){
            currMaterial.specular.push(this.reader.getFloat(mater[i].children[3], "b"));
        }

        else this.onXMLMinorError("no b attribute in specular");

        if (mater[i].children[3].hasAttribute("a")){
            currMaterial.specular.push(this.reader.getFloat(mater[i].children[3], "a"));
        }

        else this.onXMLMinorError("no a attribute in specular");

        var appearance = new CGFappearance(this.scene);

        appearance.setAmbient(currMaterial.ambient[0],currMaterial.ambient[1],currMaterial.ambient[2],currMaterial.ambient[3]);
        appearance.setDiffuse(currMaterial.diffuse[0],currMaterial.diffuse[1],currMaterial.diffuse[2],currMaterial.diffuse[3]);
        appearance.setSpecular(currMaterial.specular[0],currMaterial.specular[1],currMaterial.specular[2],currMaterial.specular[3]);
        appearance.setEmission(currMaterial.emission[0],currMaterial.emission[1],currMaterial.emission[2],currMaterial.emission[3]);
        appearance.setShininess(currMaterial.shininess);

        this.materials[currMaterial.materId] = appearance;
        numMaterials++;
    }


    if(numMaterials == 0)
        return "at least one material must be defined";

    this.log("Parsed materials");
    return null;

}

/**
 * Parses the <TRANSFORMATIONS> node.
 * @param {transformations block element} transformationsNode
 */
 parseTransformations(transformationsNode){

    this.transformations = [];
    var trans = transformationsNode.children;

    // Any number of transformations.
    for (var i = 0; i < trans.length; i++) {
        //var currTransBlock = [];
        var matrix = mat4.create();
       if (trans[i].nodeName != "transformation") {
           this.onXMLMinorError("unknown tag <" + trans[i].nodeName + ">");
           continue;
       }

       // Get id of the current transformation.
       var transId = this.reader.getString(trans[i], 'id');
       if (transId == null)
           return "no ID defined for transformation";

       // Checks for repeated IDs.
       if (this.transformations[transId] != null)
           return "ID must be unique for each transformation (conflict: ID = " + transId + ")";

       for(var u = 0; u < trans[i].children.length; u++){
           var currTrans = [];
           var transformationtype = trans[i].children[u].nodeName;
           switch(transformationtype){
               case "translate":
               currTrans.push("translate");
               if (trans[i].children[u].hasAttribute("x")){
                currTrans.push(this.reader.getFloat(trans[i].children[u], "x"));
            }
            else this.onXMLMinorError("no x attribute in translate");

            if (trans[i].children[u].hasAttribute("y")){
                currTrans.push(this.reader.getFloat(trans[i].children[u], "y"));             }
                else this.onXMLMinorError("no y attribute in translate");

                if (trans[i].children[u].hasAttribute("z")){
                    currTrans.push(this.reader.getFloat(trans[i].children[u], "z"));             }
                    else this.onXMLMinorError("no z attribute in translate");

                    mat4.translate(matrix ,matrix ,[currTrans[1],currTrans[2],currTrans[3]]);
                    break;
                    case "rotate":
                    currTrans.push("rotate");
                    if (trans[i].children[u].hasAttribute("axis")){
                        currTrans.push(this.reader.getString(trans[i].children[u], "axis"));
                    }
                    else this.onXMLMinorError("no axis attribute in rotate");

                    if (trans[i].children[u].hasAttribute("angle")){
                        currTrans.push(this.reader.getFloat(trans[i].children[u], "angle"));             }
                        else this.onXMLMinorError("no angle attribute in rotate");


                        mat4.rotate(matrix, matrix, currTrans[2]*DEGREE_TO_RAD , this.axisCoords[currTrans[1]]);

                        break;
                        case "scale":
                        currTrans.push("scale");
                        if (trans[i].children[u].hasAttribute("x")){
                            currTrans.push(this.reader.getFloat(trans[i].children[u], "x"));
                        }
                        else this.onXMLMinorError("no x attribute in scale");

                        if (trans[i].children[u].hasAttribute("y")){
                            currTrans.push(this.reader.getFloat(trans[i].children[u], "y"));             }
                            else this.onXMLMinorError("no y attribute in scale");

                            if (trans[i].children[u].hasAttribute("z")){
                                currTrans.push(this.reader.getFloat(trans[i].children[u], "z"));             }
                                else this.onXMLMinorError("no z attribute in scale");
                                mat4.scale(matrix, matrix, [currTrans[1],currTrans[2],currTrans[3]]);

                                break;
                                default:
                                this.onXMLMinorError("unknown tag <" + trans[i].children[u].nodeName + ">");
                                break;
                            }

                        }




                        this.transformations[transId] = matrix;
                    }
                    this.log("Parsed transformations");
                    return null;
}



 /**
 * Parses the <PRIMITIVES> node.
 * @param {primitives block element} primitivesNode
 */
 parsePrimitives(primitivesNode){

    this.elements = [];
    var primitives = primitivesNode.children;

    for(var i = 0 ; i < primitives.length ; i++){
        var primitiveId = this.reader.getString(primitives[i] , 'id');
        for(var u = 0 ; u < primitives[i].children.length ; u++){

            var currChild = primitives[i].children[u];
            switch(currChild.nodeName){
                case "rectangle" :
                var x1 = this.reader.getFloat(currChild , 'x1');
                var y1 = this.reader.getFloat(currChild , 'y1');
                var x2 = this.reader.getFloat(currChild , 'x2');
                var y2 = this.reader.getFloat(currChild , 'y2');
                var quad = new MyRectangle(this.scene,x1,x2,y1,y2);
                this.elements[primitiveId] = quad;
                break;
                case "cylinder" :
                var base = this.reader.getFloat(currChild , 'base');
                var top = this.reader.getFloat(currChild , 'top');
                var height = this.reader.getFloat(currChild , 'height');
                var slices = this.reader.getInteger(currChild , 'slices')
                var stacks = this.reader.getInteger(currChild , 'stacks');
                var cylinder = new MyCylinder(this.scene , slices , stacks)
                this.elements[primitiveId] = cylinder;
                break;
                case "triangle" :
                var x1 = this.reader.getFloat(currChild , 'x1');
                var y1 = this.reader.getFloat(currChild , 'y1');
                var z1 = this.reader.getFloat(currChild , 'z1');
                var x2 = this.reader.getFloat(currChild , 'x2');
                var y2 = this.reader.getFloat(currChild , 'y2');
                var z2 = this.reader.getFloat(currChild , 'z2');
                var x3 = this.reader.getFloat(currChild , 'x3');
                var y3 = this.reader.getFloat(currChild , 'y3');
                var z3 = this.reader.getFloat(currChild , 'z3');
                var triangle = new Triangle(this.scene, x1 ,x2 ,x3 , y1, y2, y3, z1, z2, z3);
                this.elements[primitiveId] = triangle;
                break;
                case "sphere" :
                var radius = this.reader.getFloat(currChild , 'radius');
                var slices = this.reader.getInteger(currChild , 'slices');
                var stacks = this.reader.getInteger(currChild , 'stacks');
                var sphere = new Sphere(this.scene , radius , slices , stacks);
                this.elements[primitiveId] = sphere;
                break;
                case "torus" :
                var inner = this.reader.getFloat(currChild , 'inner');
                var outer = this.reader.getFloat(currChild , 'outer');
                var slices = this.reader.getInteger(currChild , 'slices');
                var loops = this.reader.getInteger(currChild , 'loops');
                var torus = new Torus(this.scene, inner, outer, slices, loops);
                this.elements[primitiveId] = torus;
                break;

                default:
                break;

            }
        }
    }


    this.log("Parsed primitives");
    return null;
}



/**
* Parses the <COMPONENTS> block.
* @param {nodes block element} componentsNode
* */
parseComponents(componentsNode) {

    this.components = [];
    var comp = componentsNode.children;
    for(var i = 0; i < comp.length; i++){

        var currComponent = [];
        if (comp[i].nodeName != "component") {
            this.onXMLMinorError("unknown tag <" + comp[i].nodeName + ">");
            continue;
        }

        // Get id of the current component.
        var compId = this.reader.getString(comp[i], 'id');
        if (compId == null){
            return "no ID defined for component";
        }

        // Checks for repeated IDs.
        if (this.components[compId] != null){
            return ("ID must be unique for each component (conflict: ID = " + compId + ")");
        }

        if(comp[i].children[0].nodeName != "transformation"){
            this.onXMLMinorError("unknown tag <" + comp[i].children[0].nodeName + "> expected transformation tag");
            continue;
        }

        var transfBlock = mat4.create();
        if(comp[i].children[0].children[0] != null){
          if (comp[i].children[0].children[0].nodeName == "transformationref"){
              var trId = this.reader.getString(comp[i].children[0].children[0], 'id');

              if(this.transformations[trId] == null)
                  return "There is no transformation " + trId;

              transfBlock = this.transformations[trId];
          }

          else{

              var trans = comp[i].children[0].children;

              for(var u = 0; u < trans.length; u++){

                  var currTrans = [];

                  var transformationtype = trans[u].nodeName;

                  switch(transformationtype){

                      case "translate":

                          currTrans.push("translate");
                          if (trans[u].hasAttribute("x")){
                              currTrans.push(this.reader.getFloat(trans[u], "x"));
                          }

                          else this.onXMLMinorError("no x attribute in translate");

                          if (trans[u].hasAttribute("y")){
                              currTrans.push(this.reader.getFloat(trans[u], "y"));
                          }

                          else this.onXMLMinorError("no y attribute in translate");

                          if (trans[u].hasAttribute("z")){
                              currTrans.push(this.reader.getFloat(trans[u], "z"));
                          }

                          else this.onXMLMinorError("no z attribute in translate");

                          mat4.translate(transfBlock ,transfBlock ,[currTrans[1],currTrans[2],currTrans[3]]);
                          break;

                      case "rotate":

                          currTrans.push("rotate");
                          if (trans[u].hasAttribute("axis")){
                              currTrans.push(this.reader.getString(trans[u], "axis"));
                          }

                          else this.onXMLMinorError("no axis attribute in rotate");

                          if (trans[u].hasAttribute("angle")){
                              currTrans.push(this.reader.getFloat(trans[u], "angle"));
                          }

                          else this.onXMLMinorError("no angle attribute in rotate");

                          mat4.rotate(transfBlock, transfBlock, currTrans[2]*DEGREE_TO_RAD , this.axisCoords[currTrans[1]]);
                          break;

                      case "scale":

                          currTrans.push("scale");
                          if (trans[u].hasAttribute("x")){
                              currTrans.push(this.reader.getFloat(trans[u], "x"));
                          }

                          else this.onXMLMinorError("no x attribute in scale");

                          if (trans[u].hasAttribute("y")){
                              currTrans.push(this.reader.getFloat(trans[u], "y"));
                          }

                          else this.onXMLMinorError("no y attribute in scale");

                          if (trans[u].hasAttribute("z")){
                              currTrans.push(this.reader.getFloat(trans[u], "z"));
                          }

                          else this.onXMLMinorError("no z attribute in scale");

                          mat4.scale(transfBlock, transfBlock, [currTrans[1],currTrans[2],currTrans[3]]);
                          break;

                      default:
                          this.onXMLMinorError("unknown tag <" + trans[u].nodeName + ">");
                          break;
                  }



              }

              //currComponent.push(transfBlock);
          }
        }

        if(comp[i].children[1].nodeName != "materials"){
            this.onXMLMinorError("unknown tag <" + comp[i].children[1].nodeName + "> expected materials tag");
            continue;
        }

        var materialBlock = [];
        var mater = comp[i].children[1].children;

        for(var u = 0; u < mater.length; u++){

            if(mater[u].nodeName != "material"){
                this.onXMLMinorError("unknown tag <" + child[u].nodeName + "> expected material tag");
                continue;
            }

            var material = this.reader.getString(mater[u], 'id');

            if(this.materials[material] == null && (material != "inherit")){
                this.onXMLMinorError("the material " + material + " does not exist");
                continue;
            }

            materialBlock.push(material);
        }

        //currComponent.push(materialBlock);

        var textu = {};

        if(comp[i].children[2].nodeName != "texture"){
            this.onXMLMinorError("unknown tag <" + comp[i].children[2].nodeName + "> expected texture tag");
            continue;
        }

        if(comp[i].children[2].hasAttribute('id'))
            textu.id = this.reader.getString(comp[i].children[2], 'id');

        else{
            this.onXMLMinorError("No id atribute in texture in component " + compId);
            continue;
        }

        textu.length_s = this.reader.getFloat(comp[i].children[2], 'length_s');
        textu.length_t = this.reader.getFloat(comp[i].children[2], 'length_t');

        //currComponent.push(textu);

        if(comp[i].children[3].nodeName != "children"){
            this.onXMLMinorError("unknown tag <" + comp[i].children[2].nodeName + "> expected children tag");
            continue;
        }

        var childrenBlock = [];
        var childs = comp[i].children[3].children;

        for(var u = 0; u < childs.length; u++){

            var currChild = {};
            if(childs[u].nodeName != "componentref" && childs[u].nodeName != "primitiveref"){
                this.onXMLMinorError("unknown tag <" + childs[u].nodeName + "> expected componentref or primitiveref tag");
                continue;
            }

            if(childs[u].nodeName == "componentref"){
                currChild.type = "component";
            }
            else {
                currChild.type = "primitive";
            }

            if(childs[u].hasAttribute("id")){
                currChild.id = this.reader.getString(childs[u], 'id');
            }

            else {
                this.onXMLMinorError("no id attribute in " + childs[u].nodeName);
            }


            childrenBlock.push(currChild);
        }


        //currComponent.push(childrenBlock);
        this.components[compId] = new Component(this.scene , compId, transfBlock, materialBlock, textu, childrenBlock);
    }
        this.log("Parsed components");
        return null;

}






/**
 * Parses the <NODES> block.
 * @param {nodes block element} nodesNode
 */
 parseNodes(nodesNode) {
    // TODO: Parse block
    this.log("Parsed nodes");
    return null;
}

/*
 * Callback to be executed on any read error, showing an error on the console.
 * @param {string} message
 */
 onXMLError(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
}

/**
 * Callback to be executed on any minor error, showing a warning on the console.
 * @param {string} message
 */
 onXMLMinorError(message) {
    console.warn("Warning: " + message);
}


/**
 * Callback to be executed on any message.
 * @param {string} message
 */
 log(message) {
    console.log("   " + message);
}

/**
 * Displays the scene, processing each node, starting in the root node.
 */
 displayScene() {
    // entry point for graph rendering

    /*for(var i = 0; i < this.elements.length; i++){
        this.elements[i].display();
    }*/

    //this.elements[0].display();
    //this.elements[1].display();
    //this.elements[2].display();
    //this.elements[3].display();
    //

    this.components[this.root].display();


}
}
