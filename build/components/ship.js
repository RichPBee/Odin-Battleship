"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ship = void 0;
class Ship {
    get Name() { return this._name; }
    get Length() { return this._length; }
    get NumHits() { return this._numHits; }
    constructor(length, name = 'ship') {
        this._length = length;
        this._numHits = 0;
        this._sunk = false;
        this._name = name;
    }
    hit() {
        this._numHits++;
        this._sunk = this._numHits >= this._length;
    }
    isSunk() {
        return this._sunk;
    }
}
exports.Ship = Ship;
module.exports = { Ship };
//# sourceMappingURL=ship.js.map