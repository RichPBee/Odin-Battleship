import { GameContext } from "../Game";
import { Vector2 } from "../utilities/IVector2";
import { Players } from "./gameManager";
import { Player } from "./player";

type ListenerFunction =
{
    [key: string]: () => void
}

export class UIManager
{
    private _context: GameContext;
    private _document: Document;
    private _main: HTMLElement;
    private _boardSection: HTMLElement;
    private _playerOneSquares: HTMLDivElement[][];
    private _playerTwoSquares: HTMLDivElement[][];
    private _playerOneBoard: HTMLElement;
    private _playerTwoBoard: HTMLElement;

    private _dummySquaresOne: HTMLDivElement[][];
    private _dummySquaresTwo: HTMLDivElement[][];
    private _dummyBoardOne: HTMLElement;
    private _dummyBoardTwo: HTMLElement;
    private _squareListeners: ListenerFunction;

    private _boardSize: number;

    constructor(document: Document, boardSize: number = 10, context: GameContext)
    {
        this._document = document;
        this._boardSize = boardSize;
        this._main = document.getElementById('main');
        this._playerOneSquares = [];
        this._playerTwoSquares = [];
        this._dummySquaresOne = [];
        this._dummySquaresTwo = [];
        this._squareListeners = {};
        this._context = context;
        this.createComponents();
    }

    private createComponents()
    {
        this.createBoardSections();
        this.createBoardSquares();
        this.createBottomSection();
    }

    private createBoardSections()
    {
        this._boardSection = document.createElement('div');
        this._boardSection.id = 'boardSection';

        this._playerOneBoard = document.createElement('div');
        this._playerOneBoard.className = 'gameBoard';
        this._playerOneBoard.id = 'boardOne';

        this._playerTwoBoard = document.createElement('div');
        this._playerTwoBoard.className = 'gameBoard';
        this._playerTwoBoard.id = 'boardTwo';

        this._dummyBoardOne = document.createElement('div');
        this._dummyBoardOne.className = 'gameBoard';

        this._dummyBoardTwo = document.createElement('div');
        this._dummyBoardTwo.className = 'gameBoard';

        this._main.appendChild(this._boardSection);
    }

    private createBoardSquares()
    {
        for (let i = 0; i < this._boardSize; i++)
        {
            for (let j = 0; j < this._boardSize; j++)
            {
                if (!this._playerOneSquares[j] && !this._playerTwoSquares[j])
                {
                    this._playerOneSquares[j] = [];
                    this._playerTwoSquares[j] = [];
                }
                if (!this._dummySquaresOne[j] && !this._dummySquaresTwo[j])
                {
                    this._dummySquaresOne[j] = [];
                    this._dummySquaresTwo[j] = [];
                }
                this.createMainSquare(j, i);
                this.createDummySquare(j, i);
            }   
        }
        this._playerOneBoard.setAttribute('style', `grid-template-columns: repeat(${this._boardSize}, 1fr)`);
        this._playerTwoBoard.setAttribute('style', `grid-template-columns: repeat(${this._boardSize}, 1fr)`);
        this._dummyBoardOne.setAttribute('style', `grid-template-columns: repeat(${this._boardSize}, 1fr)`);
        this._dummyBoardTwo.setAttribute('style', `grid-template-columns: repeat(${this._boardSize}, 1fr)`);
        this._boardSection.appendChild(this._playerOneBoard);
        this._boardSection.appendChild(this._dummyBoardTwo);
    }

    private createBottomSection()
    {      
        const bottomSection = document.createElement('div');
        const startButton  = document.createElement('button');
        startButton.innerText = 'Start';

        startButton.addEventListener('click', () => { 
            this._context.GameManager.startPlaying();
            startButton.disabled = true;
            this.colourSquares();
        })

        bottomSection.appendChild(startButton);
        this._main.appendChild(bottomSection);
    }

    private colourSquares()
    { 
        const { PlayerOne, PlayerTwo } = this._context.GameManager;
        for (const pos of PlayerOne.Gameboard.OccupiedPositions)
        {
            this._playerOneSquares[pos.x][pos.y].setAttribute('style', 'background-color: black');
        }
        
        for (const pos of PlayerTwo.Gameboard.OccupiedPositions)
        {
            this._playerTwoSquares[pos.x][pos.y].setAttribute('style', 'background-color: black');
        }
    }

