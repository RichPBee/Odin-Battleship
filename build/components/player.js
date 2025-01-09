"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Computer = exports.Player = void 0;
const gameboard_1 = require("./gameboard");
class Player {
    constructor(boardSize = 10) {
        this._gameboard = new gameboard_1.Gameboard(boardSize);
        this._availableShips = [];
    }
}
exports.Player = Player;
class Computer extends Player {
    generateRandomPosition() {
    }
}
exports.Computer = Computer;
//# sourceMappingURL=player.js.map