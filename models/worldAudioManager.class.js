/**
 * Manages all audio playback and sound-related logic for the game world.
 */
class WorldAudioManager {
    world; // Reference to the World instance

    chickenBossDieSound = new Audio('audio/chickenBossdies.mp3');
    bossSoundPlayed = false;
    levelSound = new Audio('audio/levelsound.mp3');
    levelSoundPlaying = false;
    chickenSound = new Audio('audio/chicken.mp3');
    chickenSoundPlaying = false;
    brokenBottleSound = new Audio('audio/brokenBottle.mp3');
    collectCoinSound = new Audio('audio/collectCoin.mp3');
    collectBottleSound = new Audio('audio/collectBottle.mp3');

    /**
     * Creates an instance of WorldAudioManager.
     * @param {World} world - The World instance to which this audio manager belongs.
     */
    constructor(world) {
        this.world = world;
        this._setupAudioLoops();
        this._initAudioVolume();
    }

    /**
     * Sets up looping for background audio.
     * @private
     */
    _setupAudioLoops() {
        this.levelSound.loop = true;
        this.chickenSound.loop = true;
    }

    /**
     * Sets the initial volume for all audio elements.
     * @private
     */
    _initAudioVolume() {
        if (typeof currentVolume !== 'undefined') {
            this.levelSound.volume = currentVolume;
            this.chickenSound.volume = currentVolume;
            this.chickenBossDieSound.volume = currentVolume;
            this.brokenBottleSound.volume = currentVolume;
            this.collectCoinSound.volume = currentVolume;
            this.collectBottleSound.volume = currentVolume;
        }
    }

    /**
     * Plays the sound effect for a broken bottle.
     */
    _playBrokenBottleSound() {
        this.brokenBottleSound.currentTime = 0;
        if (typeof isMutedGlobally !== 'undefined' && !isMutedGlobally) {
            this.brokenBottleSound.play();
        }
    }

    /**
     * Plays the endboss death sound if the endboss is defeated.
     * @param {MovableObject} enemy - The enemy object that was hit (potentially the endboss).
     */
    _playEndbossDeathSound(enemy) {
        if (enemy instanceof Endboss && enemy.isDead() && !this.bossSoundPlayed) {
            if (typeof isMutedGlobally !== 'undefined' && !isMutedGlobally) {
                this.chickenBossDieSound.play();
            }
            this.bossSoundPlayed = true;
        }
    }

    /**
     * Determines if a chicken enemy is within proximity to play its sound.
     */
    _checkChickenSoundProximity() {
        let foundProximityEnemy = false;
        const proximityRange = 500;

        this.world.level.enemies.forEach(enemy => {
            if ((enemy instanceof Chicken || enemy instanceof ChickenSmall) && !enemy.isDead()) {
                const distanceX = Math.abs(this.world.character.x - enemy.x);
                if (distanceX < proximityRange) {
                    foundProximityEnemy = true;
                }
            }
        });
        this._updateChickenSound(foundProximityEnemy);
    }

    /**
     * Handles playing the chicken sound.
     * @private
     */
    _playChickenSound() {
        this.chickenSound.currentTime = 0;
        this.chickenSound.play().catch(e => {
            if (e.name === "AbortError") {
                // This error is expected if playback is interrupted quickly
            } else {
                console.error("Error playing chicken sound:", e);
            }
        });
        this.chickenSoundPlaying = true;
    }

    /**
     * Handles pausing the chicken sound.
     * @private
     */
    _pauseChickenSound() {
        this.chickenSound.pause();
        this.chickenSound.currentTime = 0;
        this.chickenSoundPlaying = false;
    }

    /**
     * Manages the chicken sound playback based on enemy proximity and global mute status.
     * @param {boolean} foundProximityEnemy - True if a chicken enemy is within proximity.
     */
    _updateChickenSound(foundProximityEnemy) {
        const shouldPlay = foundProximityEnemy && !this.chickenSoundPlaying && !isMutedGlobally;
        const shouldPause = (!foundProximityEnemy && this.chickenSoundPlaying) ||
                            (isMutedGlobally && this.chickenSoundPlaying);

        if (shouldPlay) {
            this._playChickenSound();
        } else if (shouldPause) {
            this._pauseChickenSound();
        }
    }

    /**
     * Pauses all currently playing game background and chicken sounds.
     */
    _pauseAllGameSounds() {
        this.levelSound.pause();
        this.chickenSound.pause();
        this.chickenSound.currentTime = 0;
        this.chickenSoundPlaying = false;
    }

    /**
     * Plays the background music for the current level if not muted.
     */
    _playLevelMusic() {
        this.levelSound.pause();
        this.levelSound.currentTime = 0;
        if (typeof isMutedGlobally !== 'undefined' && !isMutedGlobally) {
            this.levelSound.play();
            this.levelSoundPlaying = true;
        } else {
            this.levelSoundPlaying = false;
        }
    }
}
