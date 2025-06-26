/**
 * Represents the Endboss enemy in the game.
 * Inherits from MovableObject and manages its animations, health, and death state,
 * including walking towards the character.
 */
class Endboss extends MovableObject {

    height = 400;
    width = 300;
    y = 50;
    energy = 100;
    attackDistance = 300; // Distance at which the boss might start attacking (or specific behavior)

    // New walking animation images for the boss chicken
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [ // Original 'walking' images are now 'alert'
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

    /**
     * Creates an instance of Endboss.
     * Loads images, sets initial position, and starts the animation.
     */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]); // Load an initial image
        this.loadImages(this.IMAGES_WALKING); // Load new walking images
        this.loadImages(this.IMAGES_ALERT); // Load alert images
        this.loadImages(this.IMAGES_DEAD);

        this.x = 2500; // Initial spawn position far to the right
        this.speed = 1 + Math.random() * 0.5; // Randomize speed
        this.animate();
    }

    /**
     * Handles the animation logic when the endboss is dead.
     * Plays the death animation sequence and clears the animation interval after the last frame.
     * @private
     */
    _playDeathAnimation() {
        if (this.currentImage < this.IMAGES_DEAD.length) {
            let path = this.IMAGES_DEAD[this.currentImage];
            this.img = this.imageCache[path];
            this.currentImage++;
        } else {
            clearInterval(this.animationInterval); // Stop all animations
            clearInterval(this.movementInterval); // Stop all movement
            this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]]; // Ensure the last death image remains displayed
        }
    }

    /**
     * Determines and plays the appropriate animation based on the endboss's state.
     * This method is called repeatedly by the animation interval.
     * @private
     */
    _handleAnimationState() {
        if (this.isDead()) {
            this._playDeathAnimation();
        } else if (this.world && !this.world.isGameOver && !this.world.isGameWon && !this.world.gamePaused) {
            // Check if character exists before accessing its properties
            if (!this.world.character) {
                return; // Do not animate if character is not defined
            }

            // Logic for walking towards character
            let distanceToCharacter = this.world.character.x - this.x;

            if (Math.abs(distanceToCharacter) > 50) { // If character is far enough, walk
                this.playAnimation(this.IMAGES_WALKING);
            } else { // If character is close, show alert (or other idle/attack animation)
                this.playAnimation(this.IMAGES_ALERT);
            }
        }
    }

    /**
     * Handles the movement logic for the endboss.
     * The endboss moves towards the character if not dead, game not over, and not paused.
     * Sets `otherDirection` to control the image flip based on movement.
     * Based on previous observations, `otherDirection = false` results in facing right,
     * and `otherDirection = true` results in facing left.
     * To achieve:
     * - Move Left -> Face Left (requires `otherDirection = true`)
     * - Move Right -> Face Right (requires `otherDirection = false`)
     * @private
     */
    _handleMovementLogic() {
        // Ensure world and character are defined before proceeding with movement logic
        if (this.isDead() || !this.world || !this.world.character || this.world.isGameOver || this.world.isGameWon || this.world.gamePaused) {
            return; // Do not move if dead, world/character not defined, game over, game won, or paused
        }

        let distanceToCharacter = this.world.character.x - this.x;
        console.log('Endboss: distanceToCharacter:', distanceToCharacter);

        if (distanceToCharacter < 0) { // Character is to the left, move left
            // To face LEFT (desired), given that 'otherDirection = true' makes it face left
            this.otherDirection = true;
            console.log('Endboss: Moving left, setting otherDirection to TRUE (should face left)');
            this.moveLeft();
        } else if (distanceToCharacter > 0) { // Character is to the right, move right
            // To face RIGHT (desired), given that 'otherDirection = false' makes it face right
            this.otherDirection = false;
            console.log('Endboss: Moving right, setting otherDirection to FALSE (should face right)');
            this.moveRight();
        }
    }

    /**
     * Starts the animation and movement loops for the endboss.
     * The animation state is updated every 200 milliseconds.
     * The movement logic is updated at a higher frequency.
     */
    animate() {
        // Animation interval
        this.animationInterval = setInterval(() => {
            this._handleAnimationState();
        }, 200);

        // Movement interval
        this.movementInterval = setInterval(() => {
            this._handleMovementLogic();
        }, 1000 / 60); // Roughly 60 FPS for smoother movement
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
