import { GameManager } from "./components/gameManager";
import { UIManager } from "./components/uiManager";
import { Player } from './components/player';

export class Game
{
    private _uiManager: UIManager;
    private _gameManager: GameManager;
    private _document: Document;
    private _boardSize: number;
    private _context: GameContext;
    private _playerOne: Player;
    private _playerTwo: Player;

    constructor(document: Document, boardSize: number, playerOne: Player, playerTwo: Player)
    {
        this._document = document;
        this._boardSize = boardSize;
        this._playerOne = playerOne;
        this._playerTwo = playerTwo;
        this.createComponents();
    }

    private createComponents()
    {  
        this._context = new GameContext(this._playerOne, this._playerTwo, this._document, this._boardSize);
    }
}

export class GameContext implements GameContext
{
    private _gameManager: GameManager;
    get GameManager(): GameManager { return this._gameManager; }

    private _uiManager: UIManager;
    get UIManager(): UIManager { return this._uiManager; }
    
    constructor(playerOne: Player, playerTwo: Player, document: Document, boardSize: number)
    {
        this._gameManager = new GameManager(playerOne, playerTwo, this);
        this._uiManager = new UIManager(document, boardSize, this);
    }
}

export interface GameContext
{
    UIManager: UIManager;
    GameManager: GameManager;
}