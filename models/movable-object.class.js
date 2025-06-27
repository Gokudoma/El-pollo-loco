/**
 * Represents a movable object in the game, extending the DrawableObject.
 * Provides properties and methods for movement, gravity, collision detection,
 * health, and animation.
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    animationFrameSkip = 0;
    animationSkipThreshold = 7;
    world = null;

    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    };

    /**
     * Creates an instance of MovableObject.
     * Calls the constructor of the parent class, DrawableObject.
     */
    constructor() {
        super(); // Call the constructor of the parent class
    }

    /**
     * Checks if gravity should be applied or stopped based on object type and state.
     * @returns {boolean} True if gravity interval should be cleared, false otherwise.
     * @private
     */
    _shouldStopGravity() {
        if (this instanceof Character && this.isDead()) {
            return true;
        }
        if (this instanceof ThrowableObject && this.isSplashing) {
            clearInterval(this.gravityInterval);
            return true;
        }
        return false;
    }

    /**
     * Applies gravitational effect to the object, reducing its vertical speed.
     */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            // Gravity should not apply if the game is paused
            if (this.world && this.world.gamePaused) {
                return;
            }

            if (this._shouldStopGravity()) {
                return;
            }

            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks if the object is currently above the ground level.
     * For ThrowableObjects, it's always true. For others, it checks Y position.
     * @returns {boolean} True if the object is above ground, false otherwise.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 175;
        }
    }

    /**
     * Gets the collision box dimensions for the current movable object.
     * @returns {{x: number, y: number, width: number, height: number}} Collision box.
     * @private
     */
    _getThisCollisionBox() {
        const x = this.x + this.offset.left;
        const y = this.y + this.offset.top;
        const width = this.width - this.offset.left - this.offset.right;
        const height = this.height - this.offset.top - this.offset.bottom;
        return { x, y, width, height };
    }

    /**
     * Gets the collision box dimensions for another movable object.
     * @param {MovableObject} mo - The other movable object.
     * @returns {{x: number, y: number, width: number, height: number}} Collision box.
     * @private
     */
    _getOtherCollisionBox(mo) {
        const moOffsetLeft = mo.offset ? mo.offset.left : 0;
        const moOffsetRight = mo.offset ? mo.offset.right : 0;
        const moOffsetTop = mo.offset ? mo.offset.top : 0;
        const moOffsetBottom = mo.offset ? mo.offset.bottom : 0;

        const x = mo.x + moOffsetLeft;
        const y = mo.y + moOffsetTop;
        const width = mo.width - moOffsetLeft - moOffsetRight;
        const height = mo.height - moOffsetTop - moOffsetBottom;
        return { x, y, width, height };
    }

    /**
     * Checks if this object is colliding with another movable object.
     * @param {MovableObject} mo - The other movable object to check collision against.
     * @returns {boolean} True if a collision is detected, false otherwise.
     */
    isColliding(mo) {
        const thisBox = this._getThisCollisionBox();
        const moBox = this._getOtherCollisionBox(mo);

        return (
            thisBox.x < moBox.x + moBox.width &&
            thisBox.y < moBox.y + moBox.height &&
            thisBox.x + thisBox.width > moBox.x &&
            thisBox.y + thisBox.height > moBox.y
        );
    }

    /**
     * Reduces the object's energy by 5 and sets the last hit time.
     */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks if the object is currently in a 'hurt' state (recently hit).
     * @returns {boolean} True if the object was hit within the last 0.3 seconds.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.3;
    }

    /**
     * Checks if the object's energy is zero, indicating it is dead.
     * @returns {boolean} True if the object is dead, false otherwise.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Plays an animation sequence by updating the current image.
     * The animation frame is skipped based on `skipThreshold` to control animation speed.
     * @param {string[]} images - An array of image paths for the animation.
     * @param {number} [skipThreshold=7] - Number of frames to skip before updating the image.
     */
    playAnimation(images, skipThreshold = 7) {
        this.animationFrameSkip++;

        if (this.animationFrameSkip >= skipThreshold) {
            let i = this.currentImage % images.length;
            let path = images[i];
            this.img = this.imageCache[path];
            this.currentImage++;
            this.animationFrameSkip = 0;
        }
    }

    /**
     * Moves the object to the right by its speed.
     * Sets `otherDirection` to false to not flip the image (assuming default image faces right).
     */
    moveRight() {
        if (this.world && this.world.gamePaused) {
            return; // Do not move if game is paused
        }
        this.x += this.speed;
        this.otherDirection = false;
    }

    /**
     * Moves the object to the left by its speed.
     * Sets `otherDirection` to true to flip the image (assuming default image faces right and needs to be flipped to face left).
     */
    moveLeft() {
        if (this.world && this.world.gamePaused) {
            return; // Do not move if game is paused
        }
        this.x -= this.speed;
        this.otherDirection = true;
    }

    /**
     * Sets the game world reference for this object.
     * @param {World} world - The game world instance.
     */
    setWorld(world) {
        this.world = world;
    }
}
