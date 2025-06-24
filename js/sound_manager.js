// js/sound_manager.js

/**
 * Toggles the global mute state and updates related settings.
 */
function toggleMute() {
    isMutedGlobally = !isMutedGlobally; // Global variable from main.js
    saveSettings(); // From game_settings.js
    setGlobalVolume();
    updateMuteButton();
}

/**
 * Updates the text/icon of the mute buttons.
 */
function updateMuteButton() {
    const muteBtn = document.getElementById('muteBtn');
    const muteMobileBtn = document.getElementById('muteMobileBtn');

    if (muteBtn) {
        muteBtn.innerText = isMutedGlobally ? 'Sound An' : 'Sound Mute'; // Global variable from main.js
    }
    if (muteMobileBtn) {
        muteMobileBtn.innerText = isMutedGlobally ? '🔇' : '🔊'; // Global variable from main.js
    }
}

/**
 * Sets up an individual volume slider with its event listener.
 * @param {string} sliderId - The ID of the volume slider element.
 */
function setupSingleVolumeSlider(sliderId) {
    const volumeSlider = document.getElementById(sliderId);
    if (volumeSlider) {
        volumeSlider.value = currentVolume; // Global variable from main.js
        volumeSlider.addEventListener('input', (e) => {
            currentVolume = parseFloat(e.target.value); // Global variable from main.js
            saveSettings(); // From game_settings.js
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

    sound.volume = isMutedGlobally ? 0 : currentVolume; // Global variables from main.js

    if (isMutedGlobally && world.character[soundPlayingProp]) { // Global variable 'world' from main.js
        sound.pause();
        world.character[soundPlayingProp] = false;
    } else if (!isMutedGlobally && !world.character[soundPlayingProp] && conditionFn()) {
        sound.play();
        world.character[soundPlayingProp] = true;
    }
}

/**
 * Sets the global volume for all game sounds.
 */
function setGlobalVolume() {
    if (!world) return; // Global variable 'world' from main.js

    const volumeToSet = isMutedGlobally ? 0 : currentVolume; // Global variables from main.js

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
 * Plays the level sound if the game world exists and is not muted.
 */
function playLevelSound() {
    if (world && !isMutedGlobally) { // Global variables from main.js
        world.levelSound.play();
        world.levelSoundPlaying = true;
    }
}

/**
 * Pauses all relevant game sounds.
 */
function pauseGameSounds() {
    if (world) { // Global variable 'world' from main.js
        world.gamePaused = true;
        world.levelSound.pause();
        world.chickenSound.pause();
        if (world.character) {
            world.character.stepsSound.pause();
            world.character.snoringSound.pause();
        }
    }
}

/**
 * Resumes game sounds based on mute settings.
 */
function resumeGameSounds() {
    if (world) { // Global variable 'world' from main.js
        world.gamePaused = false;
        if (!isMutedGlobally) { // Global variable from main.js
            world.levelSound.play();
        }
    }
}