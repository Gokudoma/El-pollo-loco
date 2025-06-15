const level3Endboss = new Endboss();
const level3Coins = [
    new Coin(2500, 100),
    new Coin(2600, 150),
    new Coin(2700, 100),
    new Coin(2800, 150),
    new Coin(2900, 100),
    new Coin(3000, 150),
    new Coin(3100, 100),
    new Coin(3200, 150),
];
const level3Bottles = [
    new Bottle(2650, 360),
    new Bottle(2850, 360),
    new Bottle(3050, 360),
];

const level3 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        level3Endboss,
    ],
    [
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
    ],
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
        new BackgroundObject('img/5_background/layers/air.png', 719*2),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*2),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*2),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*2),
        new BackgroundObject('img/5_background/layers/air.png', 719*3),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*3),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*3),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*3),
        new BackgroundObject('img/5_background/layers/air.png', 719*4),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*4),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*4),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*4),
    ],
    level3Bottles,
    level3Coins,
    level3Endboss,
    3500 
);
