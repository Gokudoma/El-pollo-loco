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
    gravityInterval = null;

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

    throw() {
        this.speedY = 30;
        this.applyGravity();

        this.throwInterval = setInterval(() => {
            if (!this.isSplashing) {
                this.x += 10;
                this.playAnimation(this.IMAGES_ROTATION, 2);
            }
        }, 25);
    }

    splash() {
        console.log('Bottle is splashing!');
        this.isSplashing = true;
        clearInterval(this.throwInterval);
        
        this.currentImage = 0;
        this.splashInterval = setInterval(() => {
            if (this.currentImage < this.IMAGES_SPLASH.length) {
                let path = this.IMAGES_SPLASH[this.currentImage];
                this.img = this.imageCache[path];
                this.currentImage++;
            } else {
                clearInterval(this.splashInterval);
                this.splashAnimationFinished = true;
            }
        }, 80);
    }
}
