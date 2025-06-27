/**
 * Represents the game world, managing all game elements, logic, and rendering.
 * Acts as the central orchestrator for game components.
 */
class World {
    character = new Character();
    level;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    // Status bars
    statusBar = new StatusBar();
    statusBarBottles = new StatusBarBottles();
    statusBarCoins = new StatusBarCoins();
    endbossHealthBar = new StatusBarEndboss();

    throwableObjects = [];
    isGameOver = false;
    currentLevelIndex = 0;
    isGameWon = false;
    lastBottleThrow = 0;
    bottleCooldown = 1000;
    gamePaused = false;
    levelDisplayElement; // Reference to the HTML element displaying the current level

    // Manager instances
    collisionManager;
    audioManager;
    renderer;
    gameFlowManager;

    /**
     * Creates an instance of World.
     * Initializes the game world, sets up canvas, keyboard, and manager classes.
     * @param {HTMLCanvasElement} canvas - The HTML canvas element for rendering.
     * @param {Keyboard} keyboard - The keyboard input handler instance.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = allLevels[this.currentLevelIndex];
        this.levelDisplayElement = document.getElementById('levelDisplay');

        // Initialize manager classes, passing 'this' (the World instance)
        this.collisionManager = new CollisionManager(this);
        this.audioManager = new WorldAudioManager(this);
        this.renderer = new WorldRenderer(this);
        this.gameFlowManager = new GameFlowManager(this);

        this._initializeGameComponents();
    }

    /**
     * Initializes various game components after constructor setup.
     * @private
     */
    _initializeGameComponents() {
        this.renderer.draw(); // Start drawing loop
        this.setWorld(); // Set world reference for objects
        this.run(); // Start game logic loops
        this.character.animate(); // Start character animations
        updatePausePlayButton(); // Update UI
        this._updateLevelDisplay(); // Update level display
    }

    /**
     * Assigns the world reference to the character and all enemies in the current level.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof MovableObject) {
                enemy.setWorld(this);
            }
        });
        if (this.level.endboss) {
            this.level.endboss.setWorld(this);
        }
    }

    /**
     * Starts the main game loops for logic updates and cleanup.
     */
    run() {
        setInterval(() => this._updateGameLogic(), 1000 / 60);
        setInterval(() => this._performCleanup(), 100);
    }

    /**
     * Updates core game logic: collisions, object throwing, level progression, and proximity sounds.
     * @private
     */
    _updateGameLogic() {
        if (!this.isGameOver && !this.isGameWon && !this.gamePaused) {
            this.collisionManager.checkAllCollisions();
            this.checkThrowObjects();
            this.gameFlowManager.checkLevelCompletion(); // Call game flow manager
            this.audioManager._checkChickenSoundProximity(); // Call audio manager
        }
    }

    /**
     * Performs cleanup of dead entities and splashed objects.
     * @private
     */
    _performCleanup() {
        if (!this.isGameOver && !this.isGameWon && !this.gamePaused) {
            this.cleanupDeadEnemies();
            this.cleanupSplashedBottles();
        }
    }

    /**
     * Handles the logic for character throwing bottles.
     */
    checkThrowObjects() {
        let timePassed = new Date().getTime() - this.lastBottleThrow;
        const canThrow = this.keyboard.SPACE && this.character.bottles > 0 &&
                                     !this.character.isDead() && !this.isGameWon && timePassed > this.bottleCooldown;

        if (canThrow) {
            this._createAndThrowBottle();
            this.lastBottleThrow = new Date().getTime();
        }
    }

    /**
     * Creates and adds a new throwable bottle to the game world.
     * @private
     */
    _createAndThrowBottle() {
        // Pass character's current x, y, and otherDirection to the new bottle
        let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100, this.character.otherDirection);
        bottle.setWorld(this);
        this.throwableObjects.push(bottle);
        this.character.bottles--;
        this.statusBarBottles.setPercentage(this.character.bottles * 20);
    }

    /**
     * Updates the endboss health bar if the hit enemy is the Endboss.
     * @param {MovableObject} enemy - The enemy object that was hit.
     */
    _updateEndbossHealth(enemy) {
        if (enemy instanceof Endboss) {
            this.endbossHealthBar.setPercentage(enemy.energy);
        }
    }

    /**
     * Removes dead enemies from the level's enemy array after a delay for death animation.
     */
    cleanupDeadEnemies() {
        const currentTime = new Date().getTime();
        this.level.enemies = this.level.enemies.filter(enemy => {
            // Keep enemies that are not dead
            if (!enemy.isDead()) {
                return true;
            }
            // Keep dead enemies for 1500ms to show death animation
            if (currentTime - enemy.deadTime < 1500) {
                return true;
            }
            // Remove enemies after the death animation duration
            return false;
        });
    }

    /**
     * Removes bottles that have completed their splash animation.
     */
    cleanupSplashedBottles() {
        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.splashAnimationFinished);
    }

    /**
     * Updates the displayed level number in the UI.
     * @private
     */
    _updateLevelDisplay() {
        if (this.levelDisplayElement) {
            // Adjust +1 because currentLevelIndex is 0-based
            this.levelDisplayElement.querySelector('span').innerText = this.currentLevelIndex + 1;
        }
    }
}
