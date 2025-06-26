/**
 * Represents a status bar for displaying the number of collected bottles.
 * Inherits from DrawableObject.
 */
class StatusBarBottles extends DrawableObject {
    IMAGES_STATUSBAR = [
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
    ];

    percentage = 0;

    /**
     * Creates an instance of StatusBarBottles.
     * Loads the status bar images and initializes the bar to 0%.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_STATUSBAR);
        this.x = 40;
        this.y = 50;
        this.height = 60;
        this.width = 200;
        this.setPercentage(0);
    }

    /**
     * Sets the percentage value for the status bar and updates the displayed image.
     * @param {number} percentage - The current percentage (0-100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        // Determines the correct image path based on the percentage
        let path = this.IMAGES_STATUSBAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the index of the image in IMAGES_STATUSBAR based on the current percentage.
     * @returns {number} The index of the image to display.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
