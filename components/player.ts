import {Gameboard} from './gameboard';
import {Ship} from './ship';
import { Vector2 } from '../utilities/IVector2';
import { GameContext } from '../Game';

export class Player
{
    protected _gameboard: Gameboard;
    get Gameboard() { return this._gameboard; }

    protected _placedPositions: Vector2[];
    protected _hitPositions: Vector2[];

    protected _availableShips: Ship[];
    get AvailableShips() {return this._availableShips;}
    protected _isComputerPlayer: boolean;
    protected _name: string;
    protected _boardSize: number;
    get Name() {return this._name;}

    constructor(boardSize: number = 10, name: string = 'Player')
    {
        this._gameboard = new Gameboard(boardSize);
        this._availableShips = [];
        this._name = name;
        this._isComputerPlayer = false;
        this._boardSize = boardSize;
        this.setupShips();
    }

    public reset()
    {
        this._gameboard.reset();
        this.setupShips();
    }

    public async setupBoard()
    {
        for (const ship of this._availableShips)
        {
            this.placeShipAuto(ship);
        }
        return;
    }

    protected setupShips()
    {
        const carrier = new Ship(5, 'Carrier');
        const battleship = new Ship(4, 'Battleship');
        const destroyer = new Ship(3, 'Destroyer');
        const submarine = new Ship(3, 'Submarine');
        const patrolBoat = new Ship(2, 'Patrol Boat');
        this._availableShips = [carrier, battleship, destroyer, submarine, patrolBoat];
    }

    protected placeShipAuto(ship: Ship)
    {
        const position = {x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10)};
        const isHorizontal = Math.random() * 2 > 1;
        const placed = this._gameboard.placeShip(ship, position, isHorizontal);
        if (!placed)
        {
            this.placeShipAuto(ship);
        }
    }

    public placeShip(ship: Ship, position: Vector2, isHorizontal: boolean): boolean
    {
        const placed = this._gameboard.placeShip(ship, position, isHorizontal );
        if (placed)
        {
            this._availableShips.shift();
            return true;
        }
        return false;
    }
}

type HitPositionInfo = 
{
    position: Vector2;
    adjacentPositions: Vector2[];
}

enum Direction
{
    Up,
    Down, 
    Left,
    Right
}

export class Computer extends Player
{
    private _difficulty: number;
    private _lastHitPosition: HitPositionInfo;
    private _subsequentHitPositions: HitPositionInfo[];
    private _nextDirection: Direction;
    constructor(boardSize: number, name: string = 'Computer', difficulty = 0)
    {
        super(boardSize, name);
        this._isComputerPlayer = true;
        this._difficulty = difficulty;
        this._subsequentHitPositions = [];
    }

    public generateAttackPosition(enemy: Player): Vector2
    {
        if (this._difficulty === 0 || !this._lastHitPosition)
        {
            return this.generateRandomPosition(enemy);
        }
        else if (this._difficulty === 1)
        {
            return this.getNextAdjacentPosition(this._lastHitPosition, enemy);
        }
        return this.generateCalculatedPosition(enemy);
    }

