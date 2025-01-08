export class Ship
{
    private _length: number;
    get Length() { return this._length; }

    private _numHits: number;
    get NumHits() { return this._numHits; }

    private _sunk: boolean;

    constructor(length: number)
    {
        this._length = length;
        this._numHits = 0;
        this._sunk = false;
    }

    public hit()
    {
        this._numHits++;
        this._sunk = this._numHits >= this._length;
    }
    
    public isSunk()
    {
        return this._sunk
    }
}

module.exports = {Ship};