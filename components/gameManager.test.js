const {Player, Computer} = require('./player');
const {GameManager} = require('./gameManager');

const boardSize = 10;
it("Can switch player properly", () => { 
    const playerOne = new Player(boardSize);
    const playerTwo = new Computer(boardSize);
    const manager = new GameManager(playerOne, playerTwo);
    expect(manager.CurrentPlayer).toEqual(playerOne);
    manager.switchPlayer();
    expect(manager.CurrentPlayer).toEqual(playerTwo);
    manager.switchPlayer();
    expect(manager.CurrentPlayer).toEqual(playerOne);
})

it('Can setup boards automatically', () => { 
    const playerOne = new Player(boardSize);
    const playerTwo = new Player(boardSize);
    const manager = new GameManager(playerOne, playerTwo);
    manager.startPlaying();
    expect(playerOne.Gameboard.NumShips).toBe(5);
    expect(playerTwo.Gameboard.NumShips).toBe(5);
})