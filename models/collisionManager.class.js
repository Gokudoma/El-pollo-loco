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
     * Handles character-enemy collision, including character damage and game over.
     * Damage is applied with a cooldown of 500ms.
     * @param {MovableObject} enemy - The enemy object involved in the collision.
     * @private
     */
    _handleCharacterEnemyCollision(enemy) {
        const damageCooldown = 500; // Cooldown in milliseconds for taking damage
        const currentTime = new Date().getTime();

        if (this.world.character.isColliding(enemy) && !enemy.isDead()) {
            // Check if enough time has passed since the last hit
            if (currentTime - this.world.character.lastHit > damageCooldown) {
                this.world.character.hit(); // This will update character.lastHit
                this.world.statusBar.setPercentage(this.world.character.energy);
                if (this.world.character.isDead()) {
                    this.world.endGame();
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
            this.world._playBrokenBottleSound();
            this.world._updateEndbossHealth(enemy);
            this.world._playEndbossDeathSound(enemy);
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
            // Play collect bottle sound
            if (typeof isMutedGlobally !== 'undefined' && !isMutedGlobally) {
                this.world.collectBottleSound.currentTime = 0;
                this.world.collectBottleSound.play();
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
            // Play collect coin sound
            if (typeof isMutedGlobally !== 'undefined' && !isMutedGlobally) {
                this.world.collectCoinSound.currentTime = 0;
                this.world.collectCoinSound.play();
            }
        }
    }
}
