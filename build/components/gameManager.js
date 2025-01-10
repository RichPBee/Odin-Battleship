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
    }
    startPlaying() {
        this._players[0].setupBoard();
        this._players[1].setupBoard();
        this.switchState(GameState.Playing);
    }
    switchState(newState) {
        this._currentState = newState;
    }
}
exports.GameManager = GameManager;
module.exports = { GameManager };
//# sourceMappingURL=gameManager.js.map