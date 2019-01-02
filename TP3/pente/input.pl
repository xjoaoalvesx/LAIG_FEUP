
% input piece in selected position
inputPiece(Type, Board, NewBoard, Result, NewResult):-
	selectPosition(PieceRow, PieceCol),
	checkEat(Board, Result, PieceRow, PieceCol, Type, MidBoard, NewResult),
	insertOnPositon(PieceRow, PieceCol, Type, MidBoard, NewBoard).

% second call in case of fail
inputPiece(Type, Board, NewBoard):-

	write('\n--Imposible to make current play. Try Again!--'), nl, nl,
	inputPiece(Type, Board, NewBoard).

% asks user for new piece position
selectPosition(Row, Col):-
	getPieceRow(Row),
	getPieceCol(Col), !.

%gets row
getPieceRow(Row):-
	write('Select row:'), nl,
	getInt(R),
	Row is R.

%gets column
getPieceCol(Col):-
	write('Select collumn:'), nl,
	getCol(C),
	Col is C.

%read integer for line
getInt(I):-
	read(I),
	integer(I),
	I > 0 , I < 20.

getInt(I):-
	write('Value is not between the board bounds :\n'),
	getInt(I).

%read char for column
getCol(Col):-
	skip_line,
	get_char(Aux),
	conversion(Aux, Caux),
	Caux > 0, Caux < 20,
	Col is Caux.

getCol(Col):-
	write('Value is not between the board bounds :\n'),
	getCol(Col).

%waits for enter to continue
getContinue:-
	write('\nPress Enter to continue.\n'),
	get_char(_input).
	



