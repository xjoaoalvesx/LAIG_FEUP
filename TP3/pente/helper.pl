:- use_module(library(random)).
:- use_module(library(lists)).
:- include('display.pl').
	

%% Size = Size of the Board
%% Board - return of the board
createEmptyBoard(Size, Board):- 
    create_line(0, Size, A),
    length(Board, Size),
    maplist(=(A), Board).

%%% X - Symbol to be insert in every position of List
%%% N - Size of a line 
%%% List - Return of a line
create_line(X, N, List)  :- 
    length(List, N), 
    maplist(=(X), List).

%% Insert in a position (Line, Column) the Symbol
%% Line - Number of the Line
%% Column - Number of the Column
%% Symbol - Symbol to be Insert
%% Board - Board to be Changed,
%% List1 - Return the Board changed
insertOnPositon(Line, Column, Symbol, Board, List1):-
    RealLine is Line - 1,
    nth1(Line, Board, Change),
    changeElem(Column, Symbol, Change, Changed),
    nth0(0,[H|T], Changed),
    copy(Board, TempList, RealLine), 
    copy2(Board, HalfBoard, Line, 0), 
    append(TempList, [H|T], FH),
    append(FH, HalfBoard, List1).

%% caso base
changeElem(_ , _, [], _). 

%% Change an element in the List [H|T]
%% Index - Index of the element to be changed, between [1, size of the board]
%% X - Symbol to be insert
%% [H|T] - List to be changed
%% [N|L] - List changed
changeElem(Index, X, [H|T], [N|L]):-
    Index = 1 -> N = X, Index1 is Index - 1, changeElem(Index1, X, T, L);
    Index1 is Index - 1, N = H, changeElem(Index1, X, T, L).

%% copy the board until index = X
%% [H|T] - Board to be copied
%% [A|B] - Copy of the board until index X
%% X - Index until [H|T] should be copied
copy(_, _, 0).
copy([H|T], [A|B], X):-
    A = H,
    X1 is X - 1,
    copy(T, B, X1).


%% copy the board from index X until the end
%% [H|T] - Board to be copied
%% [A|B] - Copy of the board starting in index X
%% X - Index where the copy may start 
copy2([H|T], [A|B], X, Contador):-
    X > Contador -> Contador1 is Contador + 1, copy2(T, [A|B], X, Contador1);
    length([H|T], N),copy([H|T], [A|B],N).

%% Get the Symbol in the position (Line, Column)
%% Line - Number of the Line
%% Column - Number of the Column
%% Board - Board to be Changed
%% Symbol - Return the symbol in the position(Line, Column)
getElemInPosition(Line, Column, Board, Type):-
    nth1(Line, Board, A),
    nth1(Column, A, Type). 

%% fail if (Line, Column) is not a 0
checkInsertion(Line, Column, Board):-
    getElemInPosition(Line, Column, Board, Symbol),
    Symbol = 0.

%% Replace the piece in (Line, Column) for 0
removePiece(Line, Column, Board, NewBoard):-
    insertOnPositon(Line, Column, 0, Board, NewBoard).

%% Conversion Letter to Number
conversion('A', 1).
conversion('B', 2).
conversion('C', 3).
conversion('D', 4).
conversion('E', 5).
conversion('F', 6).
conversion('G', 7).
conversion('H', 8).
conversion('I', 9).
conversion('J', 10).
conversion('K', 11).
conversion('L', 12).
conversion('M', 13).
conversion('N', 14).
conversion('O', 15).
conversion('P', 16).
conversion('Q', 17).
conversion('R', 18).
conversion('S', 19).
conversion('T', 20).
conversion('U', 21).
conversion('V', 22).
conversion('W', 23).
conversion('X', 24).
conversion('Y', 25).
conversion('Z', 26).
