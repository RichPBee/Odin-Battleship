const {Ship} = require('./ship');
const {Gameboard} = require('./gameboard');

const shipLength1 = new Ship(1);
const shipLength2 = new Ship(2);
const shipLength3 = new Ship(3);
const shipLength3_2 = new Ship(3)
const position = {x: 0, y: 0};
const edgePosition = {x: 9, y: 9};

it("Places a ship at a given co-ordinate", () => { 
    const gameboard = new Gameboard();
    gameboard.placeShip(shipLength1, position);
    expect(gameboard.receiveAttack(position)).toBeTruthy();
})

it("Able to place ship at [0, 0] position", () => { 
    const gameboard = new Gameboard();
    expect(gameboard.placeShip(shipLength1, position)).toBeTruthy();
})

it("Able to place ship of length 1 at [9, 9] position on default board.", () => { 
    const gameboard = new Gameboard();
    expect(gameboard.placeShip(shipLength1, edgePosition)).toBeTruthy();
})

it("Unable to place ship of length > 1 at [9, 9] position on default board", () => { 
    const gameboard = new Gameboard();
    expect(gameboard.placeShip(shipLength2, edgePosition)).toBeFalsy();
})

it("Able to succesfully attack a ship on the board", () => { 
    const gameboard = new Gameboard();
    gameboard.placeShip(shipLength1, position);
    gameboard.receiveAttack(position);
    expect(shipLength1.isSunk()).toBeTruthy();
})

it("Able to hit ships with multiple points", () => {
    const gameBoard = new Gameboard();
    gameBoard.placeShip(shipLength3, position);
    for (let i = 0; i < 3; i++)
    {
        const hit = gameBoard.receiveAttack({x: i, y: 0});
        expect(hit).toBeTruthy();
    }
})

it("Able to keep track of missed attacks", () => {
    const gameboard = new Gameboard(); 
    gameboard.receiveAttack(position);
    expect(gameboard.isPositionHit(position, true)).toBeTruthy();
})

it("Able to report when all ships are sunk", () => { 
    const gameboard = new Gameboard();
    gameboard.placeShip(shipLength1, position);
    gameboard.receiveAttack(position);
    expect(gameboard.AllSunk).toBeTruthy();
})

it("Cannot place overlapping ships", () => { 
    const gameboard = new Gameboard();
    const pos1 = {x: 0, y: 1};
    const pos2 = {x: 1, y: 0};
    gameboard.placeShip(shipLength3_2, pos2, false);
    gameboard.placeShip(shipLength3, pos1);
    expect(gameboard.NumShips).toBe(1);
})