    public clickBoardSquare(position: Vector2)
    {
        const gameManager = this._context.GameManager;
        let isHit = false;
        let square: HTMLDivElement;
        let dummySquare: HTMLDivElement;
        if (gameManager.ActiveIndex === 0)
        {
            isHit = gameManager.PlayerTwo.Gameboard.receiveAttack(position);
            square = this._playerTwoSquares[position.x][position.y];
            dummySquare = this._dummySquaresTwo[position.x][position.y];
        }
        else
        {
            isHit = gameManager.PlayerOne.Gameboard.receiveAttack(position);
            square = this._playerOneSquares[position.x][position.y];
            dummySquare = this._dummySquaresOne[position.x][position.y];
        }
        this.changeSquareColour(isHit, square, dummySquare);
        gameManager.checkForWin(gameManager.ActiveIndex);
        gameManager.switchPlayer();
        if (this._context.GameManager.IsTwoPlayer)
        {
            this.switchPlayer(gameManager.ActiveIndex);
            return;
        }
    }

    public disableBoardUI()
    {
        for (let i = 0; i < this._boardSize; i++)
        {
            for (let j = 0; j < this._boardSize; j++)
            {
                if (this._squareListeners[this.getListenerKey({x: j, y: i})])
                {
                    this._dummySquaresOne[j][i].removeEventListener('click', this._squareListeners[this.getListenerKey({x: j, y: i})])
                    delete this._squareListeners[this.getListenerKey({x: j, y: i})];
                }
                if (this._squareListeners[this.getListenerKey({x: j, y: i}, false)])
                {
                    this._dummySquaresTwo[j][i].removeEventListener('click', this._squareListeners[this.getListenerKey({x: j, y: i}, false)])
                    delete this._squareListeners[this.getListenerKey({x: j, y: i}, false)];
                }
            }
        }
    }

    private changeSquareColour(isHit: boolean, square: HTMLDivElement, dummySquare: HTMLDivElement)
    {
        const colour = isHit ? 'green' : 'red';
        square.setAttribute('style', `background-color: ${colour}`);
        square.removeEventListener('click', this.clickBoardSquare);
        dummySquare.setAttribute('style', `background-color: ${colour}`);
        dummySquare.removeEventListener('click', this.clickBoardSquare);
    }

    private switchPlayer(index: number)
    {
        if (index === 1)
        {
            this._boardSection.replaceChild(this._dummyBoardOne, this._playerOneBoard);
            this._boardSection.replaceChild(this._playerTwoBoard, this._dummyBoardTwo);
            return;
        }
        this._boardSection.replaceChild(this._dummyBoardTwo, this._playerTwoBoard);
        this._boardSection.replaceChild(this._playerOneBoard, this._dummyBoardOne);
    }

    private createMainSquare(x: number, y: number)
    {
        const boardSquare = document.createElement('div');
        const boardSquare2 = document.createElement('div');
        boardSquare.className = boardSquare2.className = 'boardSquare';
        boardSquare.id = `PlayerOne-Square0${x}-${y}`;
        boardSquare2.id = `playerTwo-Square-${x}-${y}`;
        this._playerOneSquares[x][y] = boardSquare;
        this._playerTwoSquares[x][y] = boardSquare2;
        this._playerOneBoard.appendChild(boardSquare);
        this._playerTwoBoard.appendChild(boardSquare2);
    }

    private createDummySquare(x: number, y: number)
    {
        const dummySquare = document.createElement('div');
        dummySquare.className = 'boardSquare';
        this._dummyBoardOne.appendChild(dummySquare);
        this._dummySquaresOne[x][y] = dummySquare;

        const dummySquare2 = document.createElement('div');
        dummySquare2.className = 'boardSquare';
        this._dummyBoardTwo.appendChild(dummySquare2);
        this._dummySquaresTwo[x][y] = dummySquare2;

        const listenerOne = () => { 
            if (this._context.GameManager.ActiveIndex === 0) return;
            this.clickBoardSquare({x, y});
            dummySquare.removeEventListener('click', listenerOne);
            delete this._squareListeners[this.getListenerKey({x, y})];
        }

        const listenerTwo = () => { 
            if (this._context.GameManager.ActiveIndex === 1) return;
            this.clickBoardSquare({x, y});
            dummySquare2.removeEventListener('click', listenerTwo);
            delete this._squareListeners[this.getListenerKey({x, y}, false)];
        }

        this._squareListeners[this.getListenerKey({x, y})] = listenerOne;
        this._squareListeners[this.getListenerKey({x, y}, false)] = listenerTwo;
        dummySquare.addEventListener('click', listenerOne);
        dummySquare2.addEventListener('click', listenerTwo);
    }

    private getListenerKey(position: Vector2, gameBoardOne: boolean = true)
    {
        return gameBoardOne ? `board-square-${position.x}-${position.y}` : `board-square-two-${position.x}-${position.y}`;
    }
}