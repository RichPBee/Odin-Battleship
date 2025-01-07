const {Ship} = require('./ship');

const testShip = new Ship(3);
test("Increments the ship's hit counter", () => { 
    const numHits = testShip.NumHits;
    testShip.hit();
    expect(testShip.NumHits).toBe(numHits + 1);
})

test("Should not initially be sunk", () => { 
    expect(testShip.isSunk()).toBe(false);
})

test("Ship should report being sunk", () => { 
    for (let i = 0; i < testShip.Length; i++)
    {
        testShip.hit();
    }
    expect(testShip.isSunk()).toBe(true);
})