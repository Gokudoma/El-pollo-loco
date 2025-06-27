/**
 * Manages all collision detection and resolution within the game world.
 */
class CollisionManager {
    /**
     * Creates an instance of CollisionManager.
     * @param {World} world - A reference to the game world.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Orchestrates all collision checks within the game.
     */
    checkAllCollisions() {
        this._checkEnemyCollisions();
        this._checkBottleCollisions();
        this._checkCoinCollisions();
    }

    /**
     * Checks collisions between the character/throwable objects and enemies.
     * @private
     */
    _checkEnemyCollisions() {
        this.world.level.enemies.forEach(enemy => {
            this._handleCharacterEnemyCollision(enemy);
            this.world.throwableObjects.forEach(bottle => {
                this._handleBottleEnemyCollision(bottle, enemy);
            });
        });
    }

    /**
     * Checks if character is jumping on a chicken.
     * @param {MovableObject} enemy - The enemy object.
     * @returns {boolean} True if character is jumping on chicken.
     * @private
     */
    _isJumpingOnChicken(enemy) {
        return (enemy instanceof Chicken || enemy instanceof ChickenSmall) &&
               this.world.character.isAboveGround() &&
               this.world.character.speedY < 0 &&
               this.world.character.y + this.world.character.height - this.world.character.offset.bottom < enemy.y + enemy.offset.top + (enemy.height / 2);
    }

    /**
     * Handles character landing on a chicken.
     * @param {MovableObject} enemy - The enemy object.
     * @private
     */
    _handleChickenStomp(enemy) {
        enemy.energy = 0; // Instantly kill the chicken
        enemy.deadTime = new Date().getTime(); // Set dead time for the chicken
        this.world.character.speedY = 20; // Make character bounce upwards
        this.world.audioManager._pauseChickenSound(); // Changed to _pauseChickenSound
    }

    /**
     * Handles character taking damage from an enemy.
     * @private
     */
    _handleCharacterDamage() {
        this.world.character.hit(); // This applies damage to character
        this.world.statusBar.setPercentage(this.world.character.energy);
        if (this.world.character.isDead()) {
            this.world.gameFlowManager.endGame(); // Call gameFlowManager
        }
    }

    /**
     * Handles character-enemy collision logic.
     * @param {MovableObject} enemy - The enemy object involved in the collision.
     * @private
     */
    _handleCharacterEnemyCollision(enemy) {
        const damageCooldown = 500; // Cooldown in milliseconds for character taking damage
        const currentTime = new Date().getTime();

        if (this.world.character.isColliding(enemy) && !enemy.isDead()) {
            if (this._isJumpingOnChicken(enemy)) {
                this._handleChickenStomp(enemy);
            } else {
                if (currentTime - this.world.character.lastHit > damageCooldown) {
                    this._handleCharacterDamage();
                }
            }
        }
    }

    /**
     * Handles throwable bottle-enemy collision, including bottle splash and enemy damage.
     * @param {ThrowableObject} bottle - The throwable bottle object.
     * @param {MovableObject} enemy - The enemy object.
     * @private
     */
    _handleBottleEnemyCollision(bottle, enemy) {
        if (bottle.isColliding(enemy) && !bottle.isSplashing && !enemy.isDead()) {
            bottle.splash();
            enemy.hit();
            this.world.audioManager._playBrokenBottleSound(); // Access via audioManager
            this.world._updateEndbossHealth(enemy);
            this.world.audioManager._playEndbossDeathSound(enemy); // Access via audioManager
        }
    }

    /**
     * Checks for collisions between the character and collectible bottles.
     * @private
     */
    _checkBottleCollisions() {
        this.world.level.bottles.forEach((bottle, index) => {
            this._handleCharacterBottleCollision(bottle, index);
        });
    }

    /**
     * Handles character-collectible bottle collision, updating bottle count and UI.
     * Plays the collect bottle sound.
     * @param {Bottle} bottle - The collected bottle object.
     * @param {number} index - The index of the collected bottle in the level's bottles array.
     * @private
     */
    _handleCharacterBottleCollision(bottle, index) {
        if (this.world.character.isColliding(bottle)) {
            this.world.character.bottles++;
            this.world.level.bottles.splice(index, 1);
            this.world.statusBarBottles.setPercentage(this.world.character.bottles * 20);
            if (typeof isMutedGlobally !== 'undefined' && !isMutedGlobally) {
                this.world.audioManager.collectBottleSound.currentTime = 0; // Access via audioManager
                this.world.audioManager.collectBottleSound.play(); // Access via audioManager
            }
        }
    }

    /**
     * Checks for collisions between the character and collectible coins.
     * @private
     */
    _checkCoinCollisions() {
        this.world.level.coins.forEach((coin, index) => {
            this._handleCharacterCoinCollision(coin, index);
        });
    }

    /**
     * Handles character-collectible coin collision, updating coin count and UI.
     * Plays the collect coin sound.
     * @param {Coin} coin - The collected coin object.
     * @param {number} index - The index of the collected coin in the level's coins array.
     * @private
     */
    _handleCharacterCoinCollision(coin, index) {
        if (this.world.character.isColliding(coin)) {
            this.world.character.coins++;
            this.world.level.coins.splice(index, 1);
            let collectedCoinPercentage = (this.world.character.coins / this.world.level.initialCoinCount) * 100;
            this.world.statusBarCoins.setPercentage(collectedCoinPercentage);
            if (typeof isMutedGlobally !== 'undefined' && !isMutedGlobally) {
                this.world.audioManager.collectCoinSound.currentTime = 0; // Access via audioManager
                this.world.audioManager.collectCoinSound.play(); // Access via audioManager
            }
        }
    }
}
