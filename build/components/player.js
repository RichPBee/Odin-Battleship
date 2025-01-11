"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Computer = exports.Player = void 0;
const gameboard_1 = require("./gameboard");
const ship_1 = require("./ship");
class Player {
    get Gameboard() { return this._gameboard; }
    get Name() { return this._name; }
    constructor(boardSize = 10, name = 'Player') {
        this._gameboard = new gameboard_1.Gameboard(boardSize);
        this._availableShips = [];
        this._name = name;
        this.setupShips();
    }
    setupBoard() {
        for (const ship of this._availableShips) {
            this.placeShipAuto(ship);
        }
    }
    setupShips() {
        const carrier = new ship_1.Ship(5, 'Carrier');
        const battleship = new ship_1.Ship(4, 'Battleship');
        const destroyer = new ship_1.Ship(3, 'Destroyer');
        const submarine = new ship_1.Ship(3, 'Submarine');
        const patrolBoat = new ship_1.Ship(2, 'Patrol Boat');
        this._availableShips = [carrier, battleship, destroyer, submarine, patrolBoat];
    }
    placeShipAuto(ship) {
        const position = { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10) };
        const isHorizontal = Math.random() * 2 > 1;
        const placed = this._gameboard.placeShip(ship, position, isHorizontal);
        if (!placed) {
            this.placeShipAuto(ship);
        }
    }
}
exports.Player = Player;
class Computer extends Player {
    constructor(boardSize, name = 'Computer') {
        super(boardSize, name);
    }
    generateRandomPosition(enemy) {
        const position = { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10) };
        const isUsed = enemy.Gameboard.isPositionHit(position, true) || enemy.Gameboard.isPositionHit(position, false);
        if (!isUsed) {
            return position;
        }
        return this.generateRandomPosition(enemy);
    }
    placeShipAuto(ship) {
        super.placeShipAuto(ship);
    }
}
exports.Computer = Computer;
//# sourceMappingURL=player.js.map