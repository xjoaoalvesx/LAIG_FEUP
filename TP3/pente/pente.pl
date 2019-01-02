:-include('menus.pl').
:-include('display.pl').
:-include('utilities.pl').
:-include('board.pl').
:-include('input.pl').
:-include('cp.pl').


%Calls the MainMenu / Starts Pente
game:-
	mainMenu.

% Start game playing
startGame(P1, P2):-
	createEmptyBoard(19, B),
	insertOnPositon(10, 10, 2, B, L),
	display_board(L,[0,0]),
	game(P1, P2, 1, L, [0,0]).


%black player turn
game(P1, P2, Type, Board, Result):-
	Type is 1,
	nl,print_cell(Type) , write(' Playing...\n'),
	call(P1, Type, Board, NewBoard, Result, NewResult),
	display_board(NewBoard, NewResult),
	nextMove(P1, P2, Type, NewBoard, NewResult).

%white player turn
game(P1, P2, Type, Board, Result):-
	nl,print_cell(Type) , write(' Playing...\n'),
	call(P2, Type, Board, NewBoard, Result, NewResult),
	display_board(NewBoard, NewResult),
	nextMove(P1, P2, Type, NewBoard, NewResult).

%Computes player move
playerMove(Type, Board, NewBoard, Result, NewResult):-
	inputPiece(Type, Board, NewBoard, Result, NewResult).

%Win verifications / next player move
nextMove(_P1, _P2, Type, Board, _):-
	winGame(Board, Type), ! ,
	victory(Type).

nextMove(_P1, _P2, Type, _, Result):-
	winByPieces(Result, Type),
	victory(Type).

nextMove(P1, P2, Type, Board, Result):-
	changeType(Type, NewType), !,
	game(P1, P2, NewType, Board, Result).

% In victory phase
victory(Type):-
	won(Type),
	get_char(_),
	getContinue ,!,
	mainMenu.



