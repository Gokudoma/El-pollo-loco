class Bottle extends DrawableObject {
    constructor(x) {
        super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = x;
        this.y = 360;
        this.height = 70;
        this.width = 60;
    }
}
