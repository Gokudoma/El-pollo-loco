// models/world.class.js

let allLevels = [level1, level2, level3];

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
    } // Initializes the game world, sets up canvas, keyboard, and managers.

    _initAudioVolume() {
        if (typeof currentVolume !== 'undefined') {
            this.levelSound.volume = currentVolume;
            this.chickenSound.volume = currentVolume;
            this.chickenBossDieSound.volume = currentVolume;
            this.brokenBottleSound.volume = currentVolume;
        }
    } // Sets the initial volume for all audio elements.

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
    } // Assigns the world reference to the character and all enemies in the current level.

    run() {
        setInterval(() => this._updateGameLogic(), 1000 / 60);
        setInterval(() => this._performCleanup(), 100);
    } // Starts the main game loops for logic updates and cleanup.

    _updateGameLogic() {
        if (!this.isGameOver && !this.isGameWon && !this.gamePaused) {
            this.collisionManager.checkAllCollisions();
            this.checkThrowObjects();
            this.checkLevelCompletion();
            this._checkChickenSoundProximity();
        }
    } // Updates core game logic: collisions, object throwing, level progression, and proximity sounds.

    _performCleanup() {
        if (!this.isGameOver && !this.isGameWon && !this.gamePaused) {
            this.cleanupDeadEnemies();
            this.cleanupSplashedBottles();
        }
    } // Performs cleanup of dead entities and splashed objects.

    checkThrowObjects() {
        let timePassed = new Date().getTime() - this.lastBottleThrow;
        const canThrow = this.keyboard.SPACE && this.character.bottles > 0 &&
                             !this.character.isDead() && !this.isGameWon && timePassed > this.bottleCooldown;

        if (canThrow) {
            this._createAndThrowBottle();
            this.lastBottleThrow = new Date().getTime();
        }
    } // Handles the logic for character throwing bottles.

    _createAndThrowBottle() {
        let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
        bottle.setWorld(this);
        this.throwableObjects.push(bottle);
        this.character.bottles--;
        this.statusBarBottles.setPercentage(this.character.bottles * 20);
    } // Creates and adds a new throwable bottle to the game world.

    _playBrokenBottleSound() {
        this.brokenBottleSound.currentTime = 0;
        if (typeof isMutedGlobally !== 'undefined' && !isMutedGlobally) {
            this.brokenBottleSound.play();
        }
    } // Plays the sound effect for a broken bottle.

    _updateEndbossHealth(enemy) {
        if (enemy instanceof Endboss) {
            this.endbossHealthBar.setPercentage(enemy.energy);
        }
    } // Updates the endboss health bar if the hit enemy is the Endboss.

    _playEndbossDeathSound(enemy) {
        if (enemy instanceof Endboss && enemy.isDead() && !this.bossSoundPlayed) {
            if (typeof isMutedGlobally !== 'undefined' && !isMutedGlobally) {
                this.chickenBossDieSound.play();
            }
            this.bossSoundPlayed = true;
        }
    } // Plays the endboss death sound if the endboss is defeated.

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
    } // Determines if a chicken enemy is within proximity to play its sound.

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
    } // Manages the chicken sound playback based on enemy proximity and global mute status.

    cleanupDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.isDead());
    } // Removes dead enemies from the level's enemy array.

    cleanupSplashedBottles() {
        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.splashAnimationFinished);
    } // Removes bottles that have completed their splash animation.

    checkLevelCompletion() {
        const allCoinsCollected = this.level.coins.length === 0;
        const endbossDefeated = this.level.endboss && this.level.endboss.isDead();

        if (allCoinsCollected && endbossDefeated) {
            this.levelComplete();
        }
    } // Checks if the current level's completion conditions are met.

    levelComplete() {
        if (this.currentLevelIndex < allLevels.length - 1) {
            this.currentLevelIndex++;
            this.showLevelCompleteScreen();
        } else {
            this.gameWon();
        }
    } // Advances to the next level or triggers the game won state.

    showLevelCompleteScreen() {
        this.isGameOver = true;
        this._pauseAllGameSounds();
        this._hideGameElementsAndShowScreen('levelCompleteScreen');
    } // Displays the level complete screen and pauses game sounds.

    _pauseAllGameSounds() {
        this.levelSound.pause();
        this.chickenSound.pause();
        this.chickenSound.currentTime = 0;
        this.chickenSoundPlaying = false;
    } // Pauses all currently playing game background and chicken sounds.

    _hideGameElementsAndShowScreen(screenId) {
        document.getElementById(screenId).classList.remove('d-none');
        document.getElementById('canvas').classList.add('d-none');
        document.querySelector('.mobile-controls-wrapper').classList.add('d-none');
        document.querySelector('.controls-container').classList.add('d-none');
    } // Hides core game display elements and shows a specified screen.

    _resetForNextLevel() {
        this.isGameOver = false;
        this.character.reset();
        this.level = allLevels[this.currentLevelIndex];
        this.setWorld();
        this.throwableObjects = [];
        this.bossSoundPlayed = false;
        this.camera_x = 0;
        this.gamePaused = false;
    } // Resets character and game state for loading the next level.

    _updateStatusBarsForNextLevel() {
        this.statusBar.setPercentage(this.character.energy);
        this.statusBarBottles.setPercentage(this.character.bottles * 20);
        this.statusBarCoins.setPercentage(0);
        this.endbossHealthBar.setPercentage(100);
    } // Resets and updates all status bars for a new level.

    goToNextLevel() {
        this._resetForNextLevel();
        this._updateStatusBarsForNextLevel();
        this._transitionToGameView();
        this._playLevelMusic();
        this._checkOrientationAndResumeGame();
    } // Manages the transition and setup for the next game level.

    _transitionToGameView() {
        document.getElementById('levelCompleteScreen').classList.add('d-none');
        document.getElementById('canvas').classList.remove('d-none');
    } // Hides the level complete screen and makes the game canvas visible.

    _playLevelMusic() {
        this.levelSound.pause();
        this.levelSound.currentTime = 0;
        if (typeof isMutedGlobally !== 'undefined' && !isMutedGlobally) {
            this.levelSound.play();
            this.levelSoundPlaying = true;
        } else {
            this.levelSoundPlaying = false;
        }
    } // Plays the background music for the current level if not muted.

    _checkOrientationAndResumeGame() {
        if (typeof checkOrientation === 'function') {
            checkOrientation();
        }
    } // Checks the device's orientation and potentially resumes the game.

    gameWon() {
        this.isGameWon = true;
        this.isGameOver = true;
        this._pauseAllGameSounds();
        this._hideGameElementsAndShowScreen('gameWonScreen');
    } // Sets the game to 'won' state and displays the game won screen.

    endGame() {
        this.isGameOver = true;
        this._pauseAllGameSounds();
        this._hideGameElementsAndShowScreen('gameOverScreen');
    } // Sets the game to 'game over' state and displays the game over screen.

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    } // Iterates through an array of objects and draws each one to the map.

    addToMap(mo) {
        if (!mo) return;

        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    } // Draws a single drawable object to the canvas, handling image flipping.

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    } // Prepares the canvas context to draw an image flipped horizontally.

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    } // Restores the canvas context after a horizontal flip.

    draw() {
        this._clearCanvas();
        
        this.ctx.save(); 
        
        this._drawBackgroundAndDynamicElements();
        
        this.ctx.restore(); 
        this._drawFixedUIElements();

        this._requestNextFrame();
    } // The main drawing loop that clears the canvas and redraws all game elements.

    _clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    } // Clears the entire canvas.

    _drawBackgroundAndDynamicElements() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
    } // Draws background, dynamic game objects, and the character with camera translation.

    _drawFixedUIElements() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottles);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.endbossHealthBar);
    } // Draws static UI elements that remain fixed on the screen.

    _requestNextFrame() {
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    } // Requests the next animation frame for a continuous drawing loop.
}