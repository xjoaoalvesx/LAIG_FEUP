
const MAX_PIECES = 25;

class Elements {


	constructor(scene) {

        this.scene = scene;

        this.setUpGameElements();
    }

    setUpGameElements(){

    	this.whitePieces = [];
    	this.blackPieces = [];

    	for(let i = 0; i < MAX_PIECES; i++){
    		this.whitePieces[i] = new WhitePiece(this.scene, [0.5 + i * .2, 0.3, 1.5 - (i % 2 ? 0 : 0.2)]);
    		this.blackPieces[i] = new BlackPiece(this.scene, [0.5 + i * .2, 0.3, 4 - (i % 2 ? 0 : 0.2)]);
    	}

    }

    displayGame(){

    	let whitePieces = this.whitePieces;
        for (let wPiece of whitePieces)
            wPiece.display();

        let blackPieces = this.blackPieces;
        for (let bPiece of blackPieces){
            bPiece.display();
        }

    }

}