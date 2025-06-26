/**
 * Represents a small chicken enemy in the game.
 * Inherits from MovableObject and handles its movement, animation, and death state.
 */
class ChickenSmall extends MovableObject {
    y = 370;
    height = 40;
    width = 35;
    energy = 10;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * Initializes the x-position of the small chicken.
     * @param {number|null} x - The initial x-position, or null to generate randomly.
     * @private
     */
    _initializePosition(x) {
        if (x !== null) {
            this.x = x;
        } else {
            this.x = 720 + Math.random() * 500;
        }
    }

    /**
     * Creates an instance of ChickenSmall.
     * @param {number|null} [x=null] - The initial x-coordinate of the chicken. If null, a random position is generated.
     */
    constructor(x = null) {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this._initializePosition(x); // Calls the helper for position
        this.speed = 0.2 + Math.random() * 0.3;
        this.deadTime = 0; // Initialize deadTime property

        this.animate();
    }

    /**
     * Handles the movement logic for the small chicken.
     * Runs at 60 FPS.
     * @private
     */
    _animateMovement() {
        if (this.world && !this.world.isGameOver && !this.world.isGameWon && !this.isDead()) {
            this.moveLeft();
            this.otherDirection = false;
        } else if (this.isDead()) {
            // Play death animation if chicken is dead
            this.playAnimation(this.IMAGES_DEAD);
        }
    }

    /**
     * Handles the walking animation for the small chicken.
     * Runs at 25 ms interval.
     * @private
     */
    _animateWalking() {
        if (this.world && !this.world.isGameOver && !this.world.isGameWon && !this.isDead()) {
            // Only animate if the game is not over, not won, and chicken is not dead
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Starts the animation loops for movement and visual animation.
     */
    animate() {
        // Interval for movement logic (60 FPS)
        setInterval(() => this._animateMovement(), 1000 / 60);

        // Interval for walking animation (25 ms per frame)
        setInterval(() => this._animateWalking(), 25);
    }
}
