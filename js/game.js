let canvas;
let world;
let keyboard = new Keyboard(); // Annahme: Keyboard Klasse ist definiert
let isMutedGlobally;
let currentVolume;

 /* Loads mute and volume settings from local storage. */
function loadSettings() {
    isMutedGlobally = JSON.parse(localStorage.getItem('isMutedGlobally')) || false;
    currentVolume = parseFloat(localStorage.getItem('currentVolume')) || 1.0;
}

/**
 * Saves mute and volume settings to local storage.
 */
function saveSettings() {
    localStorage.setItem('isMutedGlobally', JSON.stringify(isMutedGlobally));
    localStorage.setItem('currentVolume', currentVolume);
}

/**
 * Resets the state of all keyboard keys to false.
 */
function resetKeyboardState() {
    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
}

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
    elements.mobileControls.classList.remove('mobile-controls-active');
    elements.controlsContainer.classList.add('d-none');
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
 */
function displayGameElementsBasedOnState(elements, gameIsRunning, touchDevice, isFullscreen) {
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
    } else {
        elements.controlsContainer.classList.remove('d-none');
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

    if (handleModalOpen(elements, isModalOpen)) return;
    if (handleOrientationMessage(elements, touchDevice)) return;

    setGameWrapperDimensions(elements, touchDevice, isFullscreen);
    displayGameElementsBasedOnState(elements, gameIsRunning, touchDevice, isFullscreen);
}

/**
 * Initializes the game.
 */
function init() {
    canvas = document.getElementById('canvas');
    loadSettings();
    world = new World(canvas, keyboard); // Annahme: World Klasse ist definiert
    addMobileEventListeners();
    updateMuteButton();
    setupVolumeSlider();
    setGlobalVolume();
}

/**
 * Activates fullscreen mode if it's a touch device.
 */
function activateFullscreenOnTouch() {
    if (isTouchDevice()) {
        toggleFullscreen();
    }
}

/**
 * Plays the level sound if the game world exists and is not muted.
 */
function playLevelSound() {
    if (world && !isMutedGlobally) {
        world.levelSound.play();
        world.levelSoundPlaying = true;
    }
}

/**
 * Starts the game, initializes, and sets up the initial state.
 */
function startGame() {
    document.getElementById('startScreen').classList.add('d-none');
    init();
    resetKeyboardState();
    checkOrientation();
    playLevelSound();
    activateFullscreenOnTouch();
}

/**
 * Handles requesting fullscreen for the game wrapper.
 * @param {HTMLElement} gameWrapper - The game wrapper element.
 */
function requestFullscreenWrapper(gameWrapper) {
    if (gameWrapper.requestFullscreen) {
        gameWrapper.requestFullscreen();
    } else if (gameWrapper.webkitRequestFullscreen) {
        gameWrapper.webkitRequestFullscreen();
    } else if (gameWrapper.msRequestFullscreen) {
        gameWrapper.msRequestFullscreen();
    }
}

/**
 * Handles exiting fullscreen.
 */
function exitFullscreenWrapper() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/**
 * Updates the text content of the fullscreen button.
 * @param {boolean} isCurrentlyFullscreen - True if currently in fullscreen.
 */
function updateFullscreenButtonText(isCurrentlyFullscreen) {
    const btn = document.getElementById('fullscreenBtn');
    if (btn) {
        btn.innerText = isCurrentlyFullscreen ? 'Fenstermodus' : 'Vollbild';
    }
}

/**
 * Toggles fullscreen mode for the game wrapper.
 */
function toggleFullscreen() {
    let gameWrapper = document.querySelector('.game-wrapper');
    let isCurrentlyFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

    if (!isCurrentlyFullscreen) {
        requestFullscreenWrapper(gameWrapper);
        gameWrapper.classList.add('fullscreen-active');
    } else {
        exitFullscreenWrapper();
        gameWrapper.classList.remove('fullscreen-active');
    }
    updateFullscreenButtonText(isCurrentlyFullscreen);
    setTimeout(checkOrientation, 100);
}

// Event listeners for fullscreen changes
document.addEventListener('fullscreenchange', checkOrientation);
document.addEventListener('webkitfullscreenchange', checkOrientation);
document.addEventListener('mozfullscreenchange', checkOrientation);
document.addEventListener('MSFullscreenChange', checkOrientation);

/**
 * Toggles the global mute state and updates related settings.
 */
function toggleMute() {
    isMutedGlobally = !isMutedGlobally;
    saveSettings();
    setGlobalVolume();
    updateMuteButton();
}

/**
 * Updates the text/icon of the mute buttons.
 */
function updateMuteButton() {
    const muteBtn = document.getElementById('muteBtn');
    const muteMobileBtn = document.getElementById('muteMobileBtn');

    if (muteBtn) {
        muteBtn.innerText = isMutedGlobally ? 'Sound An' : 'Sound Mute';
    }
    if (muteMobileBtn) {
        muteMobileBtn.innerText = isMutedGlobally ? '🔇' : '🔊';
    }
}

/**
 * Sets up an individual volume slider with its event listener.
 * @param {string} sliderId - The ID of the volume slider element.
 */
function setupSingleVolumeSlider(sliderId) {
    const volumeSlider = document.getElementById(sliderId);
    if (volumeSlider) {
        volumeSlider.value = currentVolume;
        volumeSlider.addEventListener('input', (e) => {
            currentVolume = parseFloat(e.target.value);
            saveSettings();
            setGlobalVolume();
        });
    }
}

/**
 * Sets up the volume sliders for desktop and mobile.
 */
function setupVolumeSlider() {
    setupSingleVolumeSlider('volumeSlider');
    setupSingleVolumeSlider('volumeSliderMobile');
}

