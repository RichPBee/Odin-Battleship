import { GameManager } from './components/gameManager';
import { Player, Computer } from './components/player';
import { Game } from './Game';

const main = document.getElementById('main')

const boardSize = 10;
const playerOne = new Player(boardSize);
const playerTwo = new Computer(boardSize);
const game = new Game(document, boardSize, playerOne, playerTwo);
