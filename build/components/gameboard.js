"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gameboard = void 0;
class Gameboard {
    get NumShips() { return this._ships.length; }
    get AllSunk() { return this._allSunk; }
    constructor(size = 10) {
        this._ships = [];
        this._hitPositions = [];
        this._missedPositions = [];
        this._occupiedPositions = [];
        this.generateGrid(size);
    }
    placeShip(ship, position, isHorizontal = true) {
        const { x, y } = position;
        if (!this.canPlaceInPosition(ship.Length, position, isHorizontal))
            return false;
        for (let i = 0; i < ship.Length; i++) {
            if (isHorizontal) {
                this._grid[x + i][y] = ship;
                this._occupiedPositions.push({ x: x + i, y: y });
            }
            else {
                this._grid[x][y + 1] = ship;
                this._occupiedPositions.push({ x: x, y: y + 1 });
            }
        }
        this._ships.push(ship);
        return true;
    }
    receiveAttack(position) {
        const hitShip = this.checkPosition(position);
        if (hitShip) {
            hitShip.hit();
            this.addHitAttack(position);
            this.checkAllSunk(hitShip);
            return true;
        }
        this.addMissedAttack(position);
        return false;
    }
    isPositionHit(position, checkMisses) {
        return checkMisses ? this.checkArrayForHit(position, this._missedPositions) : this.checkArrayForHit(position, this._hitPositions);
    }
    checkArrayForHit(position, array) {
        return array.find(pos => pos.x === position.x && pos.y === position.y) != undefined;
    }
    checkPosition(position) {
        const { x, y } = position;
        return this._grid[x][y];
    }
    generateGrid(size) {
        this._grid = [];
        for (let i = 0; i < size; i++) {
            this._grid[i] = [];
            for (let j = 0; j < size; j++) {
                this._grid[i][j] = null;
            }
        }
    }
    canPlaceInPosition(shipLength, position, isHorizontal) {
        if (this.hasOverlap(shipLength, position, isHorizontal))
            return false;
        const { x, y } = position;
        const canPlaceHorizontal = x + shipLength <= this._grid.length && x >= 0;
        const canPlaceVertical = y + shipLength <= this._grid[0].length && y >= 0;
        return isHorizontal ? canPlaceHorizontal : canPlaceVertical;
    }
    addMissedAttack(position) {
        if (this.isPositionHit(position, true))
            return;
        this._missedPositions.push(position);
    }
    addHitAttack(position) {
        if (this.isPositionHit(position, false))
            return;
        this._hitPositions.push(position);
    }
    checkAllSunk(hitShip) {
        if (!hitShip.isSunk())
            return;
        this._allSunk = this._ships.every((ship) => ship.isSunk());
    }
    hasOverlap(shipLength, position, isHorizontal) {
        const { x, y } = position;
        let hasClash = false;
        for (let i = 0; i < shipLength; i++) {
            if (isHorizontal) {
                const currPos = { x: x + i, y: y };
                hasClash = this._occupiedPositions.find(pos => pos.x === currPos.x && pos.y === currPos.y) != undefined;
                if (hasClash)
                    return true;
            }
            else {
                const currPos = { x: x, y: y + i };
                hasClash = this._occupiedPositions.find(pos => pos.x === currPos.x && pos.y === currPos.y) != undefined;
                if (hasClash)
                    return true;
            }
        }
        return false;
    }
}
exports.Gameboard = Gameboard;
module.exports = { Gameboard };
//# sourceMappingURL=gameboard.js.map