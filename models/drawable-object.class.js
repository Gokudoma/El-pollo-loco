class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) { 
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = "red";
            const drawX = this.x + this.offset.left;
            const drawY = this.y + this.offset.top;
            const drawWidth = this.width - this.offset.left - this.offset.right;
            const drawHeight = this.height - this.offset.top - this.offset.bottom;
            ctx.rect(drawX, drawY, drawWidth, drawHeight);
            ctx.stroke();
        } 
    }

    loadImages(arr){
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}