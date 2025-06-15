class Level {
    enemies;
    clouds;
    backgroundObjects;
    bottles;
    coins;
    level_end_x;
    endboss;
    initialCoinCount;

    constructor(enemies, clouds, backgroundObjects, bottles, coins, endboss, level_end_x) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
        this.coins = coins;
        this.endboss = endboss;
        this.initialCoinCount = coins.length;
        this.level_end_x = level_end_x;
    }
}
