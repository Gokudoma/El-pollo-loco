// js/ui_management.js

/**
 * Checks if the current device is a touch device.
 * @returns {boolean} True if it's a touch device, false otherwise.
 */
function isTouchDevice() {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
}

/**
 * Retrieves all relevant game UI elements.
 * @returns {Object} An object containing references to various DOM elements.
 */
function getGameUIElements() {
    return {
        orientationMessage: document.getElementById('orientationMessage'),
        canvasElement: document.getElementById('canvas'),
        mobileControls: document.querySelector('.mobile-controls-wrapper'),
        controlsContainer: document.querySelector('.controls-container'),
        startScreen: document.getElementById('startScreen'),
        gameOverScreen: document.getElementById('gameOverScreen'),
        levelCompleteScreen: document.getElementById('levelCompleteScreen'),
        gameWonScreen: document.getElementById('gameWonScreen'),
        explanationModal: document.getElementById('explanationModal'),
        gameWrapper: document.querySelector('.game-wrapper')
    };
}

/**
 * Hides all main game UI elements by adding 'd-none' class.
 * @param {Object} elements - Object containing references to DOM elements.
 */
function hideAllGameElements(elements) {
    elements.orientationMessage.classList.add('d-none');
    elements.canvasElement.classList.add('d-none');
    elements.startScreen.classList.add('d-none');
    elements.gameOverScreen.classList.add('d-none');
    elements.levelCompleteScreen.classList.add('d-none');
    elements.gameWonScreen.classList.add('d-none');
    elements.explanationModal.classList.add('d-none');
    elements.mobileControls.classList.add('d-none');
    elements.mobileControls.classList.remove('mobile-controls-active'); // Ensure mobile controls are fully hidden
    elements.controlsContainer.classList.add('d-none');
    elements.gameWrapper.classList.add('d-none'); // Hide the entire game wrapper
}

/**
 * Shows the main game wrapper.
 * @param {Object} elements - Object containing references to DOM elements.
 */
function showGameWrapper(elements) {
    elements.gameWrapper.classList.remove('d-none');
}

/**
 * Handles the display logic when the explanation modal is open.
 * @param {Object} elements - Object containing references to DOM elements.
 * @param {boolean} isModalOpen - True if the modal is currently open.
 * @returns {boolean} True if modal was open and handled, false otherwise.
 */
function handleModalOpen(elements, isModalOpen) {
    if (isModalOpen) {
        elements.explanationModal.classList.remove('d-none');
        return true;
    }
    return false;
}

/**
 * Handles the display of the orientation message for touch devices.
 * @param {Object} elements - Object containing references to DOM elements.
 * @param {boolean} touchDevice - True if the device is a touch device.
 * @returns {boolean} True if orientation message was shown, false otherwise.
 */
function handleOrientationMessage(elements, touchDevice) {
    if (window.innerHeight > window.innerWidth && touchDevice) {
        elements.orientationMessage.classList.remove('d-none');
        return true;
    }
    return false;
}

/**
 * Sets the dimensions of the game wrapper based on fullscreen and touch device status.
 * @param {Object} elements - Object containing references to DOM elements.
 * @param {boolean} touchDevice - True if the device is a touch device.
 * @param {boolean} isFullscreen - True if the game is in fullscreen mode.
 */
function setGameWrapperDimensions(elements, touchDevice, isFullscreen) {
    if (isFullscreen || touchDevice) {
        elements.gameWrapper.style.width = '100vw';
        elements.gameWrapper.style.height = '100vh';
        elements.gameWrapper.style.marginBottom = '';
    } else {
        elements.gameWrapper.style.width = '720px';
        elements.gameWrapper.style.height = '480px';
        elements.gameWrapper.style.marginBottom = '20px';
    }
}

/**
 * Displays the appropriate game screen and controls based on game state and device type.
 * @param {Object} elements - Object containing references to DOM elements.
 * @param {boolean} gameIsRunning - True if the game is currently running.
 * @param {boolean} touchDevice - True if the device is a touch device.
 * @param {boolean} isFullscreen - True if the game is in fullscreen mode.
 * @param {boolean} gameHasStarted - NEW: True if the game has been explicitly started by user.
 */
