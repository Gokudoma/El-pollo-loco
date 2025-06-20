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

    constructor(x = null){
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD); 

        if (x !== null) {
            this.x = x;
        } else {
            this.x = 720 + Math.random() * 500; 
        }
        this.speed = 0.2 + Math.random() * 0.3;

        this.animate();
    }

    animate(){
        setInterval(() => {
            if (this.world && !this.world.isGameOver && !this.world.isGameWon && !this.isDead()) { 
                this.moveLeft();
                this.otherDirection = false;
            } else if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD); 
            }
        }, 1000 / 60);
        
        setInterval(() => {
            if (this.world && !this.world.isGameOver && !this.world.isGameWon && !this.isDead()) { 
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 25);
    }  
}
