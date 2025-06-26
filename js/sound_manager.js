/**
 * Toggles the global mute state and updates related settings.
 */
function toggleMute() {
    isMutedGlobally = !isMutedGlobally; 
    saveSettings();
    setGlobalVolume();
    updateMuteButton();
    // When mute is toggled, ensure level sound reacts immediately
    if (world && world.levelSound) {
        if (isMutedGlobally) {
            world.levelSound.pause();
        } else if (!world.gamePaused) { // Only play if not globally muted AND not paused
            world.levelSound.play();
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
 */
function setGlobalVolume() {
    if (!world) return; 

    const volumeToSet = isMutedGlobally ? 0 : currentVolume; 

    setSoundVolume(world.levelSound, volumeToSet);
    setSoundVolume(world.chickenSound, volumeToSet);
    setSoundVolume(world.chickenBossDieSound, volumeToSet);
    setSoundVolume(world.brokenBottleSound, volumeToSet);

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
    if (world && world.levelSound && !isMutedGlobally && !world.gamePaused) { 
        world.levelSound.play();
        world.levelSoundPlaying = true;
    }
}

/**
 * Pauses all relevant game sounds, typically when the game is paused or a modal is open.
 * Ensures all looping and character sounds are stopped.
 */
function pauseGameSounds() {
    if (world) { 
        if (world.levelSound) {
            world.levelSound.pause();
        }
        if (world.chickenSound) {
            world.chickenSound.pause();
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
            if (world.levelSound) {
                world.levelSound.play();
            }
        }
    }
}
