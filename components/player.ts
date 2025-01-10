import {Gameboard} from './gameboard';
import {Ship} from './ship';
import { Vector2 } from '../utilities/IVector2';

export class Player
{
    protected _gameboard: Gameboard;
    get Gameboard() { return this._gameboard; }

    protected _placedPositions: Vector2[];
    protected _hitPositions: Vector2[];

    protected _availableShips: Ship[];

    protected _name: string;
    get Name() {return this._name;}

    constructor(boardSize: number = 10, name: string = 'Player')
    {
        this._gameboard = new Gameboard(boardSize);
        this._availableShips = [];
        this._name = name;
        this.setupShips();
    }

    public setupBoard()
    {
        for (const ship of this._availableShips)
        {
            this.placeShipAuto(ship);
        }
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
}

export class Computer extends Player
{
    constructor(boardSize: number, name: string = 'Computer')
    {
        super(boardSize, name);
    }

    public generateRandomPosition(enemy: Player): Vector2
    {
        const position = {x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10)};
        const isUsed = enemy.Gameboard.isPositionHit(position, true) || enemy.Gameboard.isPositionHit(position, false)
        if (!isUsed)
        {
            return position;
        }
        return this.generateRandomPosition(enemy);
    }
    
    protected placeShipAuto(ship: Ship): void 
    {
        super.placeShipAuto(ship);
    }
    
}