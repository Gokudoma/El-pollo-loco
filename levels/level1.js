// Defines the Endboss for level 1
const level1Endboss = new Endboss();

// Defines the initial coins for level 1 with their positions
const level1Coins = [
    new Coin(300, 200),
    new Coin(500, 150),
    new Coin(700, 250),
    new Coin(900, 100),
    new Coin(1100, 200),
    new Coin(1300, 200),
    new Coin(1500, 150),
];

// Defines the initial bottles for level 1 with their positions
const level1Bottles = [
    new Bottle(400, 360),
    new Bottle(600, 360),
    new Bottle(800, 360),
    new Bottle(1000, 360),
    new Bottle(1200, 360),
];

/**
 * Defines the entire structure of Level 1 of the game.
 * It includes all enemies, clouds, background objects, bottles, coins,
 * the end boss, and the x-coordinate where the level ends.
 *
 * @type {Level}
 */
const level1 = new Level(
    // Enemies for Level 1
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new ChickenSmall(),
        level1Endboss, // Includes the defined end boss
    ],
    // Clouds for Level 1
    [
        new Cloud(),
        new Cloud(),
        new Cloud(),
    ],
    // Background objects for Level 1, covering multiple segments
    [
        // First segment (-719 to -1)
        new BackgroundObject('img/5_background/layers/air.png', -719),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', -719),
        // Second segment (0 to 718)
        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 0),
        // Third segment (719 to 1437)
        new BackgroundObject('img/5_background/layers/air.png', 719),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719),
        // Fourth segment (1438 to 2156)
        new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 2),
        // Fifth segment (2157 to 2875)
        new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 3),
    ],
    level1Bottles, // Uses the previously defined bottle array
    level1Coins,    // Uses the previously defined coin array
    level1Endboss,  // Uses the previously defined end boss object
    2200            // The x-coordinate where this level ends
);
