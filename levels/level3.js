const level3Endboss = new Endboss(); // Defines the Endboss for level 3
const level3Coins = [
    new Coin(1400, 220),
    new Coin(1600, 180),
    new Coin(1800, 260),
    new Coin(2000, 120),
    new Coin(2100, 200),
    new Coin(2200, 240),
];
const level3Bottles = [
    new Bottle(1300, 360),
    new Bottle(1600, 360),
    new Bottle(1700, 360),
    new Bottle(1800, 360),
    new Bottle(1900, 360),
];

/**
 * Defines the entire structure of Level 3 of the game.
 * It includes all enemies, clouds, background objects, bottles, coins,
 * the end boss, and the x-coordinate where the level ends.
 *
 * @type {Level}
 */
const level3 = new Level(
    // Enemies for Level 3
    [
        new Chicken(1600), // Chicken at a specific x-position
        new Chicken(1500),
        new Chicken(1300),
        new ChickenSmall(1800), // Small Chicken at a specific x-position
        new ChickenSmall(1700),
        level3Endboss, // Includes the defined end boss
    ],
    // Clouds for Level 3
    [
        new Cloud(),
        new Cloud(),
        new Cloud(),
    ],
    // Background objects for Level 3, covering multiple segments
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
    level3Bottles, // Uses the previously defined bottle array
    level3Coins,    // Uses the previously defined coin array
    level3Endboss,  // Uses the previously defined end boss object
    2200            // The x-coordinate where this level ends
);
