import * as THREE from 'three';
import { detectCollision, resolveCollision } from './physics';

export class Golf {
    public ball: THREE.Mesh;
    public velocity: THREE.Vector3;
    public isMoving: boolean;
    public radius: number;
    public startPosition: THREE.Vector3;
    public strokes: number;

    constructor(scene: THREE.Scene, startPosition: THREE.Vector3 = new THREE.Vector3(0, 0.5, 0)) {
        this.radius = 0.1;
        this.startPosition = startPosition.clone();
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isMoving = false;
        this.strokes = 0;

        // Create golf ball geometry and material
        const ballGeometry = new THREE.SphereGeometry(this.radius, 16, 16);
        const ballMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            shininess: 100
        });
        
        this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
        this.ball.position.copy(this.startPosition);
        this.ball.castShadow = true;
        
        scene.add(this.ball);
    }

    hitBall(force?: THREE.Vector3) {
        if (this.isMoving) return; // Don't hit if ball is already moving
        
        if (!force) {
            // Default force when hitting with spacebar
            force = new THREE.Vector3(0, 0, -5);
        }
        
        this.velocity.copy(force);
        this.isMoving = true;
        this.strokes++;
        
        console.log(`Stroke ${this.strokes}: Ball hit with force`, force);
    }

    resetBall() {
        this.ball.position.copy(this.startPosition);
        this.velocity.set(0, 0, 0);
        this.isMoving = false;
        this.strokes = 0;
        
        console.log('Ball reset to starting position');
    }

    update(deltaTime: number, obstacles: THREE.Object3D[] = []) {
        if (!this.isMoving) return;

        // Apply gravity
        this.velocity.y -= 9.81 * deltaTime;

        // Calculate next position
        const nextPosition = this.ball.position.clone().add(
            this.velocity.clone().multiplyScalar(deltaTime)
        );

        // Ground collision
        if (nextPosition.y <= this.radius) {
            nextPosition.y = this.radius;
            this.velocity.y = -this.velocity.y * 0.6; // Bounce with damping
            this.velocity.x *= 0.8; // Ground friction
            this.velocity.z *= 0.8;
        }

        // Check collisions with obstacles
        for (const obstacle of obstacles) {
            const obstacleBox = new THREE.Box3().setFromObject(obstacle);
            const ballSphere = new THREE.Sphere(nextPosition, this.radius);
            
            if (obstacleBox.intersectsSphere(ballSphere)) {
                // Simple collision response - reverse velocity component
                const center = obstacleBox.getCenter(new THREE.Vector3());
                const direction = nextPosition.clone().sub(center).normalize();
                this.velocity.reflect(direction).multiplyScalar(0.8);
            }
        }

        // Update position
        this.ball.position.copy(nextPosition);

        // Apply air resistance and friction
        this.velocity.multiplyScalar(0.995);

        // Stop the ball if velocity is very low
        if (this.velocity.length() < 0.1) {
            this.velocity.set(0, 0, 0);
            this.isMoving = false;
            console.log('Ball stopped moving');
        }
    }

    getPosition(): THREE.Vector3 {
        return this.ball.position.clone();
    }

    getStrokes(): number {
        return this.strokes;
    }

    isInHole(holePosition: THREE.Vector3, holeRadius: number): boolean {
        const distance = this.ball.position.distanceTo(holePosition);
        return distance < holeRadius && Math.abs(this.ball.position.y - holePosition.y) < 0.2;
    }
}