    protected generateRandomPosition(enemy: Player): Vector2
    {
        const position = {x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10)};
        const isUsed = enemy.Gameboard.isPositionHit(position, true) || enemy.Gameboard.isPositionHit(position, false)
        if (!isUsed)
        {
            if (enemy.Gameboard.checkPosition(position))
            {
                this._lastHitPosition = this.calculateAdjacentPositions(position, enemy);
                this._subsequentHitPositions.push(this._lastHitPosition);
                this._nextDirection = null;
            }   
            return position;
        }
        return this.generateRandomPosition(enemy);
    }

    protected getNextAdjacentPosition(posInfo: HitPositionInfo, enemy: Player): Vector2
    {
        const position = posInfo.adjacentPositions[0];
        const isUsed = enemy.Gameboard.isPositionHit(position, true) || enemy.Gameboard.isPositionHit(position, false)
        if (!position || isUsed)
        {
            return this.generateRandomPosition(enemy);
        }
        posInfo.adjacentPositions.shift();
        return position;
    }

    protected generateCalculatedPosition(enemy: Player)
    {
        const numHitPositions = this._subsequentHitPositions.length;
        if (numHitPositions === 0) return this.generateRandomPosition(enemy);
        const firstHitPosition = this._subsequentHitPositions[0];
        if (numHitPositions === 1 && !this._nextDirection)
        {
            const nextPosToHit = this.getNextAdjacentPosition(firstHitPosition, enemy);
            if (enemy.Gameboard.checkPosition(nextPosToHit))
            {
                const nextAdjacents = this.calculateAdjacentPositions(nextPosToHit, enemy);
                this._subsequentHitPositions.push(nextAdjacents);
            }
            return nextPosToHit;
        }
        else if (numHitPositions === 1 && this._nextDirection)
        {
            const nextPosition = this.getNextPosition(this._nextDirection, firstHitPosition.position);
            return this.targetNextPosition(nextPosition, firstHitPosition, enemy);
        }

        const lastHitPosition = this._subsequentHitPositions[numHitPositions - 1];
        const previousHitPosition = this._subsequentHitPositions[numHitPositions - 2];
        this._nextDirection = this.calculateDirection(lastHitPosition.position, previousHitPosition.position);
        const nextPosition = this.getNextPosition(this._nextDirection, lastHitPosition.position);
        return this.targetNextPosition(nextPosition, firstHitPosition, enemy);
    }

    protected targetNextPosition(nextPosition: Vector2, firstHitPosition: HitPositionInfo, enemy: Player, hasSwitched: boolean = false)
    {
        const isNextUsed = enemy.Gameboard.isPositionHit(nextPosition, true) || enemy.Gameboard.isPositionHit(nextPosition, false)
        if (!this.isValidPosition(nextPosition) || isNextUsed)
        {
            this._nextDirection = this.getOppositeDirection(this._nextDirection);
            const oppositePos = this.getNextPosition(this._nextDirection, firstHitPosition.position);
            if (!this.isValidPosition(oppositePos))
            {
                this._subsequentHitPositions = [];
                return this.generateRandomPosition(enemy);
            }
            const isUsed = enemy.Gameboard.isPositionHit(oppositePos, true) || enemy.Gameboard.isPositionHit(oppositePos, false)
            if (!isUsed)
            {
                if (enemy.Gameboard.checkPosition(oppositePos))
                {
                    const relevantHitInfo = this.calculateAdjacentPositions(oppositePos, enemy);
                    this._subsequentHitPositions = [firstHitPosition, relevantHitInfo];
                }
                return oppositePos;
            }
            this._subsequentHitPositions = [];
            this._nextDirection = null;
            return this.generateRandomPosition(enemy);
        }
            
        if (!isNextUsed)
        {
            if (enemy.Gameboard.checkPosition(nextPosition))
            {
                const relevantHitInfo = this.calculateAdjacentPositions(nextPosition, enemy);
                this._subsequentHitPositions.push(relevantHitInfo);
            }
            else if (!hasSwitched)
            {
                this._nextDirection = this.getOppositeDirection(this._nextDirection);
                this._subsequentHitPositions = [firstHitPosition];
            }
            else
            {
                this._nextDirection = null;
                this._subsequentHitPositions = [];
            }
            return nextPosition;
        }
        this._subsequentHitPositions = [];
        this._nextDirection = null;
        return this.generateRandomPosition(enemy);
    }

    protected targetAdjacentPositions(nextPositions: Vector2[], enemy: Player): Vector2
    {
        for (let i = 0; i < 4; i++)
        {
            const nextPos = nextPositions[i];
            if (!nextPos) continue;
            const isUsed = enemy.Gameboard.isPositionHit(nextPos, true) || enemy.Gameboard.isPositionHit(nextPos, false)
            if (!isUsed)
            {
                if (enemy.Gameboard.checkPosition(nextPos))
                {
                    this._subsequentHitPositions.push(this.calculateAdjacentPositions(nextPos, enemy));
                } 
                return nextPos;
            }
        }
        this._subsequentHitPositions = [];
        return this.generateRandomPosition(enemy);
    }

    protected getOppositeDirection(direction: Direction)
    {
        if (direction === Direction.Left)
        {
            return Direction.Right;
        }
        else if (direction === Direction.Right)
        {
            return Direction.Left;
        }
        else if (direction === Direction.Up)
        {
            return Direction.Down;
        }
        return Direction.Up;
    }
    
    protected placeShipAuto(ship: Ship): void 
    {
        super.placeShipAuto(ship);
    }

    protected calculateDirection(p1: Vector2, p2: Vector2): Direction
    {
        if (p1.x < p2.x)
        {
            return Direction.Left;
        }
        else if (p1.x > p2.x)
        {
            return Direction.Right;
        }
        else if (p1.y < p2.y)
        {
            return Direction.Up;
        }
        return Direction.Down;
    }

    protected getNextPosition(direction: Direction, pos: Vector2): Vector2
    {
        console.log(direction);
        if (direction == Direction.Left)
        {
            return {x: pos.x - 1, y: pos.y};
        }
        else if (direction == Direction.Right)
        {
            return {x: pos.x + 1, y: pos.y};
        }
        else if (direction == Direction.Up)
        {
            return {x: pos.x, y: pos.y - 1};
        }
        return {x: pos.x, y: pos.y + 1};
    }

    protected isValidPosition(position: Vector2): boolean
    {
        return (position.x >= 0 && position.x < this._boardSize && position.y >= 0 && position.y < this._boardSize);
    }
    
    protected calculateAdjacentPositions(position: Vector2, enemy: Player): HitPositionInfo
    {
        const adjacentPositions = [];
        for (let i = -1; i < 2; i++)
        {
            for (let j = -1; j < 2; j++)
            {
                if (i !== 0 && j !== 0 || i == 0 && j ==0) continue;
                if (position.x + j < 0 || position.x + j >= this._boardSize || position.y + i < 0 || position.y + i >= this._boardSize) continue;
                const currPos = {x: position.x + j, y: position.y + i};
                const isUsed = enemy.Gameboard.isPositionHit(currPos, true) || enemy.Gameboard.isPositionHit(currPos, false);
                const alreadyFound = adjacentPositions.find((pos) => pos.x === position.x + j && pos.y === position.y + i);
                console.log(position.x + j, position.y + i);
                console.log(isUsed, alreadyFound);
                if (!isUsed && !alreadyFound)
                {
                    adjacentPositions.push({x: position.x + j, y: position.y + i});
                }
            }
        }
        console.log(adjacentPositions);
        return {position, adjacentPositions}
    }
}