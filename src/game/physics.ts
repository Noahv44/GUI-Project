import * as THREE from 'three';

export function detectCollision(ballPosition: THREE.Vector3, obstaclePosition: THREE.Vector3, obstacleSize: THREE.Vector3): boolean {
    const distance = ballPosition.distanceTo(obstaclePosition);
    const radius = 0.1; // Golf ball radius
    const collisionDistance = radius + Math.max(obstacleSize.x, obstacleSize.y, obstacleSize.z) / 2;

    return distance < collisionDistance;
}

export function resolveCollision(ballPosition: THREE.Vector3, ballVelocity: THREE.Vector3, obstaclePosition: THREE.Vector3, obstacleSize: THREE.Vector3): THREE.Vector3 {
    if (detectCollision(ballPosition, obstaclePosition, obstacleSize)) {
        const normal = ballPosition.clone().sub(obstaclePosition).normalize();
        const velocityAlongNormal = ballVelocity.dot(normal);
        
        if (velocityAlongNormal > 0) return ballVelocity; // Moving away from the obstacle

        const restitution = 0.8; // Coefficient of restitution
        const impulseMagnitude = -(1 + restitution) * velocityAlongNormal;
        const impulse = normal.clone().multiplyScalar(impulseMagnitude);

        return ballVelocity.add(impulse);
    }
    return ballVelocity;
}

export function applyGravity(velocity: THREE.Vector3, deltaTime: number, gravity: number = 9.81): THREE.Vector3 {
    velocity.y -= gravity * deltaTime;
    return velocity;
}

export function applyFriction(velocity: THREE.Vector3, frictionCoefficient: number = 0.98): THREE.Vector3 {
    return velocity.multiplyScalar(frictionCoefficient);
}

export function checkBoundaries(position: THREE.Vector3, bounds: { min: THREE.Vector3, max: THREE.Vector3 }): THREE.Vector3 {
    const newPosition = position.clone();
    
    if (newPosition.x < bounds.min.x) newPosition.x = bounds.min.x;
    if (newPosition.x > bounds.max.x) newPosition.x = bounds.max.x;
    if (newPosition.z < bounds.min.z) newPosition.z = bounds.min.z;
    if (newPosition.z > bounds.max.z) newPosition.z = bounds.max.z;
    
    return newPosition;
}