/**
 * @file This file contains the main game initialization and global event listeners.
 */

/**
 * The HTML canvas element where the game is drawn.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * The main game world instance.
 * @type {World}
 */
let world;

/**
 * Manages the state of keyboard inputs.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Global flag indicating if all sounds are muted.
 * @type {boolean}
 */
let isMutedGlobally;

/**
 * The current global volume level (0.0 to 1.0).
 * @type {number}
 */
let currentVolume;

/**
 * Flag indicating if the game has officially started (after the start screen).
 * @type {boolean}
 */
let gameHasStarted = false;

/**
 * Initializes the game core components that are needed before the game starts.
 * This function runs once when the DOM is fully loaded.
 * It sets up the canvas, loads settings, and prepares UI elements.
 */
function init() {
    canvas = document.getElementById('canvas');
    loadSettings();
    addMobileEventListeners();
    updateMuteButton();
    setupVolumeSlider();
    setGlobalVolume(); // Set initial volume for potential sounds (e.g., if a start screen sound exists later)
}

// Event listeners for window resize and load
window.addEventListener('resize', checkOrientation);
window.addEventListener('load', checkOrientation);

/**
 * Global keydown event listener.
 * Handles keyboard input for movement, actions, and fullscreen toggle.
 * @param {KeyboardEvent} event - The keyboard event.
 */
window.addEventListener('keydown', (event) => {
    // Only handle keyboard input if the game is actually running and not paused
    // Added a check for gameHasStarted to prevent input on start screen
    if (gameHasStarted && world && !world.isGameOver && !world.isGameWon && !world.gamePaused) {
        handleKeyboardMovement(event, true);
    }
    if (event.keyCode == 13) { // Enter key
        // Fullscreen toggle should work even if game hasn't started yet
        toggleFullscreen();
        event.preventDefault();
    }
});

/**
 * Global keyup event listener.
 * Handles keyboard input for releasing keys.
 * @param {KeyboardEvent} event - The keyboard event.
 */
window.addEventListener('keyup', (event) => {
    // Only handle keyboard input if the game is actually running and not paused
    // Added a check for gameHasStarted to prevent input on start screen
    if (gameHasStarted && world && !world.isGameOver && !world.isGameWon && !world.gamePaused) {
        handleKeyboardMovement(event, false);
    }
});

// Initialize the game once the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
