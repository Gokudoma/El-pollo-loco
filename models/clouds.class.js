/**
 * Represents a cloud object in the game, moving across the sky.
 * Inherits from MovableObject.
 */
class Cloud extends MovableObject {
    y = 10;
    width = 500;
    height = 350;
    speed = 0.15;

    /**
     * Creates an instance of Cloud.
     * Loads the cloud image and initializes its random x-position.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500;
        this.animate();
    }

    /**
     * Initiates the continuous movement of the cloud to the left.
     * This function is intended to be called by a repeating interval
     * or animation loop to ensure constant movement.
     */
    animate() {
        this.moveLeft();
    }
}
