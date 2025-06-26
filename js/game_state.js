/**
 * Starts the game. This function is called when the user clicks the 'Start Game' button.
 * It makes the game canvas visible and initiates game-specific processes.
 */
function startGame() {
    gameHasStarted = true;

    document.getElementById('startScreen').classList.add('d-none'); // Hide the start screen
    document.getElementById('canvas').classList.remove('d-none'); // Show the game canvas
    document.getElementById('levelDisplay').classList.remove('d-none'); // Show the level display

    if (world && world.levelSound) {
        playLevelSound();
    }

    resetKeyboardState();
    checkOrientation();
}

/**
 * Restarts the game by reloading the page and resetting keyboard state.
 */
function restartGame() {
    location.reload();
}

/**
 * Advances the game to the next level if a world instance exists.
 */
function goToNextLevelFromButton() {
    if (world) {
        world.goToNextLevel();
        resetKeyboardState();
    }
}
