// js/main.js

let canvas;
let world;
let keyboard = new Keyboard(); // Assumption: Keyboard class is defined
let isMutedGlobally;
let currentVolume;

/**
 * Initializes the game.
 */
function init() {
    canvas = document.getElementById('canvas');
    loadSettings(); // From game_settings.js
    world = new World(canvas, keyboard); // Assumption: World class is defined
    addMobileEventListeners(); // From input_handler.js
    updateMuteButton(); // From sound_manager.js
    setupVolumeSlider(); // From sound_manager.js
    setGlobalVolume(); // From sound_manager.js
}

// Event listeners for window resize and load
window.addEventListener('resize', checkOrientation); // From ui_management.js
window.addEventListener('load', checkOrientation); // From ui_management.js

// The global 'keydown' and 'keyup' listener remains here as it globally controls the keyboard.
window.addEventListener('keydown', (event) => {
    if (world && !world.isGameOver && !world.isGameWon && !world.gamePaused) {
        handleKeyboardMovement(event, true); // From input_handler.js
    }
    if (event.keyCode == 13) { // Enter key
        toggleFullscreen(); // From fullscreen_handler.js
        event.preventDefault();
    }
});

window.addEventListener('keyup', (event) => {
    if (world && !world.isGameOver && !world.isGameWon && !world.gamePaused) {
        handleKeyboardMovement(event, false); // From input_handler.js
    }
});

// Initialize the game once the DOM is loaded
document.addEventListener('DOMContentLoaded', init);