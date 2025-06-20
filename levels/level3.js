const level3Endboss = new Endboss(); 
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

const level3 = new Level(
    [
        new Chicken(1600, 360),
        new Chicken(1500, 360),
        new Chicken(1300, 360),
        new ChickenSmall(1800, 370),
        level3Endboss,
    ],
    [
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
    ],
    level3Bottles,
    level3Coins,
    level3Endboss,
    2200 
);
