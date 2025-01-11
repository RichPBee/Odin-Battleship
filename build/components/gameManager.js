"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = exports.GameState = exports.Players = void 0;
var Players;
(function (Players) {
    Players[Players["One"] = 0] = "One";
    Players[Players["Two"] = 1] = "Two";
})(Players || (exports.Players = Players = {}));
var GameState;
(function (GameState) {
    GameState[GameState["Menu"] = 0] = "Menu";
    GameState[GameState["Playing"] = 1] = "Playing";
    GameState[GameState["Ended"] = 2] = "Ended";
})(GameState || (exports.GameState = GameState = {}));
class GameManager {
    get ActiveIndex() { return this._activeIndex; }
    get CurrentPlayer() { return this._currentPlayer; }
    get IsTwoPlayer() { return this._isTwoPlayer; }
    get PlayerOne() { return this._players[0]; }
    get PlayerTwo() { return this._players[1]; }
    constructor(playerOne, playerTwo, context) {
        this._players = [playerOne, playerTwo];
        this._currentPlayer = playerOne;
        this._activeIndex = Players.One;
        this._currentState = GameState.Menu;
        this._context = context;
    }
    switchPlayer() {
        const playerIndex = Number(this._activeIndex) ? Players.One : Players.Two;
        this._currentPlayer = this._players[playerIndex];
        this._activeIndex = playerIndex;
        this.playCurrentTurn();
    }
    checkForWin(playerIndex) {
        const player = playerIndex === Players.One ? this.PlayerOne : this.PlayerTwo;
        const enemy = playerIndex === Players.One ? this.PlayerTwo : this.PlayerOne;
        if (enemy.Gameboard.AllSunk) {
            console.log(`${player.Name} has won the game!`);
            this._context.UIManager.disableBoardUI();
        }
    }
    startPlaying() {
        this._players[0].setupBoard();
        this._players[1].setupBoard();
        this.switchState(GameState.Playing);
    }
    switchState(newState) {
        this._currentState = newState;
    }
    playCurrentTurn() {
        if (this._currentPlayer === this.PlayerTwo && !this._isTwoPlayer) {
            const position = this.PlayerTwo.generateRandomPosition(this.PlayerOne);
            setTimeout(() => this._context.UIManager.clickBoardSquare(position), 300);
        }
    }
}
exports.GameManager = GameManager;
module.exports = { GameManager };
//# sourceMappingURL=gameManager.js.map