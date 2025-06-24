class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    /**
     * Loads an image from the given path and sets it as the current image.
     * @param {string} path - The path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object's current image on the canvas context.
     * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Calculates the dimensions for the collision frame based on the object's offsets.
     * @returns {{drawX: number, drawY: number, drawWidth: number, drawHeight: number}} The calculated coordinates and dimensions.
     */
    _getCollisionFrameDimensions() {
        const drawX = this.x + this.offset.left;
        const drawY = this.y + this.offset.top;
        const drawWidth = this.width - this.offset.left - this.offset.right;
        const drawHeight = this.height - this.offset.top - this.offset.bottom;
        return { drawX, drawY, drawWidth, drawHeight };
    }

    /**
     * Draws a red collision frame around specific types of objects (Character, Chicken, Endboss).
     * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
     */
    _drawCollisionFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = '3';
        ctx.strokeStyle = "red";
        const { drawX, drawY, drawWidth, drawHeight } = this._getCollisionFrameDimensions();
        ctx.rect(drawX, drawY, drawWidth, drawHeight);
        ctx.stroke(); // Draws the path
    }

    /**
     * Draws a frame around the object, typically for debugging collision boxes.
     * Only draws for Character, Chicken, and Endboss instances.
     * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            this._drawCollisionFrame(ctx);
        }
    }

    /**
     * Loads multiple images into the image cache.
     * @param {string[]} arr - An array of image paths to load.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
