let canvas;
let world;
let keyboard = new Keyboard(); 

function init(){
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard); 
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


window.addEventListener('keydown', (event) => {
    if (!document.getElementById('canvas').classList.contains('d-none')) {
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
    if (!document.getElementById('canvas').classList.contains('d-none')) {
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
