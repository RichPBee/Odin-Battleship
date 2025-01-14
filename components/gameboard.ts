import { Vector2 } from "../utilities/IVector2";
import { Ship } from "./ship";

export class Gameboard
{
    private _grid: Array<Array<Ship | null>>;
    private _ships: Ship[];
    get NumShips() { return this._ships.length; }

    private _missedPositions: Vector2[];
    private _hitPositions: Vector2[];
    private _allSunk: Boolean;
    private _occupiedPositions: Vector2[];
    private _size;
    get OccupiedPositions() {return this._occupiedPositions};

    get AllSunk() { return this._allSunk; }

    constructor(size: number = 10)
    {
        this._ships = [];
        this._hitPositions = [];
        this._missedPositions = [];
        this._occupiedPositions = [];
        this._size = size;
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
                this._occupiedPositions.push({x: x + i, y: y});
            }
            else
            {
                this._grid[x][y + i] = ship;
                this._occupiedPositions.push({x: x, y: y + i});
            }
        }
        this._ships.push(ship);
        return true;
    }

    public receiveAttack(position: Vector2): boolean
    {
        const hitShip = this.checkPosition(position);
        if (hitShip)
        {
           hitShip.hit();
           this.addHitAttack(position);
           this.checkAllSunk(hitShip);
           return true;
        }
        this.addMissedAttack(position);
        return false;
    }

    public isPositionHit(position: Vector2, checkMisses: boolean): boolean
    {
        return checkMisses ? this.checkArrayForHit(position, this._missedPositions) : this.checkArrayForHit(position, this._hitPositions);
    }

    public reset()
    {
        this._ships = [];
        this._hitPositions = [];
        this._missedPositions = [];
        this._occupiedPositions = [];
        this._allSunk = false;
        this.generateGrid(this._size);
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
            for (let j = 0; j < size; j++)
            {
                if (!this._grid[j])
                {
                    this._grid[j] = [];
                }
                this._grid[j][i] = null;
            }
        }
    }
    
    private canPlaceInPosition(shipLength: number, position: Vector2,  isHorizontal: boolean): boolean
    {
        if (this.hasOverlap(shipLength, position, isHorizontal)) return false;
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

    private checkAllSunk(hitShip: Ship)
    {
        if (!hitShip.isSunk()) return;
        this._allSunk = this._ships.every((ship) => ship.isSunk());
    }

    private hasOverlap(shipLength: number, position: Vector2, isHorizontal: boolean): boolean
    {
        const {x, y} = position;
        let hasClash = false;
        for (let i = 0; i < shipLength; i++)
        {
            if (isHorizontal)
            {
                const currPos = {x: x + i, y: y};
                hasClash = this._occupiedPositions.find(pos => pos.x === currPos.x && pos.y === currPos.y) != undefined;
                if (hasClash) return true;
            }
            else
            {
                const currPos = {x: x, y: y + i};
                hasClash = this._occupiedPositions.find(pos => pos.x === currPos.x && pos.y === currPos.y) != undefined;
                if (hasClash) return true;
            }
        }
        return false;
    }
}

module.exports = {Gameboard};