/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)
        this.initKeys();
        return true;
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key].enabled;
                group.add(this.scene.lightValues, key);
            }
        }
    }


    /**
     * Adds a folder containing the indexes of the views in a dropdown.
     * @param {array} views
     */
    addViewsGroup(views) {

      var group = this.gui.addFolder("Views");
      group.open();

      var temp = [];
      for(var i=0; i < views.length; i++){
        temp.push(i+1);
      }

      group.add(this.scene, "View", temp);
    }

    /**
	 * processKeyboard
	 * @param event {Event}
	 */

	initKeys() {
		this.scene.gui = this;
		this.processKeyboard = function () { };
		this.activeKeys = {};
	 }
    processKeyDown(event) {
		this.activeKeys[event.code] = true;
	 };
	processKeyUp(event) {
		this.activeKeys[event.code] = false;
	 };
	isKeyPressed(keyCode) {
		 return this.activeKeys[keyCode] || false;
 	 };
}
