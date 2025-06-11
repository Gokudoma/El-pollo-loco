class Cloud extends MovableObject {
    y = 10;
    width = 500;
    height = 350;
    speed = 0.15;

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        this.x = Math.random() *500;
        this.animate();
    }


    animate() {
        this.moveLeft();
    }


    moveLeft(){
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

}