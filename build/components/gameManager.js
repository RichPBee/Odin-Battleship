"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    GameState[GameState["Setup"] = 1] = "Setup";
    GameState[GameState["Playing"] = 2] = "Playing";
    GameState[GameState["Ended"] = 3] = "Ended";
})(GameState || (exports.GameState = GameState = {}));
class GameManager {
    get ActiveIndex() { return this._activeIndex; }
    get CurrentPlayer() { return this._currentPlayer; }
    get GameState() { return this._currentState; }
    get IsTwoPlayer() { return this._isTwoPlayer; }
    get IsComputerOnly() { return this._isComputerOnly; }
    get PlayerOne() { return this._players[0]; }
    get PlayerTwo() { return this._players[1]; }
    get NumPlacedShips() { return this._numPlacedShips; }
    set NumPlacedShips(value) { this._numPlacedShips = value; }
    constructor(playerOne, playerTwo, context) {
        this._players = [playerOne, playerTwo];
        this._currentPlayer = playerOne;
        this._activeIndex = Players.One;
        this._currentState = GameState.Menu;
        this._context = context;
        this._numPlacedShips = 0;
        this._isTwoPlayer = true;
    }
    switchPlayer() {
        const playerIndex = Number(this._activeIndex) ? Players.One : Players.Two;
        this._currentPlayer = this._players[playerIndex];
        this._activeIndex = playerIndex;
        if (this.GameState === GameState.Playing) {
            this.playCurrentTurn();
        }
    }
    checkForWin(playerIndex) {
        const player = playerIndex === Players.One ? this.PlayerOne : this.PlayerTwo;
        const enemy = playerIndex === Players.One ? this.PlayerTwo : this.PlayerOne;
        if (enemy.Gameboard.AllSunk) {
            console.log(`${player.Name} has won the game!`);
            this._context.UIManager.disableBoardUI();
        }
    }
    placeShip(position, isHorizontal) {
        const ship = this._currentPlayer.AvailableShips[0];
        const placed = this._currentPlayer.placeShip(ship, position, isHorizontal);
        if (placed) {
            this._numPlacedShips++;
        }
    }
    startSetup() {
        return __awaiter(this, void 0, void 0, function* () {
            this.switchState(GameState.Setup);
            if (this._isComputerOnly) {
                this._players[0].setupBoard();
                this._players[1].setupBoard();
                this._numPlacedShips = this.PlayerOne.Gameboard.NumShips + this.PlayerTwo.Gameboard.NumShips;
                this.switchPlayer();
                this.startPlaying();
            }
        });
    }
    checkSetup() {
        if (this._numPlacedShips === 5) {
            this.switchPlayer();
            if (!this._isTwoPlayer) {
                this.PlayerTwo.setupBoard();
                this.startPlaying();
                this.switchPlayer();
                return;
            }
            setTimeout(() => {
                this._context.UIManager.switchPlayer(this.ActiveIndex);
            }, 300);
        }
        else if (this._numPlacedShips === 10) {
            this.switchPlayer();
            setTimeout(() => {
                this._context.UIManager.switchPlayer(this.ActiveIndex);
            }, 300);
            this.startPlaying();
        }
    }
    startPlaying() {
        this.switchState(GameState.Playing);
    }
    switchState(newState) {
        this._currentState = newState;
    }
    reset() {
        this.PlayerOne.reset();
        this.PlayerTwo.reset();
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