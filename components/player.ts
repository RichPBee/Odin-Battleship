import {Gameboard} from './gameboard';
import {Ship} from './ship';

export class Player
{
    private _gameboard: Gameboard;
    private _availableShips: Ship[];
    constructor(boardSize: number = 10)
    {
        this._gameboard = new Gameboard(boardSize);
        this._availableShips = [];
    }
}

export class Computer extends Player
{
    private generateRandomPosition()
    {

    }
}