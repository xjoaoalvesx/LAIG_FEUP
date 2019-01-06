
class GameHistory{

  constructor(scene) {

        this.scene = scene;

        this.reset();
  }

  reset(){
    this.boards = new Array();
    this.moves = new Array();
  }

  addmove(move, board){
    this.moves.push(move);
    this.boards.push(board);
  }



  diferencialConsecutiveBoards(board_previous, board_after){
    for(var i = 0; i < board_previous.length; i++){
      for(var j = 0; j < board_previous[i].length; j++){
        if(board_after[i][j] == 0 || board_after[i][j] == board_previous[i][j])
          continue;
        else {
          return [i,j];
        }
      }
    }
  }
}
