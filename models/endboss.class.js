class Endboss extends MovableObject {

    height = 400;
    width = 300;
    y = 50;
    energy = 100;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2500;
        this.animate();
    }

    /**
     * Handles the animation logic when the endboss is dead.
     * Plays the death animation sequence and clears the animation interval after the last frame.
     */
    _playDeathAnimation() {
        if (this.currentImage < this.IMAGES_DEAD.length) {
            let path = this.IMAGES_DEAD[this.currentImage];
            this.img = this.imageCache[path];
            this.currentImage++;
        } else {
            clearInterval(this.animationInterval);
            // Ensure the last death image remains displayed
            this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
        }
    }

    /**
     * Determines and plays the appropriate animation based on the endboss's state.
     * This method is called repeatedly by the animation interval.
     */
    _handleAnimationState() {
        // Only animate if the game is not over, not won, and the endboss is not dead
        if (this.world && !this.world.isGameOver && !this.world.isGameWon && !this.isDead()) {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (this.isDead()) {
            this._playDeathAnimation();
        }
    }

    /**
     * Starts the animation loop for the endboss.
     * The animation state is updated every 200 milliseconds.
     */
    animate() {
        this.animationInterval = setInterval(() => {
            this._handleAnimationState();
        }, 200);
    }

    /**
     * Reduces the endboss's energy by 20.
     * Ensures energy does not fall below 0.
     */
    hit() {
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        }
    }
}
