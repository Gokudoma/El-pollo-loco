// js/game_state.js

/**
 * Starts the game, initializes, and sets up the initial state.
 */
function startGame() {
    document.getElementById('startScreen').classList.add('d-none');
    init(); // From main.js (or better: call init() directly in main.js and only the game start logic here)
    resetKeyboardState(); // From input_handler.js
    checkOrientation(); // From ui_management.js
    playLevelSound(); // From sound_manager.js
    activateFullscreenOnTouch(); // From fullscreen_handler.js
}

/**
 * Restarts the game by reloading the page and resetting keyboard state.
 */
function restartGame() {
    location.reload();
    resetKeyboardState(); // From input_handler.js
}

/**
 * Advances the game to the next level if a world instance exists.
 */
function goToNextLevelFromButton() {
    if (world) { // Global variable from main.js
        world.goToNextLevel();
        resetKeyboardState(); // From input_handler.js
    }
}