// js/main.js

let canvas;
let world;
let keyboard = new Keyboard();
let isMutedGlobally;
let currentVolume;
let gameHasStarted = false;

/**
 * Initializes the game core components.
 * This function runs once when the DOM is fully loaded.
 * It sets up the game environment but does NOT start the game display.
 */
function init() {
    canvas = document.getElementById('canvas');
    loadSettings();
    world = new World(canvas, keyboard);

    addMobileEventListeners();
    updateMuteButton();
    setupVolumeSlider();
    setGlobalVolume();
}

// Event listeners for window resize and load
window.addEventListener('resize', checkOrientation);
window.addEventListener('load', checkOrientation);

// The global 'keydown' and 'keyup' listener remains here as it globally controls the keyboard.
window.addEventListener('keydown', (event) => {
    // Only handle keyboard input if the game is actually running and not paused
    // Added a check for gameHasStarted to prevent input on start screen
    if (gameHasStarted && world && !world.isGameOver && !world.isGameWon && !world.gamePaused) {
        handleKeyboardMovement(event, true);
    }
    if (event.keyCode == 13) { // Enter key
        toggleFullscreen();
        event.preventDefault();
    }
});

window.addEventListener('keyup', (event) => {
    // Only handle keyboard input if the game is actually running and not paused
    // Added a check for gameHasStarted to prevent input on start screen
    if (gameHasStarted && world && !world.isGameOver && !world.isGameWon && !world.gamePaused) {
        handleKeyboardMovement(event, false);
    }
});

// Initialize the game once the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
