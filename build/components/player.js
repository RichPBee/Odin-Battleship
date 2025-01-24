"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Computer = exports.Player = void 0;
const gameboard_1 = require("./gameboard");
const ship_1 = require("./ship");
class Player {
    get Gameboard() { return this._gameboard; }
    get AvailableShips() { return this._availableShips; }
    get Name() { return this._name; }
    constructor(boardSize = 10, name = 'Player') {
        this._gameboard = new gameboard_1.Gameboard(boardSize);
        this._availableShips = [];
        this._name = name;
        this._isComputerPlayer = false;
        this._boardSize = boardSize;
        this.setupShips();
    }
    reset() {
        this._gameboard.reset();
        this.setupShips();
    }
    setupBoard() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const ship of this._availableShips) {
                this.placeShipAuto(ship);
            }
            return;
        });
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
    placeShip(ship, position, isHorizontal) {
        const placed = this._gameboard.placeShip(ship, position, isHorizontal);
        if (placed) {
            this._availableShips.shift();
            return true;
        }
        return false;
    }
}
exports.Player = Player;
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
class Computer extends Player {
    constructor(boardSize, name = 'Computer', difficulty = 0) {
        super(boardSize, name);
        this._isComputerPlayer = true;
        this._difficulty = difficulty;
        this._subsequentHitPositions = [];
    }
    generateAttackPosition(enemy) {
        if (this._difficulty === 0 || !this._lastHitPosition) {
            return this.generateRandomPosition(enemy);
        }
        else if (this._difficulty === 1) {
            return this.getNextAdjacentPosition(enemy);
        }
        return this.generateCalculatedPosition(enemy);
    }
    generateRandomPosition(enemy) {
        const position = { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10) };
        const isUsed = enemy.Gameboard.isPositionHit(position, true) || enemy.Gameboard.isPositionHit(position, false);
        if (!isUsed) {
            if (enemy.Gameboard.checkPosition(position)) {
                this._lastHitPosition = this.calculateAdjacentPositions(position, enemy);
                this._subsequentHitPositions.push(position);
            }
            return position;
        }
        return this.generateRandomPosition(enemy);
    }
    getNextAdjacentPosition(enemy) {
        const position = this._lastHitPosition.adjacentPositions[0];
        const isUsed = enemy.Gameboard.isPositionHit(position, true) || enemy.Gameboard.isPositionHit(position, false);
        if (!position || isUsed) {
            return this.generateRandomPosition(enemy);
        }
        this._lastHitPosition.adjacentPositions.shift();
        return position;
    }
    generateCalculatedPosition(enemy) {
        if (this._subsequentHitPositions.length === 0) {
            return this.generateRandomPosition(enemy);
        }
        const numHitPostions = this._subsequentHitPositions.length;
        const maxIndex = this._subsequentHitPositions.length - 1;
        const currPos = this._subsequentHitPositions[maxIndex];
        const nextPositions = this.calculateAdjacentPositions(currPos, enemy).adjacentPositions;
        if (numHitPostions === 1) {
            return this.targetAdjacentPositions(nextPositions, enemy);
        }
        const prevPos = this._subsequentHitPositions[maxIndex - 1];
        this._nextDirection = this.calculateDirection(currPos, prevPos);
        const nextPos = this.getNextPosition(this._nextDirection, currPos);
        if (!this.isValidPosition(nextPos)) {
            this._nextDirection = this.getOppositeDirection(this._nextDirection);
            const oppositePos = this.getNextPosition(this._nextDirection, this._subsequentHitPositions[0]);
            if (!this.isValidPosition(oppositePos)) {
                this._subsequentHitPositions = [];
                return this.generateRandomPosition(enemy);
            }
            const isUsed = enemy.Gameboard.isPositionHit(oppositePos, true) || enemy.Gameboard.isPositionHit(oppositePos, false);
            if (!isUsed) {
                this._subsequentHitPositions = [this._subsequentHitPositions[0], oppositePos];
                return oppositePos;
            }
            this._subsequentHitPositions = [];
            return this.generateRandomPosition(enemy);
        }
        const isUsed = enemy.Gameboard.isPositionHit(nextPos, true) || enemy.Gameboard.isPositionHit(nextPos, false);
        if (!isUsed) {
            this._subsequentHitPositions.push(nextPos);
            return nextPos;
        }
        this._subsequentHitPositions = [];
        return this.generateRandomPosition(enemy);
    }
    targetAdjacentPositions(nextPositions, enemy) {
        for (let i = 0; i < 4; i++) {
            const nextPos = nextPositions[i];
            if (!nextPos)
                continue;
            const isUsed = enemy.Gameboard.isPositionHit(nextPos, true) || enemy.Gameboard.isPositionHit(nextPos, false);
            if (!isUsed) {
                if (enemy.Gameboard.checkPosition(nextPos)) {
                    this._subsequentHitPositions.push(nextPos);
                }
                return nextPos;
            }
        }
        this._subsequentHitPositions = [];
        return this.generateRandomPosition(enemy);
    }
    getOppositeDirection(direction) {
        if (direction === Direction.Left) {
            return Direction.Right;
        }
        else if (direction === Direction.Right) {
            return Direction.Left;
        }
        else if (direction === Direction.Up) {
            return Direction.Down;
        }
        return Direction.Up;
    }
    placeShipAuto(ship) {
        super.placeShipAuto(ship);
    }
    calculateDirection(p1, p2) {
        if (p1.x < p2.x) {
            return Direction.Left;
        }
        else if (p1.x > p2.x) {
            return Direction.Right;
        }
        else if (p1.y < p2.y) {
            return Direction.Up;
        }
        return Direction.Down;
    }
    getNextPosition(direction, pos) {
        console.log(direction);
        if (direction == Direction.Left) {
            return { x: pos.x - 1, y: pos.y };
        }
        else if (direction == Direction.Right) {
            return { x: pos.x + 1, y: pos.y };
        }
        else if (direction == Direction.Up) {
            return { x: pos.x, y: pos.y - 1 };
        }
        return { x: pos.x, y: pos.y + 1 };
    }
    isValidPosition(position) {
        return (position.x >= 0 && position.x < this._boardSize && position.y >= 0 && position.y < this._boardSize);
    }
    calculateAdjacentPositions(position, enemy) {
        const adjacentPositions = [];
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i !== 0 && j !== 0 || i == 0 && j == 0)
                    continue;
                if (position.x + j < 0 || position.x + j >= this._boardSize || position.y + i < 0 || position.y + i >= this._boardSize)
                    continue;
                const currPos = { x: position.x + j, y: position.y + i };
                const isUsed = enemy.Gameboard.isPositionHit(currPos, true) || enemy.Gameboard.isPositionHit(currPos, false);
                const alreadyFound = adjacentPositions.find((pos) => pos.x === position.x + j && pos.y === position.y + i);
                console.log(position.x + j, position.y + i);
                console.log(isUsed, alreadyFound);
                if (!isUsed && !alreadyFound) {
                    adjacentPositions.push({ x: position.x + j, y: position.y + i });
                }
            }
        }
        console.log(adjacentPositions);
        return { position, adjacentPositions };
    }
}
exports.Computer = Computer;
//# sourceMappingURL=player.js.map