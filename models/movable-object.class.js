class MovableObject extends DrawableObject {
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
    right: 0,
  };

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 175;
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

    return (
      thisX < moX + moWidth &&
      thisY < moY + moHeight &&
      thisX + thisWidth > moX &&
      thisY + thisHeight > moY
    );
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.3;
  }

  isDead() {
    return this.energy == 0;
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
