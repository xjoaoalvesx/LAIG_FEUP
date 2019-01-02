:- use_module(library(random)).
:- include('board.pl').


% Update Board with a new random play
% +Type - who is playing
% +Board - current Board
% -NewBoard - Board with  the new game state 
randomMove(Type, Board, NewBoard, Result, NewResult):-
	choose_move(Board, 1, Move, 1), 
	nth1(1, Move, R),
	nth1(2, Move, C),
	checkEat(Board, Result, R, C, Type, MidBoard, NewResult),
	insertOnPositon(R, C, Type, MidBoard, NewBoard).

% List with possible moves in the current Board Game
% -Board - Current Board game
% -ListOfMoves - list with all possible moves in Board
valid_moves(Board, ListOfMoves):-
	setof([R,C],getElemInPosition(Board, R, C, 0), ListOfMoves),!,
	length(ListOfMoves, N).


% choose the next move in Level
% +Board - Current board game
% +Level - Level of the game
% +Type - who is playing
% -Move - Next Move 
choose_move(Board, Level, Move, Type):-
	cp_move(Board, Level, Move, Type).
	

% choose the next move in Level 1
% +Board - Current board game
% +Level - Level of the game
% +Type - who is playing
% -Move - Next Move 
cp_move(Board, 1, Move, _):-
	valid_moves(Board, ListOfMoves), 
	length(ListOfMoves, BS),
	Bs is BS - 1,
	random(1,Bs, Random),
	nth1(Random, ListOfMoves, Move).

%cp_move(Board, 2, Move, _).


findMyPieces(Board, Type):-
	findall([R,C],getElemInPosition(Board, R, C, Type), _ListOfMoves). 
	


/*
findSequence(Line, Type):-
	findall(possibleSequences(Type, Sequence),
	segment(Line, Sequence).
*/

possibleSequences(N, Sequence):- Sequence = [0, N, N, N, N].
possibleSequences(N, Sequence):- Sequence = [N, N, N, N, 0]. 
possibleSequences(N, Sequence):- Sequence = [0, N, N, N].
possibleSequences(N, Sequence):- Sequence = [N, N, N, 0]. 
possibleSequences(N, Sequence):- Sequence = [0, N, N].
possibleSequences(N, Sequence):- Sequence = [N, N, 0]. 
possibleSequences(N, Sequence):- Sequence = [0, N].
possibleSequences(N, Sequence):- Sequence = [N, 0]. 
%possibleSequences(N, Sequence):- 

%bestMove:-