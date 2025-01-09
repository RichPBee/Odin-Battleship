import {Player} from './components/player';
import {Computer} from './components/player';

const header = document.createElement('h1');
header.textContent = 'BATTLESHIP';
const main = document.getElementById('main')

const boardSize = 10;
const player1 = new Player(boardSize);
const player2 = new Player(boardSize);

const boardSection = document.createElement('div');
boardSection.id = 'boardSection';

const board1 = document.createElement('div');
board1.className = 'gameBoard';
board1.id = 'boardOne';

const board2 = document.createElement('div');
board2.className = 'gameBoard';
board2.id = 'boardTwo';

for (let i = 0; i < boardSize; i++)
{
    for (let j = 0; j < boardSize; j++)
    {
        const boardSquare = document.createElement('div');
        const boardSquare2 = document.createElement('div');
        boardSquare.className = boardSquare2.className = 'boardSquare';
        boardSquare.id = `Player-Square0${i}-${j}`;
        boardSquare2.id = `Player2-Square-${i}-${j}`;

        board1.appendChild(boardSquare);
        board2.appendChild(boardSquare2);
    }   
}

board1.setAttribute('style', `grid-template-columns: repeat(${boardSize}, 1fr)`);
board2.setAttribute('style', `grid-template-columns: repeat(${boardSize}, 1fr)`);

boardSection.appendChild(board1);
boardSection.appendChild(board2);
main.appendChild(boardSection);