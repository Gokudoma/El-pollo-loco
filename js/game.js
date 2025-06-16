let canvas;
let world;
let keyboard = new Keyboard(); 

function resetKeyboardState() {
    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
}

function checkOrientation() {
    const orientationMessage = document.getElementById('orientationMessage');
    const canvasElement = document.getElementById('canvas');
    const mobileControls = document.querySelector('.mobile-controls-wrapper');
    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const levelCompleteScreen = document.getElementById('levelCompleteScreen');
    const gameWonScreen = document.getElementById('gameWonScreen');

    if (window.innerWidth <= 770 && window.innerHeight > window.innerWidth) {
        orientationMessage.classList.remove('d-none');
        canvasElement.classList.add('d-none');
        mobileControls.classList.add('d-none');
        startScreen.classList.add('d-none');
        gameOverScreen.classList.add('d-none');
        levelCompleteScreen.classList.add('d-none');
        gameWonScreen.classList.add('d-none');
    } else {
        orientationMessage.classList.add('d-none');

        const gameActive = startScreen.classList.contains('d-none') && 
                           gameOverScreen.classList.contains('d-none') &&
                           levelCompleteScreen.classList.contains('d-none') &&
                           gameWonScreen.classList.contains('d-none');

        if (gameActive) {
            canvasElement.classList.remove('d-none');
            if (window.innerWidth <= 769) {
                mobileControls.classList.remove('d-none');
            } else {
                mobileControls.classList.add('d-none');
            }
        } else {
            canvasElement.classList.add('d-none');
            mobileControls.classList.add('d-none');
        }
    }
}


function init(){
    canvas = document.getElementById('canvas');
    resizeCanvas();
    world = new World(canvas, keyboard); 
    addMobileEventListeners();
}

function startGame() {
    document.getElementById('startScreen').classList.add('d-none');
    init();
    resetKeyboardState();
    checkOrientation();
}

function toggleFullscreen() {
    let gameWrapper = document.querySelector('.game-wrapper');

    if (!document.fullscreenElement) { 
        if (gameWrapper.requestFullscreen) {
            gameWrapper.requestFullscreen();
        } else if (gameWrapper.webkitRequestFullscreen) {
            gameWrapper.webkitRequestFullscreen();
        } else if (gameWrapper.msRequestFullscreen) {
            gameWrapper.msRequestFullscreen();
        }
        document.getElementById('fullscreenBtn').innerText = 'Fenstermodus';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        document.getElementById('fullscreenBtn').innerText = 'Vollbild';
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
    const aspectRatio = 720 / 480;
    let newWidth = window.innerWidth * 0.9;
    let newHeight = newWidth / aspectRatio;

    if (newWidth > 720) {
        newWidth = 720;
        newHeight = 480;
    }

    if (newHeight > window.innerHeight * 0.7) {
        newHeight = window.innerHeight * 0.7;
        newWidth = newHeight * aspectRatio;
    }

    canvas.width = newWidth;
    canvas.height = newHeight;
}


window.addEventListener('resize', () => {
    if (canvas) {
        resizeCanvas();
    }
    checkOrientation();
});

window.addEventListener('load', () => {
    checkOrientation();
});


window.addEventListener('keydown', (event) => {
    if (world && !world.isGameOver && !world.isGameWon) {
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
    if (world && !world.isGameOver && !world.isGameWon) {
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
