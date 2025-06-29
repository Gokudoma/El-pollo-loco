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
 * @returns {Object} An object containing references to various UI elements.
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
 * @param {Object} elements - An object containing references to UI elements.
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
    elements.mobileControls.classList.remove('mobile-controls-active');
    elements.controlsContainer.classList.add('d-none');
    elements.gameWrapper.classList.add('d-none');
}

/**
 * Shows the main game wrapper.
 * @param {Object} elements - An object containing references to UI elements.
 */
function showGameWrapper(elements) {
    elements.gameWrapper.classList.remove('d-none');
}

/**
 * Handles the display logic when the explanation modal is open.
 * @param {Object} elements - An object containing references to UI elements.
 * @param {boolean} isModalOpen - True if the modal is currently open.
 * @returns {boolean} True if the modal is displayed, false otherwise.
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
 * @param {Object} elements - An object containing references to UI elements.
 * @param {boolean} touchDevice - True if the device is a touch device.
 * @returns {boolean} True if the orientation message is displayed, false otherwise.
 */
function handleOrientationMessage(elements, touchDevice) {
    if (window.innerHeight > window.innerWidth && touchDevice) {
        elements.orientationMessage.classList.remove('d-none');
        return true;
    } else {
        elements.orientationMessage.classList.add('d-none');
        return false;
    }
}

/**
 * Sets the dimensions of the game wrapper based on fullscreen and touch device status.
 * @param {Object} elements - An object containing references to UI elements.
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
 * @param {Object} elements - An object containing references to UI elements.
 * @param {boolean} gameIsRunning - True if the game is currently running (not game over or won).
 * @param {boolean} touchDevice - True if the device is a touch device.
 * @param {boolean} isFullscreen - True if the game is in fullscreen mode.
 * @param {boolean} gameHasStarted - True if the game has been started at least once.
 */
function displayGameElementsBasedOnState(elements, gameIsRunning, touchDevice, isFullscreen, gameHasStarted) {
    if (gameHasStarted) {
        if (gameIsRunning) {
            elements.canvasElement.classList.remove('d-none');
        } else {
            if (!elements.gameWonScreen.classList.contains('d-none')) {
                elements.gameWonScreen.classList.remove('d-none');
            } else if (!elements.levelCompleteScreen.classList.contains('d-none')) {
                elements.levelCompleteScreen.classList.remove('d-none');
            } else if (!elements.gameOverScreen.classList.contains('d-none')) {
                elements.gameOverScreen.classList.remove('d-none');
            } else {
                elements.startScreen.classList.remove('d-none');
            }
        }
        displayControls(elements, touchDevice, isFullscreen);
    } else {
        elements.startScreen.classList.remove('d-none');
        elements.controlsContainer.classList.remove('d-none');
    }
}

/**
 * Displays mobile or desktop controls based on device type and fullscreen status.
 * @param {Object} elements - An object containing references to UI elements.
 * @param {boolean} touchDevice - True if the device is a touch device.
 * @param {boolean} isFullscreen - True if the game is in fullscreen mode.
 */
function displayControls(elements, touchDevice, isFullscreen) {
    if (touchDevice || isFullscreen) {
        elements.mobileControls.classList.remove('d-none');
        elements.mobileControls.classList.add('mobile-controls-active');
        elements.controlsContainer.classList.add('d-none');
    } else {
        elements.controlsContainer.classList.remove('d-none');
        elements.mobileControls.classList.add('d-none');
        elements.mobileControls.classList.remove('mobile-controls-active');
    }
}

/**
 * Checks and updates the orientation and visibility of game elements.
 */
function checkOrientation() {
    const elements = getGameUIElements();
    const gameIsRunning = world && !world.isGameOver && !world.isGameWon;
    const isModalOpen = !elements.explanationModal.classList.contains('d-none');
    const touchDevice = isTouchDevice();
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

    hideAllGameElements(elements);

    if (isModalOpen) {
        elements.explanationModal.classList.remove('d-none');
        return;
    }

    if (handleOrientationMessage(elements, touchDevice)) {
        elements.orientationMessage.classList.remove('d-none');
        return;
    }

    showGameWrapper(elements);
    setGameWrapperDimensions(elements, touchDevice, isFullscreen);
    displayGameElementsBasedOnState(elements, gameIsRunning, touchDevice, isFullscreen, gameHasStarted);
}

/**
 * Toggles the visibility of the explanation modal and pauses/resumes game.
 */
function toggleExplanationModal(event) {
    const elements = getGameUIElements();

    if (elements.explanationModal.classList.contains('d-none')) {
        // Opening modal
        hideAllGameElements(elements);
        elements.explanationModal.classList.remove('d-none');
        if (world) {
            world.gamePaused = true;
            pauseGameSounds();
        }
    } else {
        // Closing modal
        elements.explanationModal.classList.add('d-none');
        if (world) {
            world.gamePaused = false;
            resumeGameSounds();
        }
        checkOrientation();
    }
    updatePausePlayButton(); // Update the pause/play button text
    if (event) {
        event.stopPropagation();
    }
}

/**
 * Toggles the game's pause state and updates the pause/play button text.
 */
function togglePausePlay() {
    if (!world) return; // Ensure world is initialized

    world.gamePaused = !world.gamePaused;

    if (world.gamePaused) {
        pauseGameSounds();
    } else {
        resumeGameSounds();
    }
    updatePausePlayButton();
}

/**
 * Updates the text of the pause/play button based on the game's pause state.
 */
function updatePausePlayButton() {
    const pausePlayBtn = document.getElementById('pausePlayBtn');
    if (pausePlayBtn && world) {
        pausePlayBtn.innerText = world.gamePaused ? 'Play' : 'Pause';
    }
}

/**
 * Attaches event listeners for the explanation modal to close it when clicking outside its content.
 */
document.addEventListener('DOMContentLoaded', () => {
    const explanationModal = document.getElementById('explanationModal');
    const explanationModalContent = document.querySelector('.explanation-modal-content');

    if (explanationModal && explanationModalContent) {
        document.addEventListener('click', (event) => {
            if (!explanationModal.classList.contains('d-none')) {
                if (!explanationModalContent.contains(event.target) && event.target !== document.getElementById('explanationBtn') && event.target.className !== 'close-button') {
                    toggleExplanationModal();
                }
            }
        });
    }
});

/**
 * Function to go to the next level from a button click.
 * Assumes `world` and `gameFlowManager` are globally accessible.
 */
function goToNextLevelFromButton() {
    if (world && world.gameFlowManager) {
        world.gameFlowManager.goToNextLevel();
    }
}

/**
 * Function to restart the game from a button click.
 * Assumes `world` and `gameFlowManager` are globally accessible.
 */
function restartGame() {
    if (world && world.gameFlowManager) {
        world.gameFlowManager.goToNextLevel(); // Effectively restarts by going to level 1
    }
}
