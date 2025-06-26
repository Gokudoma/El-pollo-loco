/**
 * Represents a bottle object in the game, collectible by the character.
 * Inherits from DrawableObject.
 */
class Bottle extends DrawableObject {
    /**
     * Creates an instance of Bottle.
     * @param {number} x - The x-coordinate of the bottle.
     */
    constructor(x) {
        super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = x;
        this.y = 360;
        this.height = 70;
        this.width = 60;
    }
}
