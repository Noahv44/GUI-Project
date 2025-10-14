import * as THREE from 'three';
// TypeScript declarations for global Golf and Jungle
declare const Golf: any;
declare const Jungle: any;

interface GameState {
    currentHole: number;
    totalHoles: number;
    strokes: number[];
    gameComplete: boolean;
}

interface InputState {
    mouseDown: boolean;
    mousePosition: any;
    keyPressed: { [key: string]: boolean };
}

// Game objects
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let golf: any;
let jungle: any;

// Game state
let gameState: GameState;
let inputState: InputState;
let clock: THREE.Clock;
let gameWon: boolean = false;

// UI elements
let uiContainer: HTMLDivElement;
let strokeCounter: HTMLDivElement;
let instructions: HTMLDivElement;
let winMessage: HTMLDivElement;

function init() {
    // Initialize THREE.js
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Initialize game objects
    jungle = new Jungle();
    jungle.loadScene(scene);
    
    golf = new Golf(scene, new THREE.Vector3(0, 0.5, 8));

    // Set camera position
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);

    // Initialize game state
    gameState = {
        currentHole: 1,
        totalHoles: 1,
        strokes: [],
        gameComplete: false
    };

    inputState = {
        mouseDown: false,
        mousePosition: new THREE.Vector2(),
        keyPressed: {}
    };

    clock = new THREE.Clock();

    // Setup UI
    setupUI();

    // Event listeners
    setupEventListeners();

    console.log('Escape the Jungle Mini Golf initialized!');
    console.log('Controls: SPACE to hit ball, R to reset, Mouse to aim');
}

function setupUI() {
    // Create UI container
    uiContainer = document.createElement('div');
    uiContainer.style.position = 'absolute';
    uiContainer.style.top = '20px';
    uiContainer.style.left = '20px';
    uiContainer.style.color = 'white';
    uiContainer.style.fontFamily = 'Arial, sans-serif';
    uiContainer.style.fontSize = '18px';
    uiContainer.style.zIndex = '100';
    document.body.appendChild(uiContainer);

    // Stroke counter
    strokeCounter = document.createElement('div');
    strokeCounter.innerHTML = 'Strokes: 0';
    uiContainer.appendChild(strokeCounter);

    // Instructions
    instructions = document.createElement('div');
    instructions.style.marginTop = '10px';
    instructions.innerHTML = `
        <div>SPACE: Hit ball</div>
        <div>R: Reset ball</div>
        <div>Get the ball in the black hole!</div>
    `;
    uiContainer.appendChild(instructions);

    // Win message
    winMessage = document.createElement('div');
    winMessage.style.position = 'absolute';
    winMessage.style.top = '50%';
    winMessage.style.left = '50%';
    winMessage.style.transform = 'translate(-50%, -50%)';
    winMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    winMessage.style.color = 'white';
    winMessage.style.padding = '20px';
    winMessage.style.borderRadius = '10px';
    winMessage.style.fontSize = '24px';
    winMessage.style.textAlign = 'center';
    winMessage.style.display = 'none';
    winMessage.style.zIndex = '200';
    document.body.appendChild(winMessage);
}

function setupEventListeners() {
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keydown', handleKeyDown, false);
    document.addEventListener('keyup', handleKeyUp, false);
    document.addEventListener('mousedown', handleMouseDown, false);
    document.addEventListener('mouseup', handleMouseUp, false);
    document.addEventListener('mousemove', handleMouseMove, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function handleKeyDown(event: KeyboardEvent) {
    inputState.keyPressed[event.code] = true;

    switch (event.code) {
        case 'Space':
            event.preventDefault();
            if (!golf.isMoving) {
                // Calculate force based on some default or UI input
                const force = new THREE.Vector3(0, 1, -8);
                golf.hitBall(force);
            }
            break;
        case 'KeyR':
            golf.resetBall();
            gameWon = false;
            winMessage.style.display = 'none';
            break;
    }
}

function handleKeyUp(event: KeyboardEvent) {
    inputState.keyPressed[event.code] = false;
}

function handleMouseDown(event: MouseEvent) {
    inputState.mouseDown = true;
    inputState.mousePosition.set(event.clientX, event.clientY);
}

function handleMouseUp(event: MouseEvent) {
    inputState.mouseDown = false;
}

function handleMouseMove(event: MouseEvent) {
    inputState.mousePosition.set(event.clientX, event.clientY);
}

function updateGame() {
    const deltaTime = clock.getDelta();

    // Update golf ball
    golf.update(deltaTime, jungle.getObstacles());

    // Update jungle environment
    jungle.update(deltaTime);

    // Check win condition
    if (!gameWon && golf.isInHole(jungle.getHolePosition(), jungle.getHoleRadius())) {
        gameWon = true;
        showWinMessage();
    }

    // Update UI
    updateUI();
}

function updateUI() {
    strokeCounter.innerHTML = `Strokes: ${golf.getStrokes()}`;
}

function showWinMessage() {
    const strokes = golf.getStrokes();
    let performance = '';
    
    if (strokes === 1) performance = 'Hole in One! 🎉';
    else if (strokes <= 3) performance = 'Great job! 👏';
    else if (strokes <= 5) performance = 'Well done! 👍';
    else performance = 'Keep practicing! 💪';

    winMessage.innerHTML = `
        <div style="font-size: 32px; margin-bottom: 10px;">🎯 HOLE!</div>
        <div>${performance}</div>
        <div>Strokes: ${strokes}</div>
        <div style="margin-top: 15px; font-size: 16px;">Press R to play again</div>
    `;
    winMessage.style.display = 'block';
    
    console.log(`Hole completed in ${strokes} strokes!`);
}

function animate() {
    requestAnimationFrame(animate);
    
    updateGame();
    renderer.render(scene, camera);
}

// Start the game
init();
animate();