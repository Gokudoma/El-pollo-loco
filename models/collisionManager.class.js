class CollisionManager {
    constructor(world) {
        this.world = world;
    } // Initializes the CollisionManager with a reference to the game world.

    checkAllCollisions() {
        this._checkEnemyCollisions();
        this._checkBottleCollisions();
        this._checkCoinCollisions();
    } // Orchestrates all collision checks within the game.

    _checkEnemyCollisions() {
        this.world.level.enemies.forEach(enemy => {
            this._handleCharacterEnemyCollision(enemy);
            this.world.throwableObjects.forEach(bottle => {
                this._handleBottleEnemyCollision(bottle, enemy);
            });
        });
    } // Checks collisions between the character/throwable objects and enemies.

    _handleCharacterEnemyCollision(enemy) {
        if (this.world.character.isColliding(enemy) && !enemy.isDead()) {
            this.world.character.hit();
            this.world.statusBar.setPercentage(this.world.character.energy);
            if (this.world.character.isDead()) {
                this.world.endGame();
            }
        }
    } // Handles character-enemy collision, including character damage and game over.

    _handleBottleEnemyCollision(bottle, enemy) {
        if (bottle.isColliding(enemy) && !bottle.isSplashing && !enemy.isDead()) {
            bottle.splash();
            enemy.hit();
            this.world._playBrokenBottleSound();
            this.world._updateEndbossHealth(enemy);
            this.world._playEndbossDeathSound(enemy);
        }
    } // Handles throwable bottle-enemy collision, including bottle splash and enemy damage.

    _checkBottleCollisions() {
        this.world.level.bottles.forEach((bottle, index) => {
            this._handleCharacterBottleCollision(bottle, index);
        });
    } // Checks for collisions between the character and collectible bottles.

    _handleCharacterBottleCollision(bottle, index) {
        if (this.world.character.isColliding(bottle)) {
            this.world.character.bottles++;
            this.world.level.bottles.splice(index, 1);
            this.world.statusBarBottles.setPercentage(this.world.character.bottles * 20);
        }
    } // Handles character-collectible bottle collision, updating bottle count and UI.

    _checkCoinCollisions() {
        this.world.level.coins.forEach((coin, index) => {
            this._handleCharacterCoinCollision(coin, index);
        });
    } // Checks for collisions between the character and collectible coins.

    _handleCharacterCoinCollision(coin, index) {
        if (this.world.character.isColliding(coin)) {
            this.world.character.coins++;
            this.world.level.coins.splice(index, 1);
            let collectedCoinPercentage = (this.world.character.coins / this.world.level.initialCoinCount) * 100;
            this.world.statusBarCoins.setPercentage(collectedCoinPercentage);
        }
    } // Handles character-collectible coin collision, updating coin count and UI.
}