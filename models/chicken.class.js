class Chicken extends MovableObject {
    y = 360;
    height = 60;
    width = 50;
    energy = 20;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    /**
     * Initializes the x-position of the chicken.
     * @param {number|null} x - The initial x-position, or null to generate randomly.
     */
    _initializePosition(x) {
        if (x !== null) {
            this.x = x;
        } else {
            this.x = 720 + Math.random() * 500;
        }
    }

    constructor(x = null) {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this._initializePosition(x); // Hilfsfunktion für die Positionsinitialisierung
        this.speed = 0.15 + Math.random() * 0.4;

        this.animate();
    }

    /**
     * Handles the movement logic for the chicken.
     * Runs at 60 FPS.
     */
    _animateMovement() {
        // Bewegt sich nur, wenn das Spiel nicht vorbei ist, nicht gewonnen wurde und das Huhn nicht tot ist
        if (this.world && !this.world.isGameOver && !this.world.isGameWon && !this.isDead()) {
            this.moveLeft();
            this.otherDirection = false;
        } else if (this.isDead()) {
            // Spielt die Todesanimation, wenn das Huhn tot ist
            this.playAnimation(this.IMAGES_DEAD);
        }
    }

    /**
     * Handles the walking animation for the chicken.
     * Runs at 25 ms interval.
     */
    _animateWalking() {
        // Animiert nur, wenn das Spiel nicht vorbei ist, nicht gewonnen wurde und das Huhn nicht tot ist
        if (this.world && !this.world.isGameOver && !this.world.isGameWon && !this.isDead()) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Starts the animation loops for movement and visual animation.
     */
    animate() {
        // Interval für die Bewegungslogik (60 FPS)
        setInterval(() => this._animateMovement(), 1000 / 60);

        // Interval für die Laufanimation (25 ms pro Frame)
        setInterval(() => this._animateWalking(), 25);
    }
}
