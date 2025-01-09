const {Player, Computer} = require('./player');
const {GameManager} = require('./gameManager');

const boardSize = 10;
const playerOne = new Player(boardSize);
const playerTwo = new Computer(boardSize);
const manager = new GameManager(playerOne, playerTwo);
it("Can switch player properly", () => { 
    expect(manager.CurrentPlayer).toEqual(playerOne);
    manager.switchPlayer();
    expect(manager.CurrentPlayer).toEqual(playerTwo);
    manager.switchPlayer();
    expect(manager.CurrentPlayer).toEqual(playerOne);
})