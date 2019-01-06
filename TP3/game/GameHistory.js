
class GameHistory{

  constructor(scene) {

        this.scene = scene;

        this.reset();
  }

  reset(){
    this.boards = new Array();
    this.moves = new Array();

    let initBoard = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

    let initPlay = [];

    this.boards.push(initBoard);
    this.moves.push(initPlay);
  }

  addmove(move, board){
    //var tempB = [...board];
    var TempB =JSON.parse(JSON.stringify(board));
    console.log(this.boards);
    this.moves.push(move);
    this.boards.push(TempB);
    console.log(this.boards);
  }


    undo(){

      if(this.boards.length <= 1){
        this.reset();
        this.scene.game.resetPickedElements();
        
        return null;
      }

      var lastBoard = this.boards.length - 1;
      var desiredBoard = this.boards.length - 2;

      for(var i = 0; i < this.boards[lastBoard].length; i++){
        for(var j = 0; j < this.boards[lastBoard][i].length; j++){
        //  console.log(this.boards[lastBoard][i][j]);
         // console.log(this.boards[desiredBoard][i][j]);
          if(this.boards[lastBoard][i][j] == this.boards[desiredBoard][i][j]){
            continue;
            console.log('equals');
          }
          else if (this.boards[lastBoard][i][j] == 0) {
            let pieceToMoveId = this.boards[desiredBoard][i][j];
            this.scene.game.elements.choosenPiece(pieceToMoveId).moveToCell(i+1, j+1);
            if(pieceToMoveId > 2000){
              this.scene.game.board[i][j] = 1;
            }
            else {this.scene.game.board[i][j] = 2;}
          }else{

            let pieceToMoveId = this.boards[lastBoard][i][j];
            console.log(pieceToMoveId);
            this.scene.game.elements.choosenPiece(pieceToMoveId).returnPiece();
            this.scene.game.board[i][j] = 0;
            console.log(this.scene.board);
          }

        }
      }
      this.boards.splice(-1,1);
      this.moves.splice(-1,1);
      this.scene.game.boardId = this.boards[desiredBoard];
      this.scene.game.resetPickedElements();
      this.scene.game.changeplayer();

      console.log(this.boards);
      console.log(this.moves);
    };

  diferencialConsecutiveBoards(board_previous, board_after){
    for(let i = 0; i < board_previous.length; i++){
      for(let j = 0; j < board_previous[i].length; j++){
        if(board_after[i][j] == 0 || board_after[i][j] == board_previous[i][j])
          continue;
        else {
        	console.log("i =" + i + " j =" + j);
          return [i,j];
        }
      }
    }
  }
}
