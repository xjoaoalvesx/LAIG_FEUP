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
                    coord1.x = this.reader.getFloat(cameras[i].children[0], "x");
                 }
                else this.onXMLMinorError("no x attribute in " + cameras[i].children[0].nodeName);

                 if (cameras[i].children[0].hasAttribute("y")){
                    coord1.y = this.reader.getFloat(cameras[i].children[0], "y");
                 }
                 else this.onXMLMinorError("no y attribute in " + cameras[i].children[0].nodeName);

                 if (cameras[i].children[0].hasAttribute("z")){
                     coord1.z = this.reader.getFloat(cameras[i].children[0], "z");
                }
                else this.onXMLMinorError("no z attribute in " + cameras[i].children[0].nodeName);

                if (cameras[i].children[1].hasAttribute("x")){
                    coord2.x = this.reader.getFloat(cameras[i].children[1], "x");
                 }
                else this.onXMLMinorError("no x attribute in " + cameras[i].children[1].nodeName);

                 if (cameras[i].children[1].hasAttribute("y")){
                    coord2.y = this.reader.getFloat(cameras[i].children[1], "y");
                 }
                 else this.onXMLMinorError("no y attribute in " + cameras[i].children[1].nodeName);

                 if (cameras[i].children[1].hasAttribute("z")){
                     coord2.z = this.reader.getFloat(cameras[i].children[1], "z");
                }
                else this.onXMLMinorError("no z attribute in " + cameras[i].children[1].nodeName);

                cam.from = coord1;
                cam.to = coord2;
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

            }



            this.views.push(cam);
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
        var numLights = 0;



        // Any number of lights.
        for (var i = 0; i < ligthsVect.length; i++) {
            var currLight = {};

            // Get id of the current light.
            if (ligthsVect[i].hasAttribute("id")){
                currLight.id = this.reader.getString(ligthsVect[i], 'id');
            }
            else this.onXMLMinorError("no id atribute");

            if (ligthsVect[i].hasAttribute("enable")){
                currLight.enable = this.reader.getBoolean(ligthsVect[i], 'enable');
            }
            else this.onXMLMinorError("no enable atribute");

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


            }else{
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            this.lights.push(currLight);
            numLights++;

        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
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

           this.textures[textureId] = texturePath;
       }

       console.log("Parsed textures");

       return null;

    }

    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        // TODO: Parse block
        this.log("Parsed materials");
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
        //TODO: Render loop starting at root of graph
    }
}
