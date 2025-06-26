/**
 * Loads mute and volume settings from local storage.
 */
function loadSettings() {
    isMutedGlobally = JSON.parse(localStorage.getItem('isMutedGlobally')) || false;
    currentVolume = parseFloat(localStorage.getItem('currentVolume')) || 1.0;
}

/**
 * Saves mute and volume settings to local storage.
 */
function saveSettings() {
    localStorage.setItem('isMutedGlobally', JSON.stringify(isMutedGlobally));
    localStorage.setItem('currentVolume', currentVolume);
}