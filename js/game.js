let canvas;
let world;
let keyboard = new Keyboard();
let isMutedGlobally = false;

function resetKeyboardState() {
    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
}

function isTouchDevice() {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
}

function checkOrientation() {
    const orientationMessage = document.getElementById('orientationMessage');
    const canvasElement = document.getElementById('canvas');
    const mobileControls = document.querySelector('.mobile-controls-wrapper');
    const controlsContainer = document.querySelector('.controls-container');
    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const levelCompleteScreen = document.getElementById('levelCompleteScreen');
    const gameWonScreen = document.getElementById('gameWonScreen');
    const explanationModal = document.getElementById('explanationModal');
    const gameWrapper = document.querySelector('.game-wrapper');

    const gameIsRunning = world && !world.isGameOver && !world.isGameWon;
    const isModalOpen = !explanationModal.classList.contains('d-none');
    const touchDevice = isTouchDevice();
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;


    orientationMessage.classList.add('d-none');
    canvasElement.classList.add('d-none');
    startScreen.classList.add('d-none');
    gameOverScreen.classList.add('d-none');
    levelCompleteScreen.classList.add('d-none');
    gameWonScreen.classList.add('d-none');
    explanationModal.classList.add('d-none');

    mobileControls.classList.remove('mobile-controls-active');
    mobileControls.classList.add('d-none');
    controlsContainer.classList.add('d-none');


    if (isModalOpen) {
        explanationModal.classList.remove('d-none');
        return;
    }

    if (window.innerHeight > window.innerWidth && touchDevice) {
        orientationMessage.classList.remove('d-none');
        return;
    }

    if (isFullscreen || touchDevice) {
        gameWrapper.style.width = '100vw';
        gameWrapper.style.height = '100vh';
        gameWrapper.style.marginBottom = '';
    } else {
        gameWrapper.style.width = '720px';
        gameWrapper.style.height = '480px';
        gameWrapper.style.marginBottom = '20px';
    }


    if (gameIsRunning) {
        canvasElement.classList.remove('d-none');
        if (touchDevice || isFullscreen) {
            mobileControls.classList.remove('d-none');
            mobileControls.classList.add('mobile-controls-active');
            controlsContainer.classList.add('d-none');
        } else {
            controlsContainer.classList.remove('d-none');
            mobileControls.classList.add('d-none');
        }
    } else {
        if (!startScreen.classList.contains('d-none')) {
            startScreen.classList.remove('d-none');
        } else if (!gameOverScreen.classList.contains('d-none')) {
            gameOverScreen.classList.remove('d-none');
        } else if (!levelCompleteScreen.classList.contains('d-none')) {
            levelCompleteScreen.classList.remove('d-none');
        } else if (!gameWonScreen.classList.contains('d-none')) {
            gameWonScreen.classList.remove('d-none');
        } else {
            startScreen.classList.remove('d-none');
        }

        if (touchDevice || isFullscreen) {
             mobileControls.classList.remove('d-none');
             mobileControls.classList.add('mobile-controls-active');
             controlsContainer.classList.add('d-none');
        } else {
            controlsContainer.classList.remove('d-none');
            mobileControls.classList.add('d-none');
        }
    }
}


function init(){
    canvas = document.getElementById('canvas');
    resizeCanvas();
    world = new World(canvas, keyboard);
    addMobileEventListeners();
    updateMuteButton();
}

function startGame() {
    document.getElementById('startScreen').classList.add('d-none');

    init();
    resetKeyboardState();
    checkOrientation();

    if (world && !isMutedGlobally) {
        world.levelSound.play();
        world.levelSoundPlaying = true;
    }

    if (isTouchDevice()) {
        toggleFullscreen();
    }
}

function toggleFullscreen() {
    let gameWrapper = document.querySelector('.game-wrapper');
    let isCurrentlyFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

    if (!isCurrentlyFullscreen) {
        if (gameWrapper.requestFullscreen) {
            gameWrapper.requestFullscreen();
        } else if (gameWrapper.webkitRequestFullscreen) {
            gameWrapper.webkitRequestFullscreen();
        } else if (gameWrapper.msRequestFullscreen) {
            gameWrapper.msRequestFullscreen();
        }
        document.getElementById('fullscreenBtn').innerText = 'Fenstermodus';
        gameWrapper.classList.add('fullscreen-active');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        document.getElementById('fullscreenBtn').innerText = 'Vollbild';
        gameWrapper.classList.remove('fullscreen-active');
    }
    setTimeout(() => {
        checkOrientation();
    }, 100);
}

document.addEventListener('fullscreenchange', () => { checkOrientation(); });
document.addEventListener('webkitfullscreenchange', () => { checkOrientation(); });
document.addEventListener('mozfullscreenchange', () => { checkOrientation(); });
document.addEventListener('MSFullscreenChange', () => { checkOrientation(); });


