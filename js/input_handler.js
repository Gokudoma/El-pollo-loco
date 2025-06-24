// js/input_handler.js

/**
 * Resets the state of all keyboard keys to false.
 */
function resetKeyboardState() {
    keyboard.RIGHT = false; // Global variable from main.js
    keyboard.LEFT = false; // Global variable from main.js
    keyboard.UP = false; // Global variable from main.js
    keyboard.DOWN = false; // Global variable from main.js
    keyboard.SPACE = false; // Global variable from main.js
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
 * Adds touch event listeners for mobile controls.
 * @param {string} buttonId - The ID of the HTML button element.
 * @param {string} keyName - The name of the keyboard property to modify (e.g., 'LEFT', 'RIGHT', 'UP', 'SPACE').
 */
function addTouchControls(buttonId, keyName) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyboard[keyName] = true; // Global variable from main.js
        }, { passive: false });
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard[keyName] = false; // Global variable from main.js
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