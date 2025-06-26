/**
 * Represents the main character (Pepe) in the game.
 * Inherits from MovableObject and manages its animations, movements, and interactions.
 */
class Character extends MovableObject {
    height = 250;
    width = 150;
    y = 175;
    x = 20;
    speed = 5;
    energy = 100;
    lastHit = 0;
    bottles = 0;
    coins = 0;
    lastMoveTime = 0;
    isThrowing = false;

    offset = {
        top: 120,
        bottom: 30,
        left: 40,
        right: 30
    }

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_SLEEP = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    world;
    hitSound = new Audio('audio/hit.mp3');
    deathSound = new Audio('audio/death.mp3');
    deathSoundPlayed = false;
    jumpSound = new Audio('audio/jump.mp3');
    stepsSound = new Audio('audio/steps.mp3');
    stepsSoundPlaying = false;
    snoringSound = new Audio('audio/snoring.mp3');
    snoringSoundPlaying = false;

    /**
     * Creates an instance of Character.
     * Loads images, applies gravity, sets up initial sound loops and animation.
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SLEEP);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.applyGravity();
        this.stepsSound.loop = true;
        this.snoringSound.loop = true;
        this.lastMoveTime = new Date().getTime();
        this.animate();
    }

    /**
     * Handles character movement based on keyboard input and updates walking sound.
     * @private
     */
    _handleCharacterMovementAndSound() {
        if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround() && !this.isThrowing) {
            this.startWalkingSound();
        } else {
            this.stopWalkingSound();
        }

        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
        } else if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
        }

        if (this.world.keyboard.UP && !this.isAboveGround()) {
            this.jump();
        }
    }

    /**
     * Updates the last movement time if the character is actively moving or throwing.
     * @private
     */
    _updateLastMoveTimestamp() {
        const isActuallyMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP;
        if (isActuallyMoving || this.isThrowing) {
            this.lastMoveTime = new Date().getTime();
        }
    }

    /**
     * Applies movement logic and updates camera position.
     * This function runs at 60 FPS.
     * @private
     */
    _applyMovementLogic() {
        if (this.world && !this.world.gamePaused) {
            this._handleCharacterMovementAndSound();
            this.world.camera_x = -this.x + 100;
            this._updateLastMoveTimestamp();
        }
    }

    /**
     * Handles the animation and sound for character death.
     * @private
     */
    _handleDeathAnimation() {
        this.playAnimation(this.IMAGES_DEAD);
        if (!this.deathSoundPlayed && !isMutedGlobally) {
            this.deathSound.play();
            this.deathSoundPlayed = true;
        }
        this.stopWalkingSound();
        this.stopSnoringSound();
    }

    /**
     * Plays the hurt animation and stops other sounds.
     * @private
     */
    _playHurtAnimation() {
        this.playAnimation(this.IMAGES_HURT, 10);
        this.stopWalkingSound();
        this.stopSnoringSound();
    }

    /**
     * Plays the jumping animation and stops other sounds.
     * @private
     */
    _playJumpAnimation() {
        this.playAnimation(this.IMAGES_JUMPING, 3);
        this.stopWalkingSound();
        this.stopSnoringSound();
    }

    /**
     * Plays the throwing animation and stops other sounds.
     * @private
     */
    _playThrowingAnimation() {
        // Assuming IMAGES_THROWING is defined somewhere or this method is not called for character
        // If IMAGES_THROWING is not defined, this will cause an error.
        // For now, using IMAGES_IDLE as a placeholder or remove if this animation isn't needed.
        this.playAnimation(this.IMAGES_IDLE, 2); // Placeholder, adjust if specific throwing animation exists
        this.stopWalkingSound();
        this.stopSnoringSound();
    }

    /**
     * Plays the walking animation and stops snoring sound if conditions are met.
     * @param {boolean} onGround - True if character is on the ground.
     * @param {boolean} isNotHurt - True if character is not hurt.
     * @returns {boolean} True if walking animation was played, false otherwise.
     * @private
     */
    _playWalkingAnimation(onGround, isNotHurt) {
        if (onGround && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && isNotHurt) {
            this.playAnimation(this.IMAGES_WALKING, 1);
            this.stopSnoringSound();
            return true;
        }
        return false;
    }

    /**
     * Plays the sleeping animation and starts snoring sound if conditions are met.
     * @param {boolean} onGround - True if character is on the ground.
     * @param {boolean} isNotHurt - True if character is not hurt.
     * @returns {boolean} True if sleeping animation was played, false otherwise.
     * @private
     */
    _playSleepAnimation(onGround, isNotHurt) {
        if (onGround && !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && isNotHurt && (new Date().getTime() - this.lastMoveTime > 8000)) {
            this.playAnimation(this.IMAGES_SLEEP, 5);
            this.startSnoringSound();
            this.stopWalkingSound();
            return true;
        }
        return false;
    }

    /**
     * Plays the idle animation and stops other sounds if conditions are met.
     * @param {boolean} onGround - True if character is on the ground.
     * @param {boolean} isNotHurt - True if character is not hurt.
     * @returns {boolean} True if idle animation was played, false otherwise.
     * @private
     */
    _playIdleAnimation(onGround, isNotHurt) {
        if (onGround && isNotHurt) {
            this.playAnimation(this.IMAGES_IDLE, 5);
            this.stopWalkingSound();
            this.stopSnoringSound();
            return true;
        }
        return false;
    }

    /**
     * Applies animation logic based on character's state.
     * This function runs at 80 ms interval.
     * @private
     */
    _applyAnimationLogic() {
        if (this.isDead()) {
            this._handleDeathAnimation();
        } else if (this.world && this.world.keyboard && !this.world.gamePaused) {
            const onGround = !this.isAboveGround();
            const isNotHurt = !this.isHurt();

            if (this.isHurt()) return this._playHurtAnimation();
            if (this.isAboveGround() || this.speedY > 0) return this._playJumpAnimation();
            if (this.isThrowing) return this._playThrowingAnimation();
            if (this._playWalkingAnimation(onGround, isNotHurt)) return;
            if (this._playSleepAnimation(onGround, isNotHurt)) return;
            this._playIdleAnimation(onGround, isNotHurt);
        }
    }

    /**
     * Starts the animation loops for movement and state.
     */
    animate() {
        setInterval(() => this._applyMovementLogic(), 1000 / 60);
        setInterval(() => this._applyAnimationLogic(), 80);
    }

    /**
     * Makes the character jump.
     */
    jump() {
        if (!this.isAboveGround()) {
            this.speedY = 30;
            if (!isMutedGlobally) {
                this.jumpSound.currentTime = 0;
                this.jumpSound.play();
            }
        }
    }

    /**
     * Reduces character energy and plays hit sound.
     * Damage amount is 15.
     */
    hit() {
        this.energy -= 15; // Damage changed to 15
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
            if (!isMutedGlobally) {
                this.hitSound.play();
            }
        }
    }

    /**
     * Starts the walking sound if not already playing and not muted.
     */
    startWalkingSound() {
        if (!this.stepsSoundPlaying && !isMutedGlobally) {
            this.stepsSound.play();
            this.stepsSoundPlaying = true;
        }
    }

    /**
     * Stops the walking sound and resets its playback.
     */
    stopWalkingSound() {
        if (this.stepsSoundPlaying) {
            this.stepsSound.pause();
            this.stepsSound.currentTime = 0;
            this.stepsSoundPlaying = false;
        }
    }

    /**
     * Starts the snoring sound if not already playing and not muted.
     */
    startSnoringSound() {
        if (!this.snoringSoundPlaying && !isMutedGlobally) {
            this.snoringSound.play();
            this.snoringSoundPlaying = true;
        }
    }

    /**
     * Stops the snoring sound and resets its playback.
     */
    stopSnoringSound() {
        if (this.snoringSoundPlaying) {
            this.snoringSound.pause();
            this.snoringSound.currentTime = 0;
            this.snoringSoundPlaying = false;
        }
    }

    /**
     * Resets the character's position, energy, items, and sound states.
     */
    reset() {
        this.x = 20;
        this.y = 175;
        this.energy = 100;
        this.bottles = 0;
        this.coins = 0;
        this.lastHit = 0;
        this.speedY = 0;
        this.currentImage = 0;
        this.img = this.imageCache[this.IMAGES_IDLE[0]];
        this.deathSoundPlayed = false;
        this.stopWalkingSound();
        this.stopSnoringSound();
        this.lastMoveTime = new Date().getTime();
        this.isThrowing = false;
    }
}
