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
    chickenBossDieSound = new Audio('audio/chickenBossdies.mp3');
    bossSoundPlayed = false;
    levelSound = new Audio('audio/levelsound.mp3');
    levelSoundPlaying = false;
    chickenSound = new Audio('audio/chicken.mp3');
    chickenSoundPlaying = false;
    brokenBottleSound = new Audio('audio/brokenBottle.mp3');
    gamePaused = false;

    collisionManager;

    /**
     * Creates an instance of World.
     * Initializes the game world, sets up canvas, keyboard, and managers.
     * @param {HTMLCanvasElement} canvas - The HTML canvas element for rendering.
     * @param {Keyboard} keyboard - The keyboard input handler instance.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = allLevels[this.currentLevelIndex];

        this.collisionManager = new CollisionManager(this);
        this.draw();
        this.setWorld();
        this.run();
        this.character.animate();
        this.levelSound.loop = true;
        this.chickenSound.loop = true;
        this._initAudioVolume();
    }

    /**
     * Sets the initial volume for all audio elements.
     * @private
     */
    _initAudioVolume() {
        if (typeof currentVolume !== 'undefined') {
            this.levelSound.volume = currentVolume;
            this.chickenSound.volume = currentVolume;
            this.chickenBossDieSound.volume = currentVolume;
            this.brokenBottleSound.volume = currentVolume;
        }
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
            this.checkLevelCompletion();
            this._checkChickenSoundProximity();
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
        let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
        bottle.setWorld(this);
        this.throwableObjects.push(bottle);
        this.character.bottles--;
        this.statusBarBottles.setPercentage(this.character.bottles * 20);
    }

    /**
     * Plays the sound effect for a broken bottle.
     * @private
     */
    _playBrokenBottleSound() {
        this.brokenBottleSound.currentTime = 0;
        if (typeof isMutedGlobally !== 'undefined' && !isMutedGlobally) {
            this.brokenBottleSound.play();
        }
    }

    /**
     * Updates the endboss health bar if the hit enemy is the Endboss.
     * @param {MovableObject} enemy - The enemy object that was hit.
     * @private
     */
    _updateEndbossHealth(enemy) {
        if (enemy instanceof Endboss) {
            this.endbossHealthBar.setPercentage(enemy.energy);
        }
    }

    /**
     * Plays the endboss death sound if the endboss is defeated.
     * @param {MovableObject} enemy - The enemy object that was hit (potentially the endboss).
     * @private
     */
    _playEndbossDeathSound(enemy) {
        if (enemy instanceof Endboss && enemy.isDead() && !this.bossSoundPlayed) {
            if (typeof isMutedGlobally !== 'undefined' && !isMutedGlobally) {
                this.chickenBossDieSound.play();
            }
            this.bossSoundPlayed = true;
        }
    }

    /**
     * Determines if a chicken enemy is within proximity to play its sound.
     * @private
     */
    _checkChickenSoundProximity() {
        let foundProximityEnemy = false;
        const proximityRange = 500;

        this.level.enemies.forEach(enemy => {
            if ((enemy instanceof Chicken || enemy instanceof ChickenSmall) && !enemy.isDead()) {
                const distanceX = Math.abs(this.character.x - enemy.x);
                if (distanceX < proximityRange) {
                    foundProximityEnemy = true;
                }
            }
        });
        this._updateChickenSound(foundProximityEnemy);
    }

    /**
     * Manages the chicken sound playback based on enemy proximity and global mute status.
     * @param {boolean} foundProximityEnemy - True if a chicken enemy is within proximity.
     * @private
     */
    _updateChickenSound(foundProximityEnemy) {
        const shouldPlay = foundProximityEnemy && !this.chickenSoundPlaying && !isMutedGlobally;
        const shouldPause = (!foundProximityEnemy && this.chickenSoundPlaying) ||
                            (isMutedGlobally && this.chickenSoundPlaying);

        if (shouldPlay) {
            this.chickenSound.currentTime = 0;
            this.chickenSound.play().catch(e => {
                     if (e.name === "AbortError") {
                        // This error is expected if playback is interrupted quickly
                     } else {
                        console.error("Error playing chicken sound:", e);
                     }
            });
            this.chickenSoundPlaying = true;
        } else if (shouldPause) {
            this.chickenSound.pause();
            this.chickenSound.currentTime = 0;
            this.chickenSoundPlaying = false;
        }
    }

    /**
     * Removes dead enemies from the level's enemy array.
     */
    cleanupDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.isDead());
    }

    /**
     * Removes bottles that have completed their splash animation.
     */
    cleanupSplashedBottles() {
        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.splashAnimationFinished);
    }

    /**
     * Checks if the current level's completion conditions are met.
     */
    checkLevelCompletion() {
        const allCoinsCollected = this.level.coins.length === 0;
        const endbossDefeated = this.level.endboss && this.level.endboss.isDead();

        if (allCoinsCollected && endbossDefeated) {
            this.levelComplete();
        }
    }

    /**
     * Advances to the next level or triggers the game won state.
     */
    levelComplete() {
        if (this.currentLevelIndex < allLevels.length - 1) {
            this.currentLevelIndex++;
            this.showLevelCompleteScreen();
        } else {
            this.gameWon();
        }
    }

    /**
     * Displays the level complete screen and pauses game sounds.
     */
    showLevelCompleteScreen() {
        this.isGameOver = true;
        this._pauseAllGameSounds();
        this._hideGameElementsAndShowScreen('levelCompleteScreen');
    }

    /**
     * Pauses all currently playing game background and chicken sounds.
     * @private
     */
    _pauseAllGameSounds() {
        this.levelSound.pause();
        this.chickenSound.pause();
        this.chickenSound.currentTime = 0;
        this.chickenSoundPlaying = false;
    }

    /**
     * Hides core game display elements and shows a specified screen.
     * @param {string} screenId - The ID of the screen element to show.
     * @private
     */
    _hideGameElementsAndShowScreen(screenId) {
        document.getElementById(screenId).classList.remove('d-none');
        document.getElementById('canvas').classList.add('d-none');
        document.querySelector('.mobile-controls-wrapper').classList.add('d-none');
        document.querySelector('.controls-container').classList.add('d-none');
    }

    /**
     * Resets character and game state for loading the next level.
     * @private
     */
    _resetForNextLevel() {
        this.isGameOver = false;
        this.character.reset();
        this.level = allLevels[this.currentLevelIndex];
        this.setWorld();
        this.throwableObjects = [];
        this.bossSoundPlayed = false;
        this.camera_x = 0;
        this.gamePaused = false;
    }

    /**
     * Resets and updates all status bars for a new level.
     * @private
     */
    _updateStatusBarsForNextLevel() {
        this.statusBar.setPercentage(this.character.energy);
        this.statusBarBottles.setPercentage(this.character.bottles * 20);
        this.statusBarCoins.setPercentage(0);
        this.endbossHealthBar.setPercentage(100);
    }

    /**
     * Manages the transition and setup for the next game level.
     */
    goToNextLevel() {
        this._resetForNextLevel();
        this._updateStatusBarsForNextLevel();
        this._transitionToGameView();
        this._playLevelMusic();
        this._checkOrientationAndResumeGame();
    }

    /**
     * Hides the level complete screen and makes the game canvas visible.
     * @private
     */
    _transitionToGameView() {
        document.getElementById('levelCompleteScreen').classList.add('d-none');
        document.getElementById('canvas').classList.remove('d-none');
    }

    /**
     * Plays the background music for the current level if not muted.
     * @private
     */
    _playLevelMusic() {
        this.levelSound.pause();
        this.levelSound.currentTime = 0;
        if (typeof isMutedGlobally !== 'undefined' && !isMutedGlobally) {
            this.levelSound.play();
            this.levelSoundPlaying = true;
        } else {
            this.levelSoundPlaying = false;
        }
    }

    /**
     * Checks the device's orientation and potentially resumes the game.
     * @private
     */
    _checkOrientationAndResumeGame() {
        if (typeof checkOrientation === 'function') {
            checkOrientation();
        }
    }

    /**
     * Sets the game to 'won' state and displays the game won screen.
     */
    gameWon() {
        this.isGameWon = true;
        this.isGameOver = true;
        this._pauseAllGameSounds();
        this._hideGameElementsAndShowScreen('gameWonScreen');
    }

    /**
     * Sets the game to 'game over' state and displays the game over screen.
     */
    endGame() {
        this.isGameOver = true;
        this._pauseAllGameSounds();
        this._hideGameElementsAndShowScreen('gameOverScreen');
    }

    /**
     * Iterates through an array of objects and draws each one to the map.
     * @param {DrawableObject[]} objects - An array of drawable objects to add to the map.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Draws a single drawable object to the canvas, handling image flipping for movable objects.
     * @param {DrawableObject} mo - The drawable object to add to the map.
     */
    addToMap(mo) {
        if (!mo) return;

        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Prepares the canvas context to draw an image flipped horizontally.
     * @param {MovableObject} mo - The movable object whose image will be flipped.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the canvas context after a horizontal flip.
     * @param {MovableObject} mo - The movable object whose image was flipped.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * The main drawing loop that clears the canvas and redraws all game elements.
     */
    draw() {
        this._clearCanvas();

        this.ctx.save();

        this._drawBackgroundAndDynamicElements();

        this.ctx.restore();
        this._drawFixedUIElements();

        this._requestNextFrame();
    }

    /**
     * Clears the entire canvas.
     * @private
     */
    _clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws background, dynamic game objects, and the character with camera translation.
     * @private
     */
    _drawBackgroundAndDynamicElements() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
    }

    /**
     * Draws static UI elements that remain fixed on the screen.
     * @private
     */
    _drawFixedUIElements() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottles);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.endbossHealthBar);
    }

    /**
     * Requests the next animation frame for a continuous drawing loop.
     * @private
     */
    _requestNextFrame() {
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }
}
