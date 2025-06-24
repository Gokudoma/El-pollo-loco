// js/fullscreen_handler.js

/**
 * Activates fullscreen mode if it's a touch device.
 */
function activateFullscreenOnTouch() {
    if (isTouchDevice()) { // From ui_management.js
        toggleFullscreen();
    }
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
    setTimeout(checkOrientation, 100); // From ui_management.js
}

// Event listeners for fullscreen changes
document.addEventListener('fullscreenchange', checkOrientation); // From ui_management.js
document.addEventListener('webkitfullscreenchange', checkOrientation); // From ui_management.js
document.addEventListener('mozfullscreenchange', checkOrientation); // From ui_management.js
document.addEventListener('MSFullscreenChange', checkOrientation); // From ui_management.js