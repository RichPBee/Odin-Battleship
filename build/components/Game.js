"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameContext = exports.Game = void 0;
const gameManager_1 = require("./gameManager");
const uiManager_1 = require("./uiManager");
class Game {
    constructor(document, boardSize, playerOne, playerTwo) {
        this._document = document;
        this._boardSize = boardSize;
        this._playerOne = playerOne;
        this._playerTwo = playerTwo;
        this.createComponents();
    }
    createComponents() {
        this._context = new GameContext(this._playerOne, this._playerTwo, this._document, this._boardSize);
    }
}
exports.Game = Game;
class GameContext {
    get GameManager() { return this._gameManager; }
    get UIManager() { return this._uiManager; }
    constructor(playerOne, playerTwo, document, boardSize) {
        this._gameManager = new gameManager_1.GameManager(playerOne, playerTwo, this);
        this._uiManager = new uiManager_1.UIManager(document, boardSize, this);
    }
}
exports.GameContext = GameContext;
//# sourceMappingURL=Game.js.map