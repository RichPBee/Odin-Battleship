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
exports.GameManager = exports.GameType = exports.GameState = exports.Players = void 0;
const player_1 = require("./player");
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
var GameType;
(function (GameType) {
    GameType[GameType["OnePlayer"] = 0] = "OnePlayer";
    GameType[GameType["TwoPlayer"] = 1] = "TwoPlayer";
    GameType[GameType["Computer"] = 2] = "Computer";
})(GameType || (exports.GameType = GameType = {}));
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
        this._isTwoPlayer = false;
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
            this._context.UIManager.removeHoverable(true);
            this.switchState(GameState.Ended);
        }
    }
    placeShip(position, isHorizontal) {
        const ship = this._currentPlayer.AvailableShips[0];
        const placed = this._currentPlayer.placeShip(ship, position, isHorizontal);
        if (placed) {
            this._numPlacedShips++;
        }
    }
    startSetup(gameType) {
        return __awaiter(this, void 0, void 0, function* () {
            this._isComputerOnly = gameType === GameType.Computer;
            this._isTwoPlayer = gameType === GameType.TwoPlayer;
            this.createPlayers(this._isComputerOnly, this._isTwoPlayer);
            this.switchState(GameState.Setup);
            if (this._isComputerOnly) {
                this._players[0].setupBoard();
                this._players[1].setupBoard();
                this._numPlacedShips = this.PlayerOne.Gameboard.NumShips + this.PlayerTwo.Gameboard.NumShips;
                this._context.UIManager.displayBothBoards();
                this.startPlaying();
                this.switchPlayer();
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
                this._context.UIManager.removeHoverable();
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
            this._context.UIManager.removeHoverable();
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
        this.switchState(GameState.Menu);
        this._currentPlayer = this.PlayerOne;
        this._activeIndex = Players.One;
        this._numPlacedShips = 0;
        if (this._isComputerOnly) {
            this._context.UIManager.displayPlayerOneBoard();
        }
    }
    playCurrentTurn() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._currentPlayer === this.PlayerTwo && !this._isTwoPlayer && !this._isComputerOnly) {
                const position = this.PlayerTwo.generateRandomPosition(this.PlayerOne);
                setTimeout(() => this._context.UIManager.clickBoardSquare(position), 300);
            }
            else if (this._isComputerOnly) {
                const enemy = this._currentPlayer === this.PlayerTwo ? this.PlayerOne : this.PlayerTwo;
                const position = this._currentPlayer.generateRandomPosition(enemy);
                yield this.wait(200);
                this._context.UIManager.clickBoardSquare(position);
                yield this.wait(100);
                if (enemy.Gameboard.AllSunk) {
                    this.switchState(GameState.Ended);
                    return;
                }
                yield this.wait(100);
                this.switchPlayer();
            }
        });
    }
    wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
    createPlayers(isComputerOnly, isTwoPlayer) {
        if (isComputerOnly) {
            const playerOne = new player_1.Computer(this._context.UIManager.BoardSize, 'P1');
            const playerTwo = new player_1.Computer(this._context.UIManager.BoardSize, 'P2');
            this._players[0] = playerOne;
            this._players[1] = playerTwo;
            this._currentPlayer = playerOne;
            return;
        }
        else if (isTwoPlayer) {
            const playerOne = new player_1.Player(this._context.UIManager.BoardSize, 'P1');
            const playerTwo = new player_1.Player(this._context.UIManager.BoardSize, 'P2');
            this._players[0] = playerOne;
            this._players[1] = playerTwo;
            this._currentPlayer = playerOne;
            return;
        }
        const playerOne = new player_1.Player(this._context.UIManager.BoardSize, 'P1');
        const playerTwo = new player_1.Computer(this._context.UIManager.BoardSize, 'P2');
        this._players[0] = playerOne;
        this._players[1] = playerTwo;
        this._currentPlayer = playerOne;
    }
}
exports.GameManager = GameManager;
module.exports = { GameManager };
//# sourceMappingURL=gameManager.js.map