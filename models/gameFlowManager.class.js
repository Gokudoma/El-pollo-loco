/**
 * Manages the overall game flow, like level progression and game states.
 */
class GameFlowManager {
    world;

    /**
     * Creates an instance of GameFlowManager.
     * @param {World} world - The world instance.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks if the level completion conditions are met.
     */
    checkLevelCompletion() {
        const allCoinsCollected = this.world.level.coins.length === 0;
        const endbossDefeated = this.world.level.endboss && this.world.level.endboss.isDead();

        if (allCoinsCollected && endbossDefeated) {
            this.levelComplete();
        }
    }

    /**
     * Advances to the next level or triggers game won state.
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
     * Displays the level complete screen.
     */
    showLevelCompleteScreen() {
        this.world.isGameOver = true;
        this.world.gamePaused = true;
        this.world.audioManager._pauseAllGameSounds();
        this._hideGameElementsAndShowScreen('levelCompleteScreen');
        updatePausePlayButton();
        this.world._updateLevelDisplay();
    }

    /**
     * Sets the game to 'won' state.
     */
    gameWon() {
        this.world.isGameWon = true;
        this.world.isGameOver = true;
        this.world.gamePaused = true;
        this.world.audioManager._pauseAllGameSounds();
        this._hideGameElementsAndShowScreen('gameWonScreen');
        updatePausePlayButton();
        this.world._updateLevelDisplay();
    }

    /**
     * Sets the game to 'game over' state.
     */
    endGame() {
        this.world.isGameOver = true;
        this.world.gamePaused = true;
        this.world.audioManager._pauseAllGameSounds();
        this._hideGameElementsAndShowScreen('gameOverScreen');
        updatePausePlayButton();
        this.world._updateLevelDisplay();
    }

    /**
     * Sets up the next game level.
     */
    goToNextLevel() {
        this._resetForNextLevel();
        this._updateStatusBarsForNextLevel();
        this._transitionToGameView();
        this.world.audioManager._playLevelMusic();
        this._checkOrientationAndResumeGame();
        updatePausePlayButton();
        this.world._updateLevelDisplay();
    }

    /**
     * Hides game elements and shows a specific screen.
     * @param {string} screenId - The ID of the screen to show.
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
     * Resets game state for the next level.
     * @private
     */
    _resetForNextLevel() {
        this.world.isGameOver = false;
        this.world.character.reset();
        this.world.level = allLevels[this.world.currentLevelIndex](); // <-- MODIFIED
        this.world.setWorld();
        this.world.throwableObjects = [];
        this.world.audioManager.bossSoundPlayed = false;
        this.world.camera_x = 0;
        this.world.gamePaused = false;
    }

    /**
     * Resets status bars for the new level.
     * @private
     */
    _updateStatusBarsForNextLevel() {
        this.world.statusBar.setPercentage(this.world.character.energy);
        this.world.statusBarBottles.setPercentage(this.world.character.bottles * 20);
        this.world.statusBarCoins.setPercentage(0);
        this.world.endbossHealthBar.setPercentage(100);
    }

    /**
     * Transitions the view back to the game canvas.
     * @private
     */
    _transitionToGameView() {
        document.getElementById('levelCompleteScreen').classList.add('d-none');
        document.getElementById('canvas').classList.remove('d-none');
        this.world.levelDisplayElement.classList.remove('d-none');
    }

    /**
     * Checks orientation and resumes game.
     * @private
     */
    _checkOrientationAndResumeGame() {
        if (typeof checkOrientation === 'function') {
            checkOrientation();
        }
    }
}