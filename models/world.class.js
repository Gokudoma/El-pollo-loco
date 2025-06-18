let allLevels = [level1, level2, level3];

class World {
    character = new Character();
    level; 
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    statusBarBottles = new StatusBarBottles();
    statusBarCoins = new StatusBarCoins();
    throwableObjects = [];
    isGameOver = false;
    currentLevelIndex = 0;
    isGameWon = false;
    lastBottleThrow = 0;
    bottleCooldown = 1000;
    chickenBossDieSound = new Audio('audio/chickenBossdies.mp3');
    bossSoundPlayed = false;
    levelSound = new Audio('audio/levelsound.mp3');
    levelSoundPlaying = false;
    chickenSound = new Audio('audio/chicken.mp3'); 
    chickenSoundPlaying = false; 
    brokenBottleSound = new Audio('audio/brokenBottle.mp3'); 
    gamePaused = false;

    constructor(canvas){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = allLevels[this.currentLevelIndex];
        this.draw();
        this.setWorld(); 
        this.run();
        this.character.animate(); 
        this.startCleanupIntervals();
        this.levelSound.loop = true; 
        this.chickenSound.loop = true; 
    }

    setWorld(){
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof MovableObject) {
                enemy.setWorld(this);
            }
        });
    }

    run() {
        setInterval(() => {
            if (!this.isGameOver && !this.isGameWon && !this.gamePaused) {
                this.checkCollisions();
                this.checkThrowObjects();
                this.checkLevelCompletion(); 
                this.checkEnemyProximity(); 
            }
        }, 1000 / 60);
    }

    startCleanupIntervals() {
        setInterval(() => {
            if (!this.isGameOver && !this.isGameWon && !this.gamePaused) {
                this.cleanupDeadEnemies();
                this.cleanupSplashedBottles();
            }
        }, 100); 
    }

    checkThrowObjects() {
        let timePassed = new Date().getTime() - this.lastBottleThrow;
        if (this.keyboard.SPACE && this.character.bottles > 0 && !this.character.isDead() && !this.isGameOver && !this.isGameWon && timePassed > this.bottleCooldown) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            bottle.setWorld(this);
            this.throwableObjects.push(bottle);
            this.character.bottles--;
            this.statusBarBottles.setPercentage(this.character.bottles * 20);
            this.lastBottleThrow = new Date().getTime();
        }
    }    

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if( this.character.isColliding(enemy) && !enemy.isDead()) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
                if (this.character.isDead()) {
                    this.endGame(); 
                }
            }

            this.throwableObjects.forEach((bottle) => {
                if (bottle.isColliding(enemy) && !bottle.isSplashing && !enemy.isDead()) {
                    bottle.splash(); 
                    enemy.hit(); 
                    this.brokenBottleSound.currentTime = 0; 
                    if (!isMutedGlobally) { 
                        this.brokenBottleSound.play();
                    }
                    if (enemy instanceof Endboss && enemy.isDead() && !this.bossSoundPlayed) {
                        this.chickenBossDieSound.play();
                        this.bossSoundPlayed = true;
                    }
                }
            });
        });

        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.character.bottles++;
                this.level.bottles.splice(index, 1);
                this.statusBarBottles.setPercentage(this.character.bottles * 20);
            }
        });

        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.character.coins++;
                this.level.coins.splice(index, 1);
                let collectedCoinPercentage = (this.character.coins / this.level.initialCoinCount) * 100;
                this.statusBarCoins.setPercentage(collectedCoinPercentage);
            }
        });
    }

    checkEnemyProximity() {
        let foundProximityEnemy = false;
        this.level.enemies.forEach(enemy => {
            const distance = enemy.x - this.character.x;
            if (distance > -30 && distance < 720 && !enemy.isDead()) {
                foundProximityEnemy = true;
            }
        });

        if (foundProximityEnemy && !this.chickenSoundPlaying && !isMutedGlobally) {
            this.chickenSound.play();
            this.chickenSoundPlaying = true;
        } else if ((!foundProximityEnemy && this.chickenSoundPlaying) || isMutedGlobally && this.chickenSoundPlaying) {
            this.chickenSound.pause();
            this.chickenSound.currentTime = 0; 
            this.chickenSoundPlaying = false;
        }
    }

    cleanupDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.isDead());
    }

    cleanupSplashedBottles() {
        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.splashAnimationFinished);
    }

    checkLevelCompletion() {
        const allCoinsCollected = this.level.coins.length === 0;
        const endbossDefeated = this.level.endboss.isDead();

        if (allCoinsCollected && endbossDefeated) {
            this.levelComplete();
        }
    }

    levelComplete() {
        if (this.currentLevelIndex < allLevels.length - 1) {
            this.currentLevelIndex++;
            this.showLevelCompleteScreen();
        } else {
            this.gameWon();
        }
    }

    showLevelCompleteScreen() {
        this.isGameOver = true; 
        this.levelSound.pause(); 
        this.chickenSound.pause();
        this.chickenSound.currentTime = 0;
        this.chickenSoundPlaying = false;
        document.getElementById('levelCompleteScreen').classList.remove('d-none');
        document.getElementById('canvas').classList.add('d-none');
    }

    goToNextLevel() {
        this.isGameOver = false;
        this.character.reset(); 
        this.level = allLevels[this.currentLevelIndex]; 
        this.setWorld();
        this.statusBar.setPercentage(this.character.energy); 
        this.statusBarBottles.setPercentage(this.character.bottles * 20);
        this.statusBarCoins.setPercentage(0); 
        this.throwableObjects = []; 
        this.bossSoundPlayed = false;
        
        document.getElementById('levelCompleteScreen').classList.add('d-none');
        document.getElementById('canvas').classList.remove('d-none');
        this.camera_x = 0; 
        if (!this.levelSoundPlaying && !isMutedGlobally) { 
            this.levelSound.play();
            this.levelSoundPlaying = true;
        }
    }

    gameWon() {
        this.isGameWon = true;
        this.isGameOver = true; 
        this.levelSound.pause(); 
        this.chickenSound.pause();
        this.chickenSound.currentTime = 0;
        this.chickenSoundPlaying = false;
        document.getElementById('gameWonScreen').classList.remove('d-none');
        document.getElementById('canvas').classList.add('d-none');
    }

    endGame() {
        this.isGameOver = true;
        this.levelSound.pause(); 
        this.chickenSound.pause();
        this.chickenSound.currentTime = 0;
        this.chickenSoundPlaying = false;
        document.getElementById('gameOverScreen').classList.remove('d-none');
        document.getElementById('canvas').classList.add('d-none');
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottles);
        this.addToMap(this.statusBarCoins);
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);
        
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    addObjectsToMap(objects){
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if(mo.otherDirection) {
            this.flipImage(mo);
        }
        
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