function displayGameElementsBasedOnState(elements, gameIsRunning, touchDevice, isFullscreen, gameHasStarted) {
    if (gameHasStarted) { // Only show canvas if the game has explicitly started
        if (gameIsRunning) {
            elements.canvasElement.classList.remove('d-none');
        } else {
            // Show game over/level complete/game won screens if game is not running but has started
            if (!elements.gameWonScreen.classList.contains('d-none')) {
                elements.gameWonScreen.classList.remove('d-none');
            } else if (!elements.levelCompleteScreen.classList.contains('d-none')) {
                elements.levelCompleteScreen.classList.remove('d-none');
            } else if (!elements.gameOverScreen.classList.contains('d-none')) {
                elements.gameOverScreen.classList.remove('d-none');
            } else {
                // If game ended and no specific end screen is active, go back to start screen
                elements.startScreen.classList.remove('d-none');
            }
        }
        // Controls are displayed only if game has started (either running or on an end screen)
        displayControls(elements, touchDevice, isFullscreen);
    } else {
        // If the game has NOT started, always show the start screen
        elements.startScreen.classList.remove('d-none');
        elements.controlsContainer.classList.remove('d-none'); // Desktop controls should be visible on start screen too
    }
}

/**
 * Displays mobile or desktop controls based on device type and fullscreen status.
 * @param {Object} elements - Object containing references to DOM elements.
 * @param {boolean} touchDevice - True if the device is a touch device.
 * @param {boolean} isFullscreen - True if the game is in fullscreen mode.
 */
function displayControls(elements, touchDevice, isFullscreen) {
    if (touchDevice || isFullscreen) {
        elements.mobileControls.classList.remove('d-none');
        elements.mobileControls.classList.add('mobile-controls-active');
        elements.controlsContainer.classList.add('d-none'); // Hide desktop controls if mobile/fullscreen active
    } else {
        elements.controlsContainer.classList.remove('d-none');
        elements.mobileControls.classList.add('d-none'); // Hide mobile controls if desktop/not fullscreen
        elements.mobileControls.classList.remove('mobile-controls-active');
    }
}

/**
 * Checks and updates the orientation and visibility of game elements.
 */
function checkOrientation() {
    const elements = getGameUIElements();
    const gameIsRunning = world && !world.isGameOver && !world.isGameWon; // 'world' assumed global
    const isModalOpen = !elements.explanationModal.classList.contains('d-none');
    const touchDevice = isTouchDevice();
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

    // We need a global variable to track if the game has been explicitly started by the user.
    // Assuming 'gameHasStarted' is a global boolean, e.g., defined in main.js or game_state.js
    // and set to 'true' in startGame().
    // For now, let's assume it's defined and passed or globally available.
    // If not, you need to define it: `let gameHasStarted = false;` in main.js/game_state.js

    // First, hide everything, then decide what to show
    hideAllGameElements(elements);

    // If modal is open, only show modal and return
    if (isModalOpen) {
        elements.explanationModal.classList.remove('d-none');
        return; // Stop further display logic
    }

    // If orientation message is needed, show it and return
    if (handleOrientationMessage(elements, touchDevice)) {
        return; // Stop further display logic
    }

    // If neither modal nor orientation message, show the game wrapper and then its contents
    showGameWrapper(elements);
    setGameWrapperDimensions(elements, touchDevice, isFullscreen);
    // Pass the new global variable 'gameHasStarted' to the display function
    displayGameElementsBasedOnState(elements, gameIsRunning, touchDevice, isFullscreen, gameHasStarted);
}


/**
 * Toggles the visibility of the explanation modal and pauses/resumes game.
 */
function toggleExplanationModal() {
    const elements = getGameUIElements();

    if (elements.explanationModal.classList.contains('d-none')) {
        // Modal is currently hidden, so show it
        hideAllGameElements(elements); // Hide everything else
        elements.explanationModal.classList.remove('d-none'); // Show only the modal
        if (typeof pauseGameSounds === 'function') {
            pauseGameSounds();
        }
        if (world) {
            world.gamePaused = true;
        }

    } else {
        // Modal is currently visible, so hide it
        elements.explanationModal.classList.add('d-none');
        if (typeof resumeGameSounds === 'function') {
            resumeGameSounds();
        }
        if (world) {
            world.gamePaused = false;
        }
        checkOrientation(); // Re-evaluate screen state (e.g., show start screen or game)
    }
}