import { Computer, Player } from "./player";
import { GameContext } from "../Game";
import { Vector2 } from "../utilities/IVector2";

export enum Players
{
    One,
    Two
}

export enum GameState
{
    Menu,
    Setup,
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
    get GameState() { return this._currentState; }
    private _isTwoPlayer: boolean;
    get IsTwoPlayer() { return this._isTwoPlayer; } 
    private _isComputerOnly: boolean;
    get IsComputerOnly() { return this._isComputerOnly; }
    get PlayerOne() { return this._players[ 0 ]; }
    get PlayerTwo() { return this._players[ 1 ]; }
    private _numPlacedShips: number;
    get NumPlacedShips() { return this._numPlacedShips; }
    set NumPlacedShips(value: number) { this._numPlacedShips = value; }

    constructor(playerOne: Player, playerTwo: Player, context: GameContext)
    {
        this._players = [playerOne, playerTwo];
        this._currentPlayer = playerOne;
        this._activeIndex = Players.One;
        this._currentState = GameState.Menu;
        this._context = context;
        this._numPlacedShips = 0;
        this._isTwoPlayer = true;
    }

    public switchPlayer()
    {
        const playerIndex = Number(this._activeIndex) ? Players.One : Players.Two;
        this._currentPlayer =  this._players[playerIndex];
        this._activeIndex = playerIndex;
        if (this.GameState === GameState.Playing)
        {
            this.playCurrentTurn();
        }
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

    public placeShip(position: Vector2, isHorizontal: boolean)
    {
        const ship = this._currentPlayer.AvailableShips[0];
        const placed = this._currentPlayer.placeShip(ship, position, isHorizontal);
        if (placed)
        {
            this._numPlacedShips++;
        }
    }

    public async startSetup()
    {
        this.switchState(GameState.Setup);
        if (this._isComputerOnly)
        {
            this._players[0].setupBoard();
            this._players[1].setupBoard();
            this._numPlacedShips = this.PlayerOne.Gameboard.NumShips + this.PlayerTwo.Gameboard.NumShips;
            this.switchPlayer();
            this.startPlaying();
        }
    }
    

    public checkSetup()
    {
        if (this._numPlacedShips === 5)
        {
            this.switchPlayer();
            if (!this._isTwoPlayer)
            {
                this.PlayerTwo.setupBoard();
                this.startPlaying();
                this.switchPlayer();
                return;
            }

            setTimeout(() => { 
                this._context.UIManager.switchPlayer(this.ActiveIndex);
            }, 300);
        }
        else if (this._numPlacedShips === 10)
        {
            this.switchPlayer();
            setTimeout(() => { 
                this._context.UIManager.switchPlayer(this.ActiveIndex);
            }, 300);
            this.startPlaying();
        }
    }

    public startPlaying()
    {
        this.switchState(GameState.Playing);
    }

    public switchState(newState: GameState)
    {
        this._currentState = newState;
    }

    public reset()
    {
        this.PlayerOne.reset();
        this.PlayerTwo.reset();
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