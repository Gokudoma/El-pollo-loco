let canvas;
let world;
let keyboard = new Keyboard(); 

function init(){
    canvas = document.getElementById('canvas');
    resizeCanvas();
    world = new World(canvas, keyboard); 
    addMobileEventListeners();
    checkOrientation();
}

function startGame() {
    document.getElementById('startScreen').classList.add('d-none');
    document.getElementById('canvas').classList.remove('d-none');
    init();
}

function toggleFullscreen() {
    let canvas = document.getElementById('canvas'); 

    if (!document.fullscreenElement) { 
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) { 
            canvas.webkitRequestFullscreen();
        } else if (canvas.msRequestFullscreen) { 
            canvas.msRequestFullscreen();
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
}

function goToNextLevelFromButton() {
    if (world) {
        world.goToNextLevel();
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

document.addEventListener('DOMContentLoaded', () => {
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
        }
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
