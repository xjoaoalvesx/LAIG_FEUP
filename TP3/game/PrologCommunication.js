
const COMMUNICATION_PORT = 8081;



class PrologCommunication {

	constructor(game){

		this.prologBoard = null;

		this.game = game;
	}

	getPrologRequest(requestString){

		console.log(requestString);

		let communication = this;

		var request = new XMLHttpRequest();

		request.open('GET', 'http://localhost:' + COMMMUNICATION_PORT + '/' + requestString, true);





		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();

	}







}