
const COMMUNICATION_PORT = 8081;



class PrologCommunication {

	constructor(game){

		this.prologBoard = null;

		this.boardIsChanged = false;

		this.game = game;
	}

	getPrologRequest(requestString){

		console.log(requestString);

		let communication = this;

		var request = new XMLHttpRequest();

		request.open('GET', 'http://localhost:' + COMMUNICATION_PORT + '/' + requestString, true);

		request.onload = function() {
            let serverAnswer = this.response;
            console.log("Request loaded. Reply: " + serverAnswer);

            console.log(this.status);

         	  if (this.status != 200) {
                console.error("Server denied request.");
                swal('Ops!', 'Invalid Move', 'error');
                
                
            } else {
                communication.handlerResponse(serverAnswer);
            }
            
        };
        request.onerror = function() {
            console.log("Error waiting for response");
        };



		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();

	}

	handlerResponse(answer){

		this.prologBoard = this.getBoardFromRequest(answer);
		this.boardIsChanged = true;
	}

	getBoardFromRequest(string){

		let rows = string.match(/\[((?:\w*,?)*)\]/g);
        let board = [];

        for (let i = 0; i < rows.length; ++i) {
            board[i] = rows[i].match(/\w+/g);
        }

        return board;
	}


}