import { Player } from "./player";
import { GameContext } from "../Game";

export enum Players
{
    One,
    Two
}

export enum GameState
{
    Menu,
    Playing,
    Ended
}

export class GameManager
{
    private _context: GameContext;
    private _activeIndex: Players;
    get ActiveIndex() { return this._activeIndex; }
    private _currentPlayer: Player;
    get CurrentPlayer() { return this._currentPlayer; }
    private _players: [Player, Player];
    private _currentState: GameState;
    get PlayerOne() { return this._players[ 0 ]; }
    get PlayerTwo() { return this._players[ 1 ]; }

    constructor(playerOne: Player, playerTwo: Player, context: GameContext)
    {
        this._players = [playerOne, playerTwo];
        this._currentPlayer = playerOne;
        this._activeIndex = Players.One;
        this._currentState = GameState.Menu;
        this._context = context;
    }

    public switchPlayer()
    {
        const playerIndex = Number(this._activeIndex) ? Players.One : Players.Two;
        this._currentPlayer =  this._players[playerIndex];
        this._activeIndex = playerIndex;
    }

    public startPlaying()
    {
        this._players[0].setupBoard();
        this._players[1].setupBoard();
        this.switchState(GameState.Playing)
    }

    public switchState(newState: GameState)
    {
        this._currentState = newState;
    }
}

module.exports = {GameManager};