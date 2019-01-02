
% new lines to simulate clearscreen
clearScreen :-
	printBlank(7).

% print new lines
printBlank(A) :-
	A > 0,
	nl,
	A1 is A - 1,
	printBlank(A1).
	
printBlank(_).

%change type (player)
changeType(1, 2).
changeType(2, 1).

%fast reconsult
reload:- reconsult('pente.pl').