function toggleMute() {
    isMutedGlobally = !isMutedGlobally;

    if (world) {
        world.levelSound.muted = isMutedGlobally;
        world.chickenSound.muted = isMutedGlobally;
        world.chickenBossDieSound.muted = isMutedGlobally;
        world.brokenBottleSound.muted = isMutedGlobally;

        if (world.character) {
            world.character.jumpSound.muted = isMutedGlobally;
            world.character.hitSound.muted = isMutedGlobally;
            world.character.deathSound.muted = isMutedGlobally;
            world.character.stepsSound.muted = isMutedGlobally;
            if (isMutedGlobally) {
                world.character.stepsSound.pause();
                world.character.stepsSound.currentTime = 0;
                world.character.stepsSoundPlaying = false;
            }
        }
    }
    updateMuteButton();
}

function updateMuteButton() {
    const muteBtn = document.getElementById('muteBtn');
    const muteMobileBtn = document.getElementById('muteMobileBtn');

    if (muteBtn) {
        muteBtn.innerText = isMutedGlobally ? 'Sound An' : 'Sound Mute';
    }
    if (muteMobileBtn) {
        muteMobileBtn.innerText = isMutedGlobally ? '🔇' : '🔊';
    }
}

function toggleExplanationModal() {
    const explanationModal = document.getElementById('explanationModal');
    const canvasElement = document.getElementById('canvas');
    const mobileControls = document.querySelector('.mobile-controls-wrapper');
    const controlsContainer = document.querySelector('.controls-container');
    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const levelCompleteScreen = document.getElementById('levelCompleteScreen');
    const gameWonScreen = document.getElementById('gameWonScreen');

    if (explanationModal.classList.contains('d-none')) {
        explanationModal.classList.remove('d-none');
        if (world) {
            world.gamePaused = true;
            world.levelSound.pause();
            world.chickenSound.pause();
            if (world.character) {
                world.character.stepsSound.pause();
            }
        }
        canvasElement.classList.add('d-none');
        mobileControls.classList.add('d-none');
        controlsContainer.classList.add('d-none');
        startScreen.classList.add('d-none');
        gameOverScreen.classList.add('d-none');
        levelCompleteScreen.classList.add('d-none');
        gameWonScreen.classList.add('d-none');

    } else {
        explanationModal.classList.add('d-none');
        if (world) {
            world.gamePaused = false;
            if (!isMutedGlobally) {
                world.levelSound.play();
            }
        }
        checkOrientation();
    }
}


function restartGame() {
    location.reload();
    resetKeyboardState();
}

function goToNextLevelFromButton() {
    if (world) {
        world.goToNextLevel();
        resetKeyboardState();
    }
}

function resizeCanvas() {
}


window.addEventListener('resize', () => {
    checkOrientation();
});

window.addEventListener('load', () => {
    checkOrientation();
});


window.addEventListener('keydown', (event) => {
    if (world && !world.isGameOver && !world.isGameWon && !world.gamePaused) {
        if (event.keyCode == 39) {
            keyboard.RIGHT = true;
        }
        if (event.keyCode == 37) {
            keyboard.LEFT = true;
        }
        if (event.keyCode == 38) {
            keyboard.UP = true;
        }
        if (event.keyCode == 40) {
            keyboard.DOWN = true;
        }
        if (event.keyCode == 32) {
            keyboard.SPACE = true;
            event.preventDefault();
        }
    }
    if (event.keyCode == 13) {
        toggleFullscreen();
        event.preventDefault();
    }
});

window.addEventListener('keyup', (event) => {
    if (world && !world.isGameOver && !world.isGameWon && !world.gamePaused) {
        if (event.keyCode == 39) {
            keyboard.RIGHT = false;
        }
        if (event.keyCode == 37) {
            keyboard.LEFT = false;
        }
        if (event.keyCode == 38) {
            keyboard.UP = false;
        }
        if (event.keyCode == 40) {
            keyboard.DOWN = false;
        }
        if (event.keyCode == 32) {
            keyboard.SPACE = false;
        }
    }
});

function addMobileEventListeners() {
    document.getElementById('btnLeft').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    }, { passive: false });
    document.getElementById('btnLeft').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.LEFT = false;
    }, { passive: false });

    document.getElementById('btnRight').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    }, { passive: false });
    document.getElementById('btnRight').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
    }, { passive: false });

    document.getElementById('btnJump').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.UP = true;
    }, { passive: false });
    document.getElementById('btnJump').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.UP = false;
    }, { passive: false });

    document.getElementById('btnThrow').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.SPACE = true;
    }, { passive: false });
    document.getElementById('btnThrow').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.SPACE = false;
    }, { passive: false });
}