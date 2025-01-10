"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = require("./components/player");
const Game_1 = require("./Game");
const main = document.getElementById('main');
const boardSize = 10;
const playerOne = new player_1.Player(boardSize);
const playerTwo = new player_1.Computer(boardSize);
const game = new Game_1.Game(document, boardSize, playerOne, playerTwo);
//# sourceMappingURL=index.js.map