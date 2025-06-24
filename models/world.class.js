// models/world.class.js

let allLevels = [level1, level2, level3]; // Assumes level1, level2, level3 are defined elsewhere

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

    /**
     * Initializes the game world with canvas and keyboard input.
     * @param {HTMLCanvasElement} canvas - The canvas element for drawing.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = allLevels[this.currentLevelIndex];
        this.draw();
        this.setWorld();
        this.run();
        this.character.animate();
        this.levelSound.loop = true;
        this.chickenSound.loop = true;
        if (typeof currentVolume !== 'undefined') {
            this.levelSound.volume = currentVolume;
            this.chickenSound.volume = currentVolume;
            this.chickenBossDieSound.volume = currentVolume;
            this.brokenBottleSound.volume = currentVolume;
        }
    }

    /**
     * Sets the world reference for the character and all enemies in the current level.
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
     * Starts the main game loops for checks and cleanup.
     */
    run() {
        setInterval(() => this._updateGameLogic(), 1000 / 60);
        setInterval(() => this._performCleanup(), 100);
    }

    /**
     * Updates game logic: collisions, object throwing, level completion, enemy proximity.
     */
    _updateGameLogic() {
        if (!this.isGameOver && !this.isGameWon && !this.gamePaused) {
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkLevelCompletion();
        }
    }

    /**
     * Performs cleanup of dead enemies and splashed bottles.
     */
    _performCleanup() {
        if (!this.isGameOver && !this.isGameWon && !this.gamePaused) {
            this.cleanupDeadEnemies();
            this.cleanupSplashedBottles();
        }
    }

    /**
     * Handles the logic for throwing objects (bottles).
     */
    checkThrowObjects() {
        let timePassed = new Date().getTime() - this.lastBottleThrow;
        const canThrow = this.keyboard.SPACE && this.character.bottles > 0 &&
                             !this.character.isDead() && !this.isGameOver &&
                             !this.isGameWon && timePassed > this.bottleCooldown;

        if (canThrow) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            bottle.setWorld(this);
            this.throwableObjects.push(bottle);
            this.character.bottles--;
            this.statusBarBottles.setPercentage(this.character.bottles * 20);
            this.lastBottleThrow = new Date().getTime();
        }
    }

    /**
     * Handles collision between character and an enemy.
     * @param {MovableObject} enemy - The enemy object.
     */
    _handleCharacterEnemyCollision(enemy) {
        if (this.character.isColliding(enemy) && !enemy.isDead()) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
            if (this.character.isDead()) {
                this.endGame();
            }
        }
    }

    /**
     * Handles collision between a throwable object (bottle) and an enemy.
     * @param {ThrowableObject} bottle - The throwable bottle object.
     * @param {MovableObject} enemy - The enemy object.
     */
    _handleBottleEnemyCollision(bottle, enemy) {
        if (bottle.isColliding(enemy) && !bottle.isSplashing && !enemy.isDead()) {
            bottle.splash();
            enemy.hit();
            this.brokenBottleSound.currentTime = 0;
            if (typeof isMutedGlobally !== 'undefined' && !isMutedGlobally) {
                this.brokenBottleSound.play();
            }
            this._updateEndbossHealth(enemy);
            this._playEndbossDeathSound(enemy);
        }
    }

    /**
     * Updates endboss health bar if the enemy is an Endboss.
     * @param {MovableObject} enemy - The enemy that was hit.
     */
    _updateEndbossHealth(enemy) {
        if (enemy instanceof Endboss) {
            this.endbossHealthBar.setPercentage(enemy.energy);
        }
    }

    /**
     * Plays endboss death sound if applicable.
     * @param {MovableObject} enemy - The enemy that was hit.
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
     * Handles collision between character and collectible bottles.
     * @param {Bottle} bottle - The collectible bottle object.
     * @param {number} index - The index of the bottle in the array.
     */
    _handleCharacterBottleCollision(bottle, index) {
        if (this.character.isColliding(bottle)) {
            this.character.bottles++;
            this.level.bottles.splice(index, 1);
            this.statusBarBottles.setPercentage(this.character.bottles * 20);
        }
    }

    /**
     * Handles collision between character and collectible coins.
     * @param {Coin} coin - The collectible coin object.
     * @param {number} index - The index of the coin in the array.
     */
    _handleCharacterCoinCollision(coin, index) {
        if (this.character.isColliding(coin)) {
            this.character.coins++;
            this.level.coins.splice(index, 1);
            let collectedCoinPercentage = (this.character.coins / this.level.initialCoinCount) * 100;
            this.statusBarCoins.setPercentage(collectedCoinPercentage);
        }
    }

    /**
     * Checks for all types of collisions in the game.
     */
    checkCollisions() {
        this.level.enemies.forEach(enemy => {
            this._handleCharacterEnemyCollision(enemy); // Corrected from _handleCharacterEnemyEnemyCollision
            this.throwableObjects.forEach(bottle => {
                this._handleBottleEnemyCollision(bottle, enemy);
            });
        });

        this.level.bottles.forEach((bottle, index) => {
            this._handleCharacterBottleCollision(bottle, index);
        });

        this.level.coins.forEach((coin, index) => {
            this._handleCharacterCoinCollision(coin, index);
        });
    }

    /**
     * Updates the chicken sound based on enemy proximity.
     * @param {boolean} foundProximityEnemy - True if any enemy is in proximity.
     */
    _updateChickenSound(foundProximityEnemy) {
        const shouldPlay = foundProximityEnemy && !this.chickenSoundPlaying && !isMutedGlobally;
        const shouldPause = (!foundProximityEnemy && this.chickenSoundPlaying) || (isMutedGlobally && this.chickenSoundPlaying);

        if (shouldPlay) {
            this.chickenSound.play();
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
     * Removes bottles that have finished their splash animation from throwable objects.
     */
    cleanupSplashedBottles() {
        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.splashAnimationFinished);
    }

    /**
     * Checks if the current level is completed (all coins collected and Endboss defeated).
     */
    checkLevelCompletion() {
        const allCoinsCollected = this.level.coins.length === 0;
        const endbossDefeated = this.level.endboss && this.level.endboss.isDead();

        if (allCoinsCollected && endbossDefeated) {
            this.levelComplete();
        }
    }

    /**
     * Proceeds to the next level or triggers game won screen if all levels are complete.
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
     * Hides game elements and displays the level complete screen.
     */
    showLevelCompleteScreen() {
        this.isGameOver = true;
        this.levelSound.pause();
        this.chickenSound.pause();
        this.chickenSound.currentTime = 0;
        this.chickenSoundPlaying = false;
        document.getElementById('levelCompleteScreen').classList.remove('d-none');
        document.getElementById('canvas').classList.add('d-none');
        document.querySelector('.mobile-controls-wrapper').classList.add('d-none');
        document.querySelector('.controls-container').classList.add('d-none');
    }

    /**
     * Resets character and game state for the next level.
     */
    _resetForNextLevel() {
        this.isGameOver = false;
        this.character.reset();
        this.level = allLevels[this.currentLevelIndex];
        this.setWorld();
        this.throwableObjects = [];
        this.bossSoundPlayed = false;
        this.camera_x = 0;
    }

    /**
     * Updates all status bars for the new level.
     */
    _updateStatusBarsForNextLevel() {
        this.statusBar.setPercentage(this.character.energy);
        this.statusBarBottles.setPercentage(this.character.bottles * 20);
        this.statusBarCoins.setPercentage(0);
        this.endbossHealthBar.setPercentage(100);
    }

    /**
     * Transitions to the next level.
     */
    goToNextLevel() {
        this._resetForNextLevel();
        this._updateStatusBarsForNextLevel();
        document.getElementById('levelCompleteScreen').classList.add('d-none');
        document.getElementById('canvas').classList.remove('d-none');
        
        this.levelSound.pause(); 
        this.levelSound.currentTime = 0; 

        if (typeof isMutedGlobally !== 'undefined' && !isMutedGlobally) {
            this.levelSound.play();
            this.levelSoundPlaying = true;
        } else {
            this.levelSoundPlaying = false;
        }

        if (typeof checkOrientation === 'function') {
            checkOrientation();
        }
        this.gamePaused = false;
    }

    /**
     * Triggers the game won state, hiding game elements and showing the game won screen.
     */
    gameWon() {
        this.isGameWon = true;
        this.isGameOver = true;
        this.levelSound.pause();
        this.chickenSound.pause();
        this.chickenSound.currentTime = 0;
        this.chickenSoundPlaying = false;
        document.getElementById('gameWonScreen').classList.remove('d-none');
        document.getElementById('canvas').classList.add('d-none');
        document.querySelector('.mobile-controls-wrapper').classList.add('d-none');
        document.querySelector('.controls-container').classList.add('d-none');
    }

    /**
     * Triggers the game over state, hiding game elements and showing the game over screen.
     */
    endGame() {
        this.isGameOver = true;
        this.levelSound.pause();
        this.chickenSound.pause();
        this.chickenSound.currentTime = 0;
        this.chickenSoundPlaying = false;
        document.getElementById('gameOverScreen').classList.remove('d-none');
        document.getElementById('canvas').classList.add('d-none');
        document.querySelector('.mobile-controls-wrapper').classList.add('d-none');
        document.querySelector('.controls-container').classList.add('d-none');
    }

    /**
     * Draws a group of objects onto the canvas.
     * @param {DrawableObject[]} objects - An array of drawable objects.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Draws a single drawable object onto the canvas, handling image flipping if needed.
     * @param {DrawableObject} mo - The movable or drawable object to draw.
     */
    addToMap(mo) {
        if (mo && mo.otherDirection) {
            this.flipImage(mo);
        }
        if (mo) {
            mo.draw(this.ctx);
            // mo.drawFrame(this.ctx); // Uncomment for collision box debugging
        }
        if (mo && mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips the image horizontally for drawing in the opposite direction.
     * @param {MovableObject} mo - The movable object to flip.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the canvas context after flipping an image.
     * @param {MovableObject} mo - The movable object that was flipped.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * The main drawing loop that clears the canvas and redraws all game elements.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background and objects with camera translation
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);

        // Draw fixed UI elements (status bars) without camera translation
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottles);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.endbossHealthBar);
        this.ctx.translate(this.camera_x, 0);

        // Draw dynamic game elements with camera translation
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.throwableObjects);

        // Restore camera translation
        this.ctx.translate(-this.camera_x, 0);

        // Request next animation frame
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }
}