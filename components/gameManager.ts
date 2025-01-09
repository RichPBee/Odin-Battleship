import { Player } from "./player";

enum Players
{
    One,
    Two
}

export class GameManager
{
    private _activeIndex: Players;
    private _currentPlayer: Player;
    get CurrentPlayer() { return this._currentPlayer; }
    private _players: [Player, Player];

    constructor(playerOne: Player, playerTwo: Player)
    {
        this._players = [playerOne, playerTwo];
        this._currentPlayer = playerOne;
        this._activeIndex = Players.One;
    }

    public switchPlayer()
    {
        const playerIndex = Number(this._activeIndex) ? Players.One : Players.Two;
        this._currentPlayer =  this._players[playerIndex];
    }
}

module.exports = {GameManager};