var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
        this.Start = false;

    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.materialDefault = new CGFappearance(this);

        this.waterShader = new CGFshader(this.gl, "shaders/water.vert", "shaders/water.frag");
        this.waterShader.setUniformsValues({uSampler2: 1});


        this.game = new Game(this);


        this.setPickEnabled(true);
        this.setUpdatePeriod(1./60);

    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.8, 0.1, 500, vec4.fromValues(2.6, 3, 2.5, 1), vec4.fromValues(2.4, 0, 2.5, 1));
        this.interface.setActiveCamera(this.camera);
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];


                //lights are predefined in cgfscene
                this.lights[i].setPosition(light.location.x, light.location.y, light.location.z, light.location.w);
                this.lights[i].setAmbient(light.ambient.r, light.ambient.g, light.ambient.b, light.ambient.a);
                this.lights[i].setDiffuse(light.diffuse.r, light.diffuse.g, light.diffuse.b, light.diffuse.a);
                this.lights[i].setSpecular(light.specular.r, light.specular.g, light.specular.b, light.specular.a);

                this.lights[i].setVisible(true);
                if (light.enabled)
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }


    /* Handler called when the graph is finally loaded.
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        /*
        this.camera.near = this.graph.views[0].near;
        this.camera.far = this.graph.views[0].far;
        this.camera.fov = this.graph.views[0].angle;
        this.camera.position = vec3.fromValues(this.graph.views[0].from[0], this.graph.views[0].from[1], this.graph.views[0].from[2]);
        this.camera.target = vec3.fromValues(this.graph.views[0].to[0], this.graph.views[0].to[1], this.graph.views[0].to[2]);*/




        //TODO: Change reference length according to parsed graph
        this.axis = new CGFaxis(this, this.graph.axis_length);

        // TODO: Change ambient and background details according to parsed graph
        this.gl.clearColor(this.graph.ambient[1].r,this.graph.ambient[1].g , this.graph.ambient[1].b,this.graph.ambient[1].a);
        this.setGlobalAmbientLight(this.graph.ambient[0].r,this.graph.ambient[0].g , this.graph.ambient[0].b,this.graph.ambient[0].a);
        this.initLights();

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        this.interface.addGameGroup(this.game);


        this.materialDefault.apply();



        this.sceneInited = true;

        this.TimeFactorAux = 0;
    }


    /**
     * Displays the scene.
     */
    display() {

        this.logPicking();
        this.clearPickRegistration();
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();



        if (this.sceneInited) {

            // Draw axis
            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }


            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();

            this.game.displayGame();
        }
        else {
            // Draw axis
            this.axis.display();
        }


        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    checkKey() {
		if (this.gui.isKeyPressed("KeyM")) {

      for(var key in this.graph.components){
         if(this.graph.components.hasOwnProperty(key)){
           this.graph.components[key].updateMaterial();
         }
      }
    }

    if (this.gui.isKeyPressed("KeyP")) {
        swal('ChangedPlayer');
      this.game.changeplayer();

    }

	 }

    updateComponent(currTime){

        for(var key in this.graph.components){
         if(this.graph.components.hasOwnProperty(key)){
           this.graph.components[key].update(currTime);
         }
      }

    }

    updateWaterShader(currTime){

        let t = (Math.sin(currTime / 1000));

        this.TimeFactorAux = this.TimeFactorAux+ 0.002;

        let t1 = this.TimeFactorAux;

        this.waterShader.setUniformsValues({timeFactor: t, timeFactor1 : t1});
    }

    updateGame(currTime){

      if(!this.game.begin){
        if(this.Start)
          this.game.start();
      }
      if(this.game.begin){
        this.game.updateView(currTime);
      }
      this.game.update(currTime);

    }


  	update(currTime) {
  	  this.checkKey();
      this.updateComponent(currTime);
      this.updateWaterShader(currTime);
      this.updateGame(currTime);

    }

    logPicking(){

        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i=0; i< this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj)
                    {
                        var customId = this.pickResults[i][1];


                        if(customId > 10000){
                          this.game.elements.deselectAll();
                          this.game.elements.selectPiece(customId);
                        }else{
                          var row =  customId / 100 >> 0;
                          var line = customId % 100;
                          this.game.validatePlay(row, line);
                        }
                        console.log(this.game.elements);
                    }
                }
                this.pickResults.splice(0,this.pickResults.length);
            }
        }
      }

    ispiece(string){
          if(string[0] >= 'a' && string[0] <= 's'){
              console.log('welele');
          }
    }
}
