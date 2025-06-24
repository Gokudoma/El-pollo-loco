// js/game_state.js

/**
 * Starts the game. This function is called when the user clicks the 'Start Game' button.
 * It makes the game canvas visible and initiates game-specific processes.
 */
function startGame() {
    gameHasStarted = true; // <<< NEU: Setzt den Status, dass das Spiel gestartet wurde

    document.getElementById('startScreen').classList.add('d-none'); // Hide the start screen
    document.getElementById('canvas').classList.remove('d-none'); // Show the game canvas

    // The 'init()' call is REMOVED from here. 'init()' should only be called once on DOMContentLoaded.
    // The 'world' object and other core setups are handled by 'init()' in main.js
    // which runs when the page loads.

    // Play the level sound.
    // It's crucial that 'world' (and thus 'world.levelSound') is initialized by 'init()' first.
    if (world && world.levelSound) {
        playLevelSound();
    }

    resetKeyboardState();
    checkOrientation(); // This call will now correctly show controls and canvas because gameHasStarted is true
    activateFullscreenOnTouch();
}

/**
 * Restarts the game by reloading the page and resetting keyboard state.
 */
function restartGame() {
    location.reload();
    // gameHasStarted = false; // Reset if needed, but reload handles full reset
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