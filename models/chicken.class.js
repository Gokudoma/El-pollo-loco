class Chicken extends MovableObject {
    y = 360;
    height = 60;
    width = 50;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    constructor(){
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);

        this.x = 200 + Math.random() * 500;
            this.speed = 0.15 + Math.random() * 0.4;

        this.animate();
    }


    animate(){
        setInterval(() => {
            this.moveLeft();
            this.otherDirection = false;
        }, 1000 / 60);
        

        setInterval(() => {
        this.playAnimation(this.IMAGES_WALKING);
        }, 25);
    }  


}