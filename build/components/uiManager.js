"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIManager = void 0;
class UIManager {
    constructor(document, boardSize = 10, context) {
        this._document = document;
        this._boardSize = boardSize;
        this._main = document.getElementById('main');
        this._playerOneSquares = [];
        this._playerTwoSquares = [];
        this._dummySquaresOne = [];
        this._dummySquaresTwo = [];
        this._squareListeners = {};
        this._context = context;
        this._isHorizontal = true;
        this.createComponents();
    }
    createComponents() {
        this.createTopSection();
        this.createBoardSections();
        this.createBoardSquares();
        this.createBottomSection();
    }
    createBoardSections() {
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
    createBoardSquares() {
        for (let i = 0; i < this._boardSize; i++) {
            for (let j = 0; j < this._boardSize; j++) {
                if (!this._playerOneSquares[j] && !this._playerTwoSquares[j]) {
                    this._playerOneSquares[j] = [];
                    this._playerTwoSquares[j] = [];
                }
                if (!this._dummySquaresOne[j] && !this._dummySquaresTwo[j]) {
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
    createBottomSection() {
        const bottomSection = document.createElement('div');
        const startButton = document.createElement('button');
        startButton.innerText = 'Start';
        const resetButton = document.createElement('button');
        resetButton.innerText = 'Reset';
        startButton.addEventListener('click', () => {
            this._context.GameManager.startSetup();
            startButton.disabled = true;
            this.colourSquares();
            this.enableUI();
        });
        resetButton.addEventListener('click', () => {
            this._context.GameManager.reset();
            this.resetSquares();
            startButton.disabled = false;
        });
        bottomSection.appendChild(startButton);
        bottomSection.appendChild(resetButton);
        this._main.appendChild(bottomSection);
    }
    colourSquares() {
        const { PlayerOne, PlayerTwo } = this._context.GameManager;
        for (const pos of PlayerOne.Gameboard.OccupiedPositions) {
            this._playerOneSquares[pos.x][pos.y].setAttribute('style', 'background-color: black');
        }
        for (const pos of PlayerTwo.Gameboard.OccupiedPositions) {
            this._playerTwoSquares[pos.x][pos.y].setAttribute('style', 'background-color: black');
        }
    }
    resetSquares() {
        this.disableBoardUI();
        for (let i = 0; i < this._boardSize; i++) {
            for (let j = 0; j < this._boardSize; j++) {
                this._playerOneSquares[j][i].setAttribute('style', 'background-color: transparent');
                this._playerTwoSquares[j][i].setAttribute('style', 'background-color: transparent');
                this._dummySquaresOne[j][i].setAttribute('style', 'background-color: transparent');
                this._dummySquaresTwo[j][i].setAttribute('style', 'background-color: transparent');
                this.applyListeners(this._dummySquaresOne[j][i], this._dummySquaresTwo[j][i], { x: j, y: i });
            }
        }
    }
    clickBoardSquare(position) {
        const gameManager = this._context.GameManager;
        let isHit = false;
        let square;
        let dummySquare;
        if (gameManager.ActiveIndex === 0) {
            isHit = gameManager.PlayerTwo.Gameboard.receiveAttack(position);
            square = this._playerTwoSquares[position.x][position.y];
            dummySquare = this._dummySquaresTwo[position.x][position.y];
        }
        else {
            isHit = gameManager.PlayerOne.Gameboard.receiveAttack(position);
            square = this._playerOneSquares[position.x][position.y];
            dummySquare = this._dummySquaresOne[position.x][position.y];
        }
        this.changeSquareColour(isHit, square, dummySquare);
        gameManager.checkForWin(gameManager.ActiveIndex);
        gameManager.switchPlayer();
        if (this._context.GameManager.IsTwoPlayer) {
            this.switchPlayer(gameManager.ActiveIndex);
            return;
        }
    }
    enableUI() {
        for (let i = 0; i < this._boardSize; i++) {
            for (let j = 0; j < this._boardSize; j++) {
                this.applyListeners(this._dummySquaresOne[j][i], this._dummySquaresTwo[j][i], { x: j, y: i });
            }
        }
    }
    disableBoardUI() {
        for (let i = 0; i < this._boardSize; i++) {
            for (let j = 0; j < this._boardSize; j++) {
                if (this._squareListeners[this.getListenerKey({ x: j, y: i })]) {
                    this._dummySquaresOne[j][i].removeEventListener('click', this._squareListeners[this.getListenerKey({ x: j, y: i })]);
                    delete this._squareListeners[this.getListenerKey({ x: j, y: i })];
                }
                if (this._squareListeners[this.getListenerKey({ x: j, y: i }, false)]) {
                    this._dummySquaresTwo[j][i].removeEventListener('click', this._squareListeners[this.getListenerKey({ x: j, y: i }, false)]);
                    delete this._squareListeners[this.getListenerKey({ x: j, y: i }, false)];
                }
            }
        }
    }
    changeSquareColour(isHit, square, dummySquare) {
        const colour = isHit ? 'green' : 'red';
        square.setAttribute('style', `background-color: ${colour}`);
        square.removeEventListener('click', this.clickBoardSquare);
        dummySquare.setAttribute('style', `background-color: ${colour}`);
        dummySquare.removeEventListener('click', this.clickBoardSquare);
    }
    switchPlayer(index) {
        if (index === 1) {
            this._boardSection.replaceChild(this._dummyBoardOne, this._playerOneBoard);
            this._boardSection.replaceChild(this._playerTwoBoard, this._dummyBoardTwo);
            return;
        }
        this._boardSection.replaceChild(this._dummyBoardTwo, this._playerTwoBoard);
        this._boardSection.replaceChild(this._playerOneBoard, this._dummyBoardOne);
    }
    createMainSquare(x, y) {
        const boardSquare = document.createElement('div');
        const boardSquare2 = document.createElement('div');
        boardSquare.className = boardSquare2.className = 'boardSquare';
        boardSquare.id = `PlayerOne-Square0${x}-${y}`;
        boardSquare2.id = `playerTwo-Square-${x}-${y}`;
        this._playerOneSquares[x][y] = boardSquare;
        this._playerTwoSquares[x][y] = boardSquare2;
        this._playerOneBoard.appendChild(boardSquare);
        this._playerTwoBoard.appendChild(boardSquare2);
        const setupListener = () => {
            if (this._context.GameManager.GameState !== 1)
                return;
            this._context.GameManager.placeShip({ x, y }, this._isHorizontal);
            this._context.GameManager.checkSetup();
            this.colourSquares();
        };
        boardSquare.addEventListener('click', setupListener);
        boardSquare2.addEventListener('click', setupListener);
    }
    createDummySquare(x, y) {
        const dummySquare = document.createElement('div');
        dummySquare.className = 'boardSquare';
        this._dummyBoardOne.appendChild(dummySquare);
        this._dummySquaresOne[x][y] = dummySquare;
        const dummySquare2 = document.createElement('div');
        dummySquare2.className = 'boardSquare';
        this._dummyBoardTwo.appendChild(dummySquare2);
        this._dummySquaresTwo[x][y] = dummySquare2;
    }
    getListenerKey(position, gameBoardOne = true) {
        return gameBoardOne ? `board-square-${position.x}-${position.y}` : `board-square-two-${position.x}-${position.y}`;
    }
    applyListeners(dummySquare, dummySquare2, position) {
        const listenerOne = () => {
            if (this._context.GameManager.ActiveIndex === 0)
                return;
            if (this._context.GameManager.GameState !== 2)
                return;
            this.clickBoardSquare(position);
            dummySquare.removeEventListener('click', listenerOne);
            delete this._squareListeners[this.getListenerKey(position)];
        };
        const listenerTwo = () => {
            if (this._context.GameManager.ActiveIndex === 1)
                return;
            if (this._context.GameManager.GameState !== 2)
                return;
            this.clickBoardSquare(position);
            dummySquare2.removeEventListener('click', listenerTwo);
            delete this._squareListeners[this.getListenerKey(position, false)];
        };
        this._squareListeners[this.getListenerKey(position)] = listenerOne;
        this._squareListeners[this.getListenerKey(position, false)] = listenerTwo;
        dummySquare.addEventListener('click', listenerOne);
        dummySquare2.addEventListener('click', listenerTwo);
    }
    createTopSection() {
        this._topSection = document.createElement('div');
        const switchDirectionButton = document.createElement('button');
        switchDirectionButton.innerText = 'Horizontal';
        const switchCallBack = () => {
            this._isHorizontal = !this._isHorizontal;
            const newText = this._isHorizontal ? 'Horizontal' : 'Vertical';
            switchDirectionButton.innerText = newText;
        };
        switchDirectionButton.addEventListener('click', switchCallBack);
        this._topSection.appendChild(switchDirectionButton);
        this._main.appendChild(this._topSection);
    }
}
exports.UIManager = UIManager;
//# sourceMappingURL=uiManager.js.map