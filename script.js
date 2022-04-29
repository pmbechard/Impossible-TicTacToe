/*
Impossible Tic-Tac-Toe
by Peyton Bechard

Created: 29 Apr 2022
Last Updated: 29 Apr 2022
*/

/*
SPECIFICATIONS

GAME FLOW
Player goes first.
Player chooses a spot on the grid - a marker is placed there.
Bot chooses a spot on the grid - a marker is placed there.
This continues until one gets 3 in a row (horizontally, vertically, 
    or diagonally) or until all spaces are filled.
Result message is shown (with line or other visual showing 3-in-a-row if achieved)
Loser goes first next game or same player goes first if draw.

ADDITIONAL NOTES
Player has options to:
    - switch marker between X and O
        - player can switch markers mid-game
    - adjust difficulty (i.e. frequency of AI algorithm usage)
        - player can adjust difficulty mid-game
    - restart current game
    - play again after result is shown.

OBJECTS
GameFlow - manages game progression
GameGrid - tracks marker positions
Player - manages player functionalities
AI - manages bot player moves
*/