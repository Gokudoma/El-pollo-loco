class ThrowableObject extends MovableObject {

    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    isSplashing = false;
    splashAnimationFinished = false;
    throwInterval = null;
    splashInterval = null;
    gravityInterval = null; // Defined here, but initialized in MovableObject

    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 80;
        this.throw();
    }

    /**
     * Handles the movement and rotation animation of the bottle during throwing.
     */
    _animateThrowing() {
        if (!this.isSplashing) {
            this.x += 10;
            this.playAnimation(this.IMAGES_ROTATION, 2);
        }
    }

    /**
     * Initiates the throwing action of the bottle, applying initial speed and gravity,
     * and starting the throwing animation.
     */
    throw() {
        this.speedY = 30;
        this.applyGravity(); // Inherited from MovableObject

        this.throwInterval = setInterval(() => {
            this._animateThrowing();
        }, 25);
    }

    /**
     * Handles the single frame update for the splash animation.
     */
    _updateSplashFrame() {
        if (this.currentImage < this.IMAGES_SPLASH.length) {
            let path = this.IMAGES_SPLASH[this.currentImage];
            this.img = this.imageCache[path];
            this.currentImage++;
        } else {
            clearInterval(this.splashInterval);
            this.splashAnimationFinished = true;
        }
    }

    /**
     * Initiates the splash animation when the bottle hits something.
     * Clears the throwing animation interval.
     */
    splash() {
        this.isSplashing = true;
        clearInterval(this.throwInterval); // Stop bottle rotation

        this.currentImage = 0; // Reset image index for splash animation
        this.splashInterval = setInterval(() => {
            this._updateSplashFrame();
        }, 80);
    }
}
