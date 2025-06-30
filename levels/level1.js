/**
 * Initializes and returns the data for Level 1.
 * @returns {Level} A new Level object.
 */
function initLevel1() {
    const level1Endboss = new Endboss();

    return new Level(
        // Enemies
        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new ChickenSmall(),
            level1Endboss,
        ],
        // Clouds
        [
            new Cloud(),
            new Cloud(),
            new Cloud(),
        ],
        // Background objects
        [
            new BackgroundObject('img/5_background/layers/air.png', -719),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', -719),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', -719),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', -719),
            new BackgroundObject('img/5_background/layers/air.png', 0),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 0),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 0),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 0),
            new BackgroundObject('img/5_background/layers/air.png', 719),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719),
            new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 3),
        ],
        // Bottles
        [
            new Bottle(400, 360),
            new Bottle(600, 360),
            new Bottle(800, 360),
            new Bottle(1000, 360),
            new Bottle(1200, 360),
        ],
        // Coins
        [
            new Coin(300, 200),
            new Coin(500, 150),
            new Coin(700, 250),
            new Coin(900, 100),
            new Coin(1100, 200),
            new Coin(1300, 200),
            new Coin(1500, 150),
        ],
        level1Endboss,
        2200
    );
}