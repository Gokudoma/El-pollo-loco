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

    constructor(){
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD); 
        this.x = 2500;
        this.animate();
    }

    animate(){
        this.animationInterval = setInterval(() => {
            if (this.world && !this.world.isGameOver && !this.world.isGameWon && !this.isDead()) {
                this.playAnimation(this.IMAGES_WALKING);
            } else if (this.isDead()) {
                if (this.currentImage < this.IMAGES_DEAD.length) {
                    let path = this.IMAGES_DEAD[this.currentImage];
                    this.img = this.imageCache[path];
                    this.currentImage++;
                } else {
                    clearInterval(this.animationInterval);
                    this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
                }
            }
        }, 200);
    }

    hit() {
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        }
    }
}
