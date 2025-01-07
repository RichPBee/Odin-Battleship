import { boolean } from "yargs";
import { Vector2 } from "../utilities/IVector2";

class Gameboard
{
    private _grid: Array<Array<Ship | null>>;
    private _ships: Ship[];
    private _missedPositions: Vector2[];
    private _hitPositions: Vector2[];
    private _allSunk: Boolean;
    get AllSunk() { return this._allSunk; }

    constructor(size: number = 10)
    {
        this._hitPositions = [];
        this._missedPositions = [];
        this.generateGrid(size);
    }

    public placeShip(ship: Ship, position: Vector2, isHorizontal: boolean = true): boolean
    {
        const {x, y} = position;
        if (!this.canPlaceInPosition(ship.Length, position, isHorizontal)) return false;
        for (let i = 0; i < ship.Length; i++)
        {
            if (isHorizontal)
            {
                this._grid[x + i][y] = ship;
            }
            else
            {
                this._grid[x][y + 1] = ship;
            }
        }
        return true;
    }

    public receiveAttack(position: Vector2): boolean
    {
        const hitShip = this.checkPosition(position);
        if (hitShip)
        {
           hitShip.hit();
           this.addHitAttack(position);
           //this.checkAllSunk();
           return true;
        }
        this.addMissedAttack(position);
        return false;
    }

    public isPositionHit(position: Vector2, checkMisses: boolean): boolean
    {
        return checkMisses ? this.checkArrayForHit(position, this._missedPositions) : this.checkArrayForHit(position, this._hitPositions);
    }

    private checkArrayForHit(position: Vector2, array: Vector2[]): boolean
    {
        return array.find(pos => pos.x === position.x && pos.y === position.y) != undefined;
    }

    private checkPosition(position: Vector2): Ship | null
    {
        const {x, y} = position;
        return this._grid[x][y];
    }

    private generateGrid(size: number)
    {
        this._grid = [];
        for (let i = 0; i < size; i++)
        {
            this._grid[i] = [];
            for (let j = 0; j < size; j++)
            {
                this._grid[i][j] = null;
            }
        }
    }
    
    private canPlaceInPosition(shipLength: number, position: Vector2,  isHorizontal: boolean): boolean
    {
        const {x, y} = position;
        const canPlaceHorizontal = x + shipLength <= this._grid.length && x >= 0;
        const canPlaceVertical = y + shipLength <= this._grid[0].length && y >= 0;
        return isHorizontal ? canPlaceHorizontal : canPlaceVertical;
    }

    private addMissedAttack(position: Vector2)
    {
        if (this.isPositionHit(position, true)) return;
        this._missedPositions.push(position);
    }

    private addHitAttack(position: Vector2)
    {
        if (this.isPositionHit(position, false)) return;
        this._hitPositions.push(position);
    }
}

module.exports = {Gameboard};