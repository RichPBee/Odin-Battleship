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

export enum GameType
{
    OnePlayer,
    TwoPlayer,
    Computer
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
        this._isTwoPlayer = false;
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
            this._context.UIManager.removeHoverable(true);
            this.switchState(GameState.Ended);
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

    public async startSetup(gameType: number)
    {
        this._isComputerOnly = gameType === GameType.Computer;
        this._isTwoPlayer = gameType === GameType.TwoPlayer;
        this.createPlayers(this._isComputerOnly, this._isTwoPlayer);
        this.switchState(GameState.Setup);
        if (this._isComputerOnly)
        {
            this._players[0].setupBoard();
            this._players[1].setupBoard();
            this._numPlacedShips = this.PlayerOne.Gameboard.NumShips + this.PlayerTwo.Gameboard.NumShips;
            this._context.UIManager.displayBothBoards();
            this.startPlaying();
            this.switchPlayer();
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
                this._context.UIManager.removeHoverable();
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
            this._context.UIManager.removeHoverable();
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
        this.switchState(GameState.Menu);
        this._currentPlayer = this.PlayerOne;
        this._activeIndex = Players.One;
        this._numPlacedShips = 0;
        if (this._isComputerOnly)
        {
            this._context.UIManager.displayPlayerOneBoard();
        }
    }

    private async playCurrentTurn()
    {
        if (this._currentPlayer === this.PlayerTwo && !this._isTwoPlayer && !this._isComputerOnly)
        {
            const position = (this.PlayerTwo as Computer).generateAttackPosition(this.PlayerOne);
            setTimeout(() => this._context.UIManager.clickBoardSquare(position), 300);
        }
        else if (this._isComputerOnly)
        {
            const enemy = this._currentPlayer === this.PlayerTwo ? this.PlayerOne : this.PlayerTwo;
            const position = (this._currentPlayer as Computer).generateAttackPosition(enemy);
            await this.wait(200);
            this._context.UIManager.clickBoardSquare(position);
            await this.wait(100);
            if (enemy.Gameboard.AllSunk)
            {
               this.switchState(GameState.Ended);
               return; 
            }
            await this.wait(100);  
            this.switchPlayer();
        }
    }

    private wait(ms: number)
    {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        })
    }

    private createPlayers(isComputerOnly: boolean, isTwoPlayer: boolean)
    {
        if (isComputerOnly)
        {
            const playerOne = new Computer(this._context.UIManager.BoardSize, 'P1');
            const playerTwo = new Computer(this._context.UIManager.BoardSize, 'P2');
            this._players[0] = playerOne;
            this._players[1] = playerTwo;
            this._currentPlayer = playerOne;
            return;
        }
        else if (isTwoPlayer)
        {
            const playerOne = new Player(this._context.UIManager.BoardSize, 'P1');
            const playerTwo = new Player(this._context.UIManager.BoardSize, 'P2');
            this._players[0] = playerOne;
            this._players[1] = playerTwo;
            this._currentPlayer = playerOne;
            return;
        }
        const playerOne = new Player(this._context.UIManager.BoardSize, 'P1');
        const playerTwo = new Computer(this._context.UIManager.BoardSize, 'P2', 2);
        this._players[0] = playerOne;
        this._players[1] = playerTwo;
        this._currentPlayer = playerOne;
    }
}

module.exports = {GameManager};