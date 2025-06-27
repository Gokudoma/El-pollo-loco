/**
 * Manages the overall game flow, including level progression, game states (win/lose),
 * and transitions between screens.
 */
class GameFlowManager {
    world; // Reference to the World instance

    /**
     * Creates an instance of GameFlowManager.
     * @param {World} world - The World instance to which this manager belongs.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks if the current level's completion conditions are met.
     */
    checkLevelCompletion() {
        const allCoinsCollected = this.world.level.coins.length === 0;
        const endbossDefeated = this.world.level.endboss && this.world.level.endboss.isDead();

        if (allCoinsCollected && endbossDefeated) {
            this.levelComplete();
        }
    }

    /**
     * Advances to the next level or triggers the game won state.
     */
    levelComplete() {
        if (this.world.currentLevelIndex < allLevels.length - 1) {
            this.world.currentLevelIndex++;
            this.showLevelCompleteScreen();
        } else {
            this.gameWon();
        }
    }

    /**
     * Displays the level complete screen and pauses game sounds.
     */
    showLevelCompleteScreen() {
        this.world.isGameOver = true;
        this.world.gamePaused = true;
        this.world.audioManager._pauseAllGameSounds(); // Call audio manager
        this._hideGameElementsAndShowScreen('levelCompleteScreen');
        updatePausePlayButton();
        this.world._updateLevelDisplay();
    }

    /**
     * Sets the game to 'won' state and displays the game won screen.
     */
    gameWon() {
        this.world.isGameWon = true;
        this.world.isGameOver = true;
        this.world.gamePaused = true;
        this.world.audioManager._pauseAllGameSounds(); // Call audio manager
        this._hideGameElementsAndShowScreen('gameWonScreen');
        updatePausePlayButton();
        this.world._updateLevelDisplay();
    }

    /**
     * Sets the game to 'game over' state and displays the game over screen.
     */
    endGame() {
        this.world.isGameOver = true;
        this.world.gamePaused = true;
        this.world.audioManager._pauseAllGameSounds(); // Call audio manager
        this._hideGameElementsAndShowScreen('gameOverScreen');
        updatePausePlayButton();
        this.world._updateLevelDisplay();
    }

    /**
     * Manages the transition and setup for the next game level.
     */
    goToNextLevel() {
        this._resetForNextLevel();
        this._updateStatusBarsForNextLevel();
        this._transitionToGameView();
        this.world.audioManager._playLevelMusic(); // Call audio manager
        this._checkOrientationAndResumeGame();
        updatePausePlayButton();
        this.world._updateLevelDisplay();
    }

    /**
     * Hides core game display elements and shows a specified screen.
     * Note: This function assumes global `document.getElementById` and `document.querySelector` access.
     * @param {string} screenId - The ID of the screen element to show.
     * @private
     */
    _hideGameElementsAndShowScreen(screenId) {
        document.getElementById(screenId).classList.remove('d-none');
        document.getElementById('canvas').classList.add('d-none');
        document.querySelector('.mobile-controls-wrapper').classList.add('d-none');
        document.querySelector('.controls-container').classList.add('d-none');
        this.world.levelDisplayElement.classList.add('d-none');
    }

    /**
     * Resets character and game state for loading the next level.
     * @private
     */
    _resetForNextLevel() {
        this.world.isGameOver = false;
        this.world.character.reset();
        this.world.level = allLevels[this.world.currentLevelIndex];
        this.world.setWorld(); // Re-assign world to new level entities
        this.world.throwableObjects = [];
        this.world.audioManager.bossSoundPlayed = false; // Reset boss sound flag
        this.world.camera_x = 0;
        this.world.gamePaused = false;
    }

    /**
     * Resets and updates all status bars for a new level.
     * @private
     */
    _updateStatusBarsForNextLevel() {
        this.world.statusBar.setPercentage(this.world.character.energy);
        this.world.statusBarBottles.setPercentage(this.world.character.bottles * 20);
        this.world.statusBarCoins.setPercentage(0);
        this.world.endbossHealthBar.setPercentage(100);
    }

    /**
     * Hides the level complete screen and makes the game canvas visible.
     * @private
     */
    _transitionToGameView() {
        document.getElementById('levelCompleteScreen').classList.add('d-none');
        document.getElementById('canvas').classList.remove('d-none');
        this.world.levelDisplayElement.classList.remove('d-none');
    }

    /**
     * Checks the device's orientation and potentially resumes the game.
     * Assumes `checkOrientation` is a globally available function (from ui_management.js).
     * @private
     */
    _checkOrientationAndResumeGame() {
        if (typeof checkOrientation === 'function') {
            checkOrientation();
        }
    }
}
