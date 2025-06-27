/**
 * Toggles the global mute state and updates related settings.
 */
function toggleMute() {
    isMutedGlobally = !isMutedGlobally;
    saveSettings();
    setGlobalVolume();
    updateMuteButton();
    // When mute is toggled, ensure level sound reacts immediately
    if (world && world.audioManager && world.audioManager.levelSound) { // Access via audioManager
        if (isMutedGlobally) {
            world.audioManager.levelSound.pause();
        } else if (!world.gamePaused) { // Only play if not globally muted AND not paused
            world.audioManager.levelSound.play();
        }
    }
}

/**
 * Updates the text/icon of the mute buttons.
 */
function updateMuteButton() {
    const muteBtn = document.getElementById('muteBtn');
    const muteMobileBtn = document.getElementById('muteMobileBtn');

    if (muteBtn) {
        muteBtn.innerText = isMutedGlobally ? 'Sound On' : 'Sound Mute';
    }
    if (muteMobileBtn) {
        muteMobileBtn.innerText = isMutedGlobally ? '🔇' : '🔊';
    }
}

/**
 * Sets up an individual volume slider with its event listener.
 * @param {string} sliderId - The ID of the volume slider element.
 */
function setupSingleVolumeSlider(sliderId) {
    const volumeSlider = document.getElementById(sliderId);
    if (volumeSlider) {
        volumeSlider.value = currentVolume;
        volumeSlider.addEventListener('input', (e) => {
            currentVolume = parseFloat(e.target.value);
            saveSettings();
            setGlobalVolume();
        });
    }
}

/**
 * Sets up the volume sliders for desktop and mobile.
 */
function setupVolumeSlider() {
    setupSingleVolumeSlider('volumeSlider');
    setupSingleVolumeSlider('volumeSliderMobile');
}

/**
 * Sets the volume for a given sound object.
 * @param {HTMLAudioElement} sound - The audio element to set the volume for.
 * @param {number} volumeToSet - The volume level to set.
 */
function setSoundVolume(sound, volumeToSet) {
    if (sound) {
        sound.volume = volumeToSet;
    }
}

/**
 * Handles playing/pausing character specific sounds (steps, snoring).
 * @param {HTMLAudioElement} sound - The character's sound object.
 * @param {string} soundPlayingProp - The property name indicating if the sound is playing (e.g., 'stepsSoundPlaying').
 * @param {function} conditionFn - A function that returns true if the sound should be playing.
 */
function handleCharacterSoundPlayback(sound, soundPlayingProp, conditionFn) {
    if (!sound) return;

    sound.volume = isMutedGlobally ? 0 : currentVolume;

    if (isMutedGlobally && world.character[soundPlayingProp]) {
        sound.pause();
        world.character[soundPlayingProp] = false;
    } else if (!isMutedGlobally && !world.character[soundPlayingProp] && conditionFn() && !world.gamePaused) { // Added !world.gamePaused
        sound.play();
        world.character[soundPlayingProp] = true;
    }
}

/**
 * Sets the global volume for all game sounds.
 * This function now primarily affects character-specific sounds and delegates to WorldAudioManager for others.
 */
function setGlobalVolume() {
    if (!world) return;

    const volumeToSet = isMutedGlobally ? 0 : currentVolume;

    // Delegate global sound volume setting to WorldAudioManager
    if (world.audioManager) {
        world.audioManager.levelSound.volume = volumeToSet;
        world.audioManager.chickenSound.volume = volumeToSet;
        world.audioManager.chickenBossDieSound.volume = volumeToSet;
        world.audioManager.brokenBottleSound.volume = volumeToSet;
        world.audioManager.collectCoinSound.volume = volumeToSet;
        world.audioManager.collectBottleSound.volume = volumeToSet;
    }

    if (world.character) {
        setSoundVolume(world.character.jumpSound, volumeToSet);
        setSoundVolume(world.character.hitSound, volumeToSet);
        setSoundVolume(world.character.deathSound, volumeToSet);

        handleCharacterSoundPlayback(world.character.stepsSound, 'stepsSoundPlaying',
            () => (world.keyboard.RIGHT || world.keyboard.LEFT) && !world.character.isAboveGround());

        handleCharacterSoundPlayback(world.character.snoringSound, 'snoringSoundPlaying',
            () => (new Date().getTime() - world.character.lastMoveTime > 8000) &&
                !world.character.isAboveGround() && !world.character.isHurt() && !world.character.isDead());
    }
}

/**
 * Plays the level background sound if the game world exists, is not muted, and not paused.
 */
function playLevelSound() {
    if (world && world.audioManager && world.audioManager.levelSound && !isMutedGlobally && !world.gamePaused) {
        world.audioManager.levelSound.play();
        world.audioManager.levelSoundPlaying = true;
    }
}

/**
 * Pauses all relevant game sounds, typically when the game is paused or a modal is open.
 * Ensures all looping and character sounds are stopped.
 */
function pauseGameSounds() {
    if (world) {
        if (world.audioManager && world.audioManager.levelSound) {
            world.audioManager.levelSound.pause();
        }
        if (world.audioManager && world.audioManager.chickenSound) {
            world.audioManager.chickenSound.pause();
        }
        if (world.character) {
            if (world.character.stepsSound) {
                world.character.stepsSound.pause();
                world.character.stepsSoundPlaying = false;
            }
            if (world.character.snoringSound) {
                world.character.snoringSound.pause();
                world.character.snoringSoundPlaying = false;
            }
        }
    }
}

/**
 * Resumes game sounds based on the current mute settings and game pause state.
 * Only non-muted and non-paused background/looping sounds will resume.
 */
function resumeGameSounds() {
    if (world) {
        if (!isMutedGlobally && !world.gamePaused) {
            if (world.audioManager && world.audioManager.levelSound) {
                world.audioManager.levelSound.play();
            }
        }
    }
}
