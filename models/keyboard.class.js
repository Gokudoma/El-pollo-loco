/**
 * Represents the state of keyboard keys for game input.
 * Each property corresponds to a specific key and is true when the key is pressed, false otherwise.
 */
class Keyboard {
    /**
     * Creates an instance of Keyboard.
     * Initializes all key states to false.
     */
    constructor() {
        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.DOWN = false;
        this.SPACE = false;
    }
}
