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
     * @param {MovableObject} enemy - The enemy object involved in the collision.
     * @private
     */
    _handleCharacterEnemyCollision(enemy) {
        if (this.world.character.isColliding(enemy) && !enemy.isDead()) {
            this.world.character.hit();
            this.world.statusBar.setPercentage(this.world.character.energy);
            if (this.world.character.isDead()) {
                this.world.endGame();
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
     * @param {Bottle} bottle - The collected bottle object.
     * @param {number} index - The index of the collected bottle in the level's bottles array.
     * @private
     */
    _handleCharacterBottleCollision(bottle, index) {
        if (this.world.character.isColliding(bottle)) {
            this.world.character.bottles++;
            this.world.level.bottles.splice(index, 1);
            this.world.statusBarBottles.setPercentage(this.world.character.bottles * 20);
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
        }
    }
}
