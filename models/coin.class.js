/**
 * Represents a coin object in the game, collectible by the character.
 * Inherits from DrawableObject.
 */
class Coin extends DrawableObject {
    /**
     * Creates an instance of Coin.
     * @param {number} x - The x-coordinate of the coin.
     * @param {number} y - The y-coordinate of the coin.
     */
    constructor(x, y) {
        super().loadImage('img/8_coin/coin_1.png');
        this.x = x;
        this.y = y;
        this.height = 100;
        this.width = 100;
    }
}
