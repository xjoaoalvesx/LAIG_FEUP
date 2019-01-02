%Main menu
mainMenu :-
	clearScreen,
	printPenteTitle,
	printMainMenu,	
	get_char(In),
	skip_line,
	(
		In = '1' -> write('START GAME\n'), playMenu;
		In = '2' -> write('INFO\n'), info, mainMenu;
		In = '3' -> write('RULES\n'), rules, mainMenu;
		In = '4' -> write('EXIT\n');
	
		mainMenu
	).


%Info
info:- 
	clearScreen,
	printPenteTitle,
	write('---------------------------------------------------------------\n'),
	write('---------------------------------------------------------------\n'),
	write('-----                  PLOG  -  2018/2019                 -----\n'),
	write('-----                                                     -----\n'),
	write('-----                                                     -----\n'),
	write('-----       Joao Carlos Alves - up201605236               -----\n'),
	write('-----       Daniel Gomes      - up201603404               -----\n'),
	write('---------------------------------------------------------------\n'),
	getContinue.
 
	
%Play Menu
playMenu:- 
	clearScreen,
	printPenteTitle, 
	printPlayMenu,
	get_char(In),
	skip_line, 
	(
		In = '1' -> write('Chose to play Human vs Human\n'), startGame(playerMove, playerMove) ;
		In = '2' -> write('Chose to play Human vs Computer\n'), select_CP_Type(CP),!, blackWhite(CP);
		In = '3' -> write('Chose to play Computer vs Computer\n'), select_CP_Type(CP),!, startGame(CP, CP), playMenu;
		In = '4' -> write('Chose to Go back\n'), mainMenu;
		
		playMenu
	).

blackWhite(CP):-
	clearScreen,
	printPenteTitle, 
	printBlackWhite,
	get_char(In),
	skip_line,
	(
		In = '1' -> write('Chose to play Black\n'), startGame(CP, playerMove) ;
		In = '2' -> write('Chose to play White\n'),!, startGame(playerMove, CP);
		playMenu
	).
	


printBlackWhite:-
	write('---------------------------------------------------------------\n'),
	write('---------------------------------------------------------------\n'),
	write('-----                    1 - Black                        -----\n'),
	write('-----                    2 - White                        -----\n'),
	write('---------------------------------------------------------------\n').

% Select CP difficulty
select_CP_Type(CP):-
	clearScreen,
	printPenteTitle,
	printCPSelection,
	read(Option),
	integer(Option),
	skip_line,
	cpType(Option, CP), !.

% cp type
cpType(1, 'randomMove').
cpType(2, 'bestMove').
cpType(_, CP):-
	write('INVALID OPTION - PLEASE TRY AGAIN\n\n'),
	select_CP_Type(CP).



% prints playMenu
printPlayMenu:- 
	write('---------------------------------------------------------------\n'),
	write('---------------------------------------------------------------\n'),
	write('-----                    1 - MultiPlayer                  -----\n'),
	write('-----                    2 - SinglePlayer                 -----\n'),
	write('-----                    3 - Cp vs Cp                     -----\n'),
	write('-----                    4 - Back                         -----\n'),
	write('---------------------------------------------------------------\n').

%prints mainmenu
printMainMenu:- 
	write('---------------------------------------------------------------\n'),
	write('---------------------------------------------------------------\n'),
	write('-----                    1 - PLAY                         -----\n'),
	write('-----                    2 - INFO                         -----\n'),
	write('-----                    3 - RULES                        -----\n'),
	write('-----                    4 - BACK                         -----\n'),
	write('---------------------------------------------------------------\n').

%prints cpselection menu
printCPSelection:- 
	write('---------------------------------------------------------------\n'),
	write('-----                 Select CP difficulty                -----\n'),
	write('---------------------------------------------------------------\n'),
	write('---------------------------------------------------------------\n'),
	write('-----                    1 - RANDOM                       -----\n'),
	write('-----                    2 - BEST PLAY                    -----\n'),
	write('---------------------------------------------------------------\n').

%Rules
rules:-
	clearScreen,
	printPenteTitle,
	write('\tPente is played on a 19x19 board and the pieces are placed at the intersections of the lines, not the squares.'), nl,
	write('\tThe objective of the game is to place 5 or more pieces consecutively on a vertical, horizontal or diagonal line, or capture at least 5 pairs of opponent\'s pieces.'), nl,
	write('\tEach player can place one piece at any empty intersection per move.'), nl,
	write('\tThe first move of the white has to be in the center of the board - the intersection J10.'), nl,
	write('\tThe second white play must be made at least three intersections away from the J10 center in any direction.'), nl,
	write('\tA player captures the opponent\'s pieces by cornering a vertical, horizontal or diagonal line of two and only two opposing pieces. The captured pieces are immediately removed from the board.\n'), nl,
	getContinue.

