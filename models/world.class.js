/**
 * Represents the game world, managing all game elements, logic, and rendering.
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
    levelDisplayElement;

    // Manager instances
    collisionManager;
    audioManager;
    renderer;
    gameFlowManager;

    /**
     * Creates an instance of World.
     * @param {HTMLCanvasElement} canvas - The HTML canvas element for rendering.
     * @param {Keyboard} keyboard - The keyboard input handler instance.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = allLevels[this.currentLevelIndex](); // <-- MODIFIED
        this.levelDisplayElement = document.getElementById('levelDisplay');

        this.collisionManager = new CollisionManager(this);
        this.audioManager = new WorldAudioManager(this);
        this.renderer = new WorldRenderer(this);
        this.gameFlowManager = new GameFlowManager(this);

        this._initializeGameComponents();
    }

    /**
     * Initializes various game components.
     * @private
     */
    _initializeGameComponents() {
        this.renderer.draw();
        this.setWorld();
        this.run();
        this.character.animate();
        updatePausePlayButton();
        this._updateLevelDisplay();
    }

    /**
     * Assigns the world reference to game objects.
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
     * Starts the main game loops.
     */
    run() {
        setInterval(() => this._updateGameLogic(), 1000 / 60);
        setInterval(() => this._performCleanup(), 100);
    }

    /**
     * Updates core game logic.
     * @private
     */
    _updateGameLogic() {
        if (!this.isGameOver && !this.isGameWon && !this.gamePaused) {
            this.collisionManager.checkAllCollisions();
            this.checkThrowObjects();
            this.gameFlowManager.checkLevelCompletion();
            this.audioManager._checkChickenSoundProximity();
        }
    }

    /**
     * Performs cleanup of dead or used objects.
     * @private
     */
    _performCleanup() {
        if (!this.isGameOver && !this.isGameWon && !this.gamePaused) {
            this.cleanupDeadEnemies();
            this.cleanupSplashedBottles();
        }
    }

    /**
     * Handles the logic for throwing objects.
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
     * Creates a new throwable bottle.
     * @private
     */
    _createAndThrowBottle() {
        let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100, this.character.otherDirection);
        bottle.setWorld(this);
        this.throwableObjects.push(bottle);
        this.character.bottles--;
        this.statusBarBottles.setPercentage(this.character.bottles * 20);
    }

    /**
     * Updates the endboss health bar.
     * @param {MovableObject} enemy - The enemy that was hit.
     */
    _updateEndbossHealth(enemy) {
        if (enemy instanceof Endboss) {
            this.endbossHealthBar.setPercentage(enemy.energy);
        }
    }

    /**
     * Removes dead enemies from the level.
     */
    cleanupDeadEnemies() {
        const currentTime = new Date().getTime();
        this.level.enemies = this.level.enemies.filter(enemy => {
            if (!enemy.isDead()) {
                return true;
            }
            if (currentTime - enemy.deadTime < 1500) {
                return true;
            }
            return false;
        });
    }

    /**
     * Removes splashed bottles from the game.
     */
    cleanupSplashedBottles() {
        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.splashAnimationFinished);
    }

    /**
     * Updates the level number in the UI.
     * @private
     */
    _updateLevelDisplay() {
        if (this.levelDisplayElement) {
            this.levelDisplayElement.querySelector('span').innerText = this.currentLevelIndex + 1;
        }
    }
}