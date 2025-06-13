class MovableObject {
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    animationFrameSkip = 0;
    animationSkipThreshold = 7;

    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    applyGravity(){
        setInterval(() => {
            if(this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround(){
        return this.y < 175;
    }

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

    isColliding(mo) {
        const thisX = this.x + this.offset.left;
        const thisY = this.y + this.offset.top;
        const thisWidth = this.width - this.offset.left - this.offset.right;
        const thisHeight = this.height - this.offset.top - this.offset.bottom;

        const moOffsetLeft = mo.offset ? mo.offset.left : 0;
        const moOffsetRight = mo.offset ? mo.offset.right : 0;
        const moOffsetTop = mo.offset ? mo.offset.top : 0;
        const moOffsetBottom = mo.offset ? mo.offset.bottom : 0;

        const moX = mo.x + moOffsetLeft;
        const moY = mo.y + moOffsetTop;
        const moWidth = mo.width - moOffsetLeft - moOffsetRight;
        const moHeight = mo.height - moOffsetTop - moOffsetBottom;

        return thisX < moX + moWidth &&
               thisY < moY + moHeight &&
               thisX + thisWidth > moX &&
               thisY + thisHeight > moY;
    }

    loadImages(arr){
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    playAnimation(images) {
        this.animationFrameSkip++;

        if (this.animationFrameSkip >= this.animationSkipThreshold) {
            let i = this.currentImage % images.length;
            let path = images[i];
            this.img = this.imageCache[path];
            this.currentImage++;
            this.animationFrameSkip = 0;
        }
    }

    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }

    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = true;
    }
}
