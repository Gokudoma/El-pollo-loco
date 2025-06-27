/**
 * Manages all drawing and rendering operations for the game world on the canvas.
 */
class WorldRenderer {
    world; // Reference to the World instance

    /**
     * Creates an instance of WorldRenderer.
     * @param {World} world - The World instance to which this renderer belongs.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * The main drawing loop that clears the canvas and redraws all game elements.
     */
    draw() {
        this._clearCanvas();

        this.world.ctx.save();

        this._drawBackgroundAndDynamicElements();

        this.world.ctx.restore();
        this._drawFixedUIElements();

        this._requestNextFrame();
    }

    /**
     * Clears the entire canvas.
     * @private
     */
    _clearCanvas() {
        this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
    }

    /**
     * Draws background, dynamic game objects, and the character with camera translation.
     * @private
     */
    _drawBackgroundAndDynamicElements() {
        this.world.ctx.translate(this.world.camera_x, 0);
        this.addObjectsToMap(this.world.level.backgroundObjects);
        this.addObjectsToMap(this.world.level.clouds);
        this.addObjectsToMap(this.world.level.enemies);
        this.addObjectsToMap(this.world.level.bottles);
        this.addObjectsToMap(this.world.level.coins);
        this.addObjectsToMap(this.world.throwableObjects);
        this.addToMap(this.world.character);
    }

    /**
     * Draws static UI elements that remain fixed on the screen.
     * @private
     */
    _drawFixedUIElements() {
        this.addToMap(this.world.statusBar);
        this.addToMap(this.world.statusBarBottles);
        this.addToMap(this.world.statusBarCoins);
        this.addToMap(this.world.endbossHealthBar);
    }

    /**
     * Requests the next animation frame for a continuous drawing loop.
     * @private
     */
    _requestNextFrame() {
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    /**
     * Adds objects to the map for drawing.
     * @param {DrawableObject[]} objects - An array of drawable objects to add.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Adds a single drawable object to the map for drawing, handling image flipping if necessary.
     * @param {DrawableObject} mo - The movable object to draw.
     */
    addToMap(mo) {
        if (!mo) return;

        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.world.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips the image horizontally for drawing.
     * This method saves the current canvas state, translates the origin to the right edge of the object,
     * scales the x-axis by -1 to flip, and then adjusts the object's x-coordinate for drawing.
     * @param {MovableObject} mo - The movable object to flip.
     */
    flipImage(mo) {
        this.world.ctx.save();
        this.world.ctx.translate(mo.width, 0);
        this.world.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the canvas context after a horizontal flip.
     * This method reverts the object's x-coordinate back to its original value and restores the canvas state.
     * @param {MovableObject} mo - The movable object that was flipped.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.world.ctx.restore();
    }
}
