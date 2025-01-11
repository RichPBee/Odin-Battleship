import { Computer, Player } from "./player";
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
    private _isTwoPlayer: boolean;
    get IsTwoPlayer() { return this._isTwoPlayer; } 
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
        this.playCurrentTurn();
    }

    public checkForWin(playerIndex: number)
    {
        const player = playerIndex === Players.One ? this.PlayerOne : this.PlayerTwo;
        const enemy = playerIndex === Players.One ? this.PlayerTwo : this.PlayerOne;
        if (enemy.Gameboard.AllSunk)
        {
            console.log(`${player.Name} has won the game!`);
            this._context.UIManager.disableBoardUI();
        }
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

    private playCurrentTurn()
    {
        if (this._currentPlayer === this.PlayerTwo && !this._isTwoPlayer)
        {
            const position = (this.PlayerTwo as Computer).generateRandomPosition(this.PlayerOne);
            setTimeout(() => this._context.UIManager.clickBoardSquare(position), 300);
        }
    }
}

module.exports = {GameManager};