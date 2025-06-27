/**
 * @file Manages the overall game state, including starting and restarting the game,
 * and handling transitions between levels.
 */

/**
 * Initializes the game world and starts the game.
 */
function startGame() {
    // Ensure the canvas and keyboard are available globally or passed correctly
    if (typeof canvas !== 'undefined' && typeof Keyboard !== 'undefined') {
        world = new World(canvas, keyboard);
        gameHasStarted = true;
        document.getElementById('startScreen').classList.add('d-none');
        document.getElementById('canvas').classList.remove('d-none');
        document.querySelector('.controls-container').classList.remove('d-none');
        document.getElementById('levelDisplay').classList.remove('d-none');
        checkOrientation(); // Re-check orientation to show mobile controls if needed
        playLevelSound(); // Start background music
    } else {
        console.error("Canvas or Keyboard not initialized. Cannot start game.");
    }
}

/**
 * Function to go to the next level from a button click.
 * Delegates the call to the gameFlowManager within the world instance.
 */
function goToNextLevelFromButton() {
    if (world && world.gameFlowManager) {
        world.gameFlowManager.goToNextLevel(); // Corrected call
    }
}

/**
 * Function to restart the game from a button click.
 * Delegates the call to the gameFlowManager within the world instance.
 */
function restartGame() {
    if (world && world.gameFlowManager) {
        // To restart, we can simply go to the first level (index 0)
        world.currentLevelIndex = 0; // Reset level index
        world.gameFlowManager.goToNextLevel(); // This will re-initialize the first level
    }
}
