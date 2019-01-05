
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
    		this.whitePieces[i] = new WhitePiece(this.scene, [0.5 + i * .2, 0.3, 1.5 - (i % 2 ? 0 : 0.2)], 10001 + i);
    		this.blackPieces[i] = new BlackPiece(this.scene, [0.5 + i * .2, 0.3, 4 - (i % 2 ? 0 : 0.2)], 20001 + i);
    	}

    }

		deselectAll(){
			let whitePieces = this.whitePieces;
			for (let wPiece of whitePieces){
	        wPiece.isSelected = false;
			}
			let blackPieces = this.blackPieces;
			for (let bPiece of blackPieces){
	        bPiece.isSelected = false;
	    }
		}

		selectPiece(id){
			if(id > 20000){
				let blackPieces = this.blackPieces;
				for (let bPiece of blackPieces){
						if(bPiece.id == id)
		        	bPiece.isSelected = true;
		    }
			}else{
				let whitePieces = this.whitePieces;
				for (let wPiece of whitePieces){
					if(wPiece.id == id)
						wPiece.isSelected = true;
				}
			}
		}

		isPieceSelect(){
			let whitePieces = this.whitePieces;
			for (let wPiece of whitePieces){
				if(wPiece.isSelected == true)
					return wPiece.id;
			}
			let blackPieces = this.blackPieces;
			for (let bPiece of blackPieces){
					if(bPiece.isSelected == true)
						return bPiece.id;
			}
			return -1;
		}

		choosenPiece(id){
			let whitePieces = this.whitePieces;
			for (let wPiece of whitePieces){
				if(wPiece.id == id)
					return wPiece;
			}
			let blackPieces = this.blackPieces;
			for (let bPiece of blackPieces){
					if(bPiece.id == id)
						return bPiece;
			}
		}

    displayGame(){

	  	let whitePieces = this.whitePieces;
	    for (let wPiece of whitePieces){
	        wPiece.display(wPiece.id);
			}
	    let blackPieces = this.blackPieces;
	    for (let bPiece of blackPieces){
	        bPiece.display(bPiece.id);
	    }
    }

		update(currTime){
	    for (let wPiece of this.whitePieces){
	        wPiece.update(currTime);
			}
	    for (let bPiece of this.blackPieces){
	        bPiece.update(currTime);
	    }
		}

}