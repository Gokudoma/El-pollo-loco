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
    ]

    world;
    hitSound = new Audio('audio/hit.mp3');
    deathSound = new Audio('audio/death.mp3');
    deathSoundPlayed = false;

    constructor(){
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.applyGravity();
    }

    animate(){
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                if (!this.deathSoundPlayed) {
                    this.deathSound.play();
                    this.deathSoundPlayed = true;
                }
            } else {
                if (this.world && this.world.keyboard) {
                    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                        this.moveRight();
                    }
                    if (this.world.keyboard.LEFT && this.x > 0 ) {
                        this.moveLeft();
                    }

                    if(this.world.keyboard.UP && !this.isAboveGround()) {
                        this.jump();
                    }

                    this.world.camera_x = -this.x +100;
                }

                if(this.isHurt()){
                    this.playAnimation(this.IMAGES_HURT, 10); 
                } else if(this.isAboveGround() || this.speedY > 0) {
                    this.playAnimation(this.IMAGES_JUMPING, 3);
                } else if (!this.isAboveGround() && !(this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
                    this.playAnimation(this.IMAGES_IDLE, 5);
                } else if (!this.isAboveGround() && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
                    this.playAnimation(this.IMAGES_WALKING, 1);
                }
            }
        }, 1000 / 60);
    }

    jump() {
        this.speedY = 30;
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
            this.hitSound.play();
        }
    }

    reset() {
        this.x = 20;
        this.y = 175;
        this.energy = 100;
        this.bottles = 0;
        this.coins = 0;
        this.lastHit = 0;
        this.speedY = 0;
        this.img = this.imageCache[this.IMAGES_WALKING[0]];
        this.deathSoundPlayed = false;
    }
}
