class Cloud extends MovableObject {
    y = 10;
    width = 500;
    height = 350;
    speed = 0.15;

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        // Initializes the x-position of the cloud randomly.
        this.x = Math.random() * 500;
        this.animate();
    }

    /**
     * Initiates the continuous movement of the cloud to the left.
     * This function is intended to be called by a repeating interval
     * or animation loop to ensure constant movement.
     */
    animate() {
        // Moves the cloud to the left by its speed.
        this.moveLeft();
    }
}
