import * as THREE from 'three';

export interface GameObject {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
    update: (deltaTime: number) => void;
}

export interface GameState {
    currentHole: number;
    totalHoles: number;
    strokes: number[];
    gameComplete: boolean;
}

export interface InputState {
    mouseDown: boolean;
    mousePosition: THREE.Vector2;
    keyPressed: { [key: string]: boolean };
}

export interface HoleData {
    startPosition: THREE.Vector3;
    holePosition: THREE.Vector3;
    par: number;
}