/**
 * Sets the volume for a given sound object.
 * @param {HTMLAudioElement} sound - The audio element to set the volume for.
 * @param {number} volumeToSet - The volume level to set.
 */
function setSoundVolume(sound, volumeToSet) {
    if (sound) {
        sound.volume = volumeToSet;
    }
}

/**
 * Handles playing/pausing character specific sounds (steps, snoring).
 * @param {HTMLAudioElement} sound - The character's sound object.
 * @param {string} soundPlayingProp - The property name indicating if the sound is playing (e.g., 'stepsSoundPlaying').
 * @param {function} conditionFn - A function that returns true if the sound should be playing.
 */
function handleCharacterSoundPlayback(sound, soundPlayingProp, conditionFn) {
    if (!sound) return;

    sound.volume = isMutedGlobally ? 0 : currentVolume;

    if (isMutedGlobally && world.character[soundPlayingProp]) {
        sound.pause();
        world.character[soundPlayingProp] = false;
    } else if (!isMutedGlobally && !world.character[soundPlayingProp] && conditionFn()) {
        sound.play();
        world.character[soundPlayingProp] = true;
    }
}

/**
 * Sets the global volume for all game sounds.
 */
function setGlobalVolume() {
    if (!world) return;

    const volumeToSet = isMutedGlobally ? 0 : currentVolume;

    setSoundVolume(world.levelSound, volumeToSet);
    setSoundVolume(world.chickenSound, volumeToSet);
    setSoundVolume(world.chickenBossDieSound, volumeToSet);
    setSoundVolume(world.brokenBottleSound, volumeToSet);

    if (world.character) {
        setSoundVolume(world.character.jumpSound, volumeToSet);
        setSoundVolume(world.character.hitSound, volumeToSet);
        setSoundVolume(world.character.deathSound, volumeToSet);

        handleCharacterSoundPlayback(world.character.stepsSound, 'stepsSoundPlaying',
            () => (world.keyboard.RIGHT || world.keyboard.LEFT) && !world.character.isAboveGround());

        handleCharacterSoundPlayback(world.character.snoringSound, 'snoringSoundPlaying',
            () => (new Date().getTime() - world.character.lastMoveTime > 8000) &&
                  !world.character.isAboveGround() && !world.character.isHurt() && !world.character.isDead());
    }
}

/**
 * Pauses all relevant game sounds.
 */
function pauseGameSounds() {
    if (world) {
        world.gamePaused = true;
        world.levelSound.pause();
        world.chickenSound.pause();
        if (world.character) {
            world.character.stepsSound.pause();
            world.character.snoringSound.pause();
        }
    }
}

/**
 * Resumes game sounds based on mute settings.
 */
function resumeGameSounds() {
    if (world) {
        world.gamePaused = false;
        if (!isMutedGlobally) {
            world.levelSound.play();
        }
    }
}

/**
 * Toggles the visibility of the explanation modal and pauses/resumes game.
 */
function toggleExplanationModal() {
    const elements = getGameUIElements();

    if (elements.explanationModal.classList.contains('d-none')) {
        elements.explanationModal.classList.remove('d-none');
        pauseGameSounds();
        hideAllGameElements(elements); // Hide other elements when modal is open
    } else {
        elements.explanationModal.classList.add('d-none');
        resumeGameSounds();
        checkOrientation();
    }
}

/**
 * Restarts the game by reloading the page and resetting keyboard state.
 */
function restartGame() {
    location.reload();
    resetKeyboardState();
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

/**
 * Handles keyboard input for movement and actions.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {boolean} isKeyDown - True if it's a keydown event, false for keyup.
 */
function handleKeyboardMovement(event, isKeyDown) {
    if (event.keyCode == 39) { // Right arrow
        keyboard.RIGHT = isKeyDown;
    } else if (event.keyCode == 37) { // Left arrow
        keyboard.LEFT = isKeyDown;
    } else if (event.keyCode == 38) { // Up arrow
        keyboard.UP = isKeyDown;
    } else if (event.keyCode == 40) { // Down arrow
        keyboard.DOWN = isKeyDown;
    } else if (event.keyCode == 32) { // Spacebar
        keyboard.SPACE = isKeyDown;
        if (isKeyDown) event.preventDefault();
    }
}

/**
 * Handles global keydown events.
 */
window.addEventListener('keydown', (event) => {
    if (world && !world.isGameOver && !world.isGameWon && !world.gamePaused) {
        handleKeyboardMovement(event, true);
    }
    if (event.keyCode == 13) { // Enter key
        toggleFullscreen();
        event.preventDefault();
    }
});

/**
 * Handles global keyup events.
 */
window.addEventListener('keyup', (event) => {
    if (world && !world.isGameOver && !world.isGameWon && !world.gamePaused) {
        handleKeyboardMovement(event, false);
    }
});

/**
 * Adds touch event listeners for mobile controls.
 * @param {string} buttonId - The ID of the HTML button element.
 * @param {string} keyName - The name of the keyboard property to modify (e.g., 'LEFT', 'RIGHT', 'UP', 'SPACE').
 */
function addTouchControls(buttonId, keyName) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyboard[keyName] = true;
        }, { passive: false });
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard[keyName] = false;
        }, { passive: false });
    }
}

/**
 * Attaches touch event listeners to all mobile control buttons.
 */
function addMobileEventListeners() {
    addTouchControls('btnLeft', 'LEFT');
    addTouchControls('btnRight', 'RIGHT');
    addTouchControls('btnJump', 'UP');
    addTouchControls('btnThrow', 'SPACE');
}

// Event listeners for window resize and load
window.addEventListener('resize', checkOrientation);
window.addEventListener('load', checkOrientation);
