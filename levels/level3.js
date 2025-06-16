const level3Endboss = new Endboss();
const level3Coins = [
    new Coin(400, 100),
    new Coin(700, 150),
    new Coin(800, 100),
    new Coin(950, 150),
    new Coin(1100, 100),
    new Coin(1500, 150),
    new Coin(1650, 100),
    new Coin(2000, 150),
];
const level3Bottles = [
    new Bottle(1000, 360),
    new Bottle(1300, 360),
    new Bottle(1600, 360),
    new Bottle(1900, 360),
    new Bottle(2200, 360)
];

const level3 = new Level(
    [
        new Chicken(2500, 360),
        new Chicken(2700, 360),
        new Chicken(2900, 360),
        new Chicken(3200, 360),
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
