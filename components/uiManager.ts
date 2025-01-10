import { GameContext } from "../Game";
import { Vector2 } from "../utilities/IVector2";
import { Players } from "./gameManager";
import { Player } from "./player";

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

    private _boardSize: number;

    constructor(document: Document, boardSize: number = 10, context: GameContext)
    {
        this._document = document;
        this._boardSize = boardSize;
        this._main = document.getElementById('main');
        this._playerOneSquares = [];
        this._playerTwoSquares = [];
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
                const boardSquare = document.createElement('div');
                const boardSquare2 = document.createElement('div');
                boardSquare.className = boardSquare2.className = 'boardSquare';
                boardSquare.id = `PlayerOne-Square0${j}-${i}`;
                boardSquare2.id = `playerTwo-Square-${j}-${i}`;
                this._playerOneSquares[j][i] = boardSquare;
                this._playerTwoSquares[j][i] = boardSquare2;
                this._playerOneBoard.appendChild(boardSquare);
                this._playerTwoBoard.appendChild(boardSquare2);

                boardSquare.addEventListener('click', () => { 
                    this.clickBoardSquare({x: j, y: i});
                })
                boardSquare2.addEventListener('click', () => { 
                    this.clickBoardSquare({x: j, y: i});
                })
            }   
        }
        this._playerOneBoard.setAttribute('style', `grid-template-columns: repeat(${this._boardSize}, 1fr)`);
        this._playerTwoBoard.setAttribute('style', `grid-template-columns: repeat(${this._boardSize}, 1fr)`);

        this._boardSection.appendChild(this._playerOneBoard);
        this._boardSection.appendChild(this._playerTwoBoard);
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

    private clickBoardSquare(position: Vector2)
    {
        const gameManager = this._context.GameManager;
        let isHit = false;
        let square: HTMLDivElement;
        if (gameManager.ActiveIndex === 0)
        {
            isHit = gameManager.PlayerTwo.Gameboard.receiveAttack(position);
            square = this._playerTwoSquares[position.x][position.y];
        }
        else
        {
            isHit = gameManager.PlayerOne.Gameboard.receiveAttack(position);
            square = this._playerTwoSquares[position.x][position.y];
        }
        this.changeSquareColour(isHit, square);
        gameManager.switchPlayer();
    }

    private changeSquareColour(isHit: boolean, square: HTMLDivElement)
    {
        const colour = isHit ? 'green' : 'red';
        square.setAttribute('style', `background-color: ${colour}`);
        square.removeEventListener('click', this.clickBoardSquare);
    }
}