import {Gameboard} from './gameboard';
import {Ship} from './ship';

class Player
{
    private _gameboard: Gameboard;
    private _availableShips: Ship[];
    constructor()
    {
        this._gameboard = new Gameboard();
        this._availableShips = [];
    }
}

class Computer extends Player
{
    private generateRandomPosition()
    {
        
    }
}