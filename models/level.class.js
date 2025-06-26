/**
 * Represents a game level, containing all its elements like enemies, clouds,
 * background objects, collectibles, and the endboss, along with the level's end position.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    bottles;
    coins;
    level_end_x;
    endboss;
    initialCoinCount;

    /**
     * Creates an instance of Level.
     * @param {MovableObject[]} enemies - An array of enemy objects for this level.
     * @param {MovableObject[]} clouds - An array of cloud objects for this level.
     * @param {BackgroundObject[]} backgroundObjects - An array of background objects for this level.
     * @param {Bottle[]} bottles - An array of collectible bottle objects for this level.
     * @param {Coin[]} coins - An array of collectible coin objects for this level.
     * @param {Endboss} endboss - The endboss object for this level.
     * @param {number} level_end_x - The x-coordinate that marks the end of the level.
     */
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
