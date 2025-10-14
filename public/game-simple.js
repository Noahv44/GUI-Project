// Escape the Jungle Mini Golf - Simple Version
// All-in-one JavaScript file for easy browser compatibility

console.log('🌴 Game Loading - Version 4.4 - Enhanced Camera & Hole Indicator!');

// Club definitions
const CLUBS = {
    DRIVER: {
        name: 'Driver',
        maxDistance: 40,
        maxHeight: 8,
        number: 1,
        color: 0xff0000,
        backspin: false
    },
    IRON: {
        name: 'Iron',
        maxDistance: 25,
        maxHeight: 12,
        number: 2,
        color: 0x0088ff,
        backspin: true
    },
    WEDGE: {
        name: 'Wedge',
        maxDistance: 15,
        maxHeight: 15,
        number: 3,
        color: 0xffaa00,
        backspin: true
    },
    PUTTER: {
        name: 'Putter',
        maxDistance: 10,
        maxHeight: 0.5,
        number: 4,
        color: 0x00ff00,
        backspin: false
    }
};

class Golfer {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        
        // Create body
        const bodyGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.6, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4444ff });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.y = 0.6;
        this.body.castShadow = true;
        this.group.add(this.body);
        
        // Create head
        const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.position.y = 1.05;
        this.head.castShadow = true;
        this.group.add(this.head);
        
        // Create arms
        const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 6);
        const armMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        
        this.leftArm = new THREE.Mesh(armGeometry, armMaterial);
        this.leftArm.position.set(-0.2, 0.65, 0);
        this.leftArm.rotation.z = 0.3;
        this.group.add(this.leftArm);
        
        this.rightArm = new THREE.Mesh(armGeometry, armMaterial);
        this.rightArm.position.set(0.2, 0.65, 0);
        this.rightArm.rotation.z = -0.3;
        this.group.add(this.rightArm);
        
        // Create club
        this.clubGroup = new THREE.Group();
        
        // Club shaft
        const shaftGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 6);
        const shaftMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        this.clubShaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
        this.clubShaft.position.y = 0.6;
        this.clubGroup.add(this.clubShaft);
        
        // Club head
        const headGeom = new THREE.BoxGeometry(0.15, 0.08, 0.08);
        const headMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
        this.clubHead = new THREE.Mesh(headGeom, headMat);
        this.clubHead.position.y = 0;
        this.clubHead.castShadow = true;
        this.clubGroup.add(this.clubHead);
        
        // Position club in front of golfer
        this.clubGroup.position.set(0, 0.2, 0.3);
        this.group.add(this.clubGroup);
        
        // Animation state
        this.isSwinging = false;
        this.swingProgress = 0;
        this.swingSpeed = 8; // radians per second
        
        scene.add(this.group);
    }
    
    setPosition(x, z) {
        this.group.position.set(x, 0, z);
    }
    
    setRotation(angle) {
        this.group.rotation.y = angle;
    }
    
    startSwing() {
        this.isSwinging = true;
        this.swingProgress = 0;
    }
    
    updateSwing(deltaTime) {
        if (!this.isSwinging) return false;
        
        this.swingProgress += deltaTime * this.swingSpeed;
        
        // Pendulum swing: backswing, downswing through ball, follow-through
        if (this.swingProgress <= Math.PI / 3) {
            // Backswing - club goes back
            this.clubGroup.rotation.x = -this.swingProgress * 1.5;
        } else if (this.swingProgress <= Math.PI * 0.6) {
            // Downswing through impact zone
            const downswingProgress = (this.swingProgress - Math.PI / 3) / (Math.PI * 0.3);
            this.clubGroup.rotation.x = -Math.PI / 2 + downswingProgress * (Math.PI / 2);
        } else if (this.swingProgress <= Math.PI) {
            // Follow-through
            const followProgress = (this.swingProgress - Math.PI * 0.6) / (Math.PI * 0.4);
            this.clubGroup.rotation.x = followProgress * (Math.PI / 4);
        } else {
            // Swing complete - return to rest
            this.clubGroup.rotation.x = 0;
            this.isSwinging = false;
            return true; // Signal swing complete
        }
        
        return false;
    }
    
    remove() {
        this.scene.remove(this.group);
    }
}

class Golf {
    constructor(scene, startPosition = new THREE.Vector3(0, 0.5, 0)) {
        this.scene = scene;
        this.radius = 0.1;
        this.startPosition = startPosition.clone();
        this.lastValidPosition = startPosition.clone();
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isMoving = false;
        this.strokes = 0;
        this.currentClub = CLUBS.DRIVER;
        this.backspin = 0; // Backspin effect
        this.airTime = 0; // Track time in air

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
        
        // Create golfer character
        this.golfer = new Golfer(scene);
        this.updateGolferPosition();
    }
    
    updateGolferPosition(aimAngle = null) {
        // Position golfer to the side of the ball
        const ballPos = this.ball.position;
        
        if (aimAngle !== null) {
            // Position golfer perpendicular to shot direction (90 degrees to the right)
            const sideAngle = aimAngle + Math.PI / 2;
            const offset = 0.6; // Distance from ball
            
            const golferX = ballPos.x + Math.sin(sideAngle) * offset;
            const golferZ = ballPos.z + Math.cos(sideAngle) * offset;
            
            this.golfer.setPosition(golferX, golferZ);
            // Golfer faces the ball (perpendicular to their offset)
            this.golfer.setRotation(aimAngle);
        } else {
            // Default position (behind ball)
            this.golfer.setPosition(ballPos.x + 0.6, ballPos.z);
            this.golfer.setRotation(0);
        }
    }
    
    setClub(clubType) {
        this.currentClub = clubType;
        console.log(`Selected ${clubType.name}`);
    }
    
    getClub() {
        return this.currentClub;
    }

    hitBall(force, direction) {
        if (this.isMoving) return false;
        
        // Start swing animation
        this.golfer.startSwing();
        
        // Calculate velocity based on club and power
        const power = force; // 0 to 1
        const distance = this.currentClub.maxDistance * power;
        const height = this.currentClub.maxHeight * power;
        
        // Calculate launch angle for realistic trajectory
        const horizontalSpeed = distance * 0.8;
        const verticalSpeed = Math.sqrt(2 * 9.81 * height);
        
        // Apply faster flight for longer shots
        const speedMultiplier = 1 + (power * 0.5);
        
        this.velocity.set(
            direction.x * horizontalSpeed * speedMultiplier,
            verticalSpeed,
            direction.z * horizontalSpeed * speedMultiplier
        );
        
        // Apply backspin for irons
        if (this.currentClub.backspin) {
            this.backspin = power * 0.3; // Backspin strength
        }
        
        this.isMoving = true;
        this.strokes++;
        this.airTime = 0;
        
        console.log(`⛳ Stroke ${this.strokes}: ${this.currentClub.name} - Power ${(power * 100).toFixed(0)}%`);
        
        return true;
    }

    resetBall() {
        this.ball.position.copy(this.startPosition);
        this.lastValidPosition.copy(this.startPosition);
        this.velocity.set(0, 0, 0);
        this.isMoving = false;
        this.strokes = 0;
        this.backspin = 0;
        this.updateGolferPosition();
        
        console.log('Ball reset to starting position');
    }
    
    resetToLastPosition() {
        this.ball.position.copy(this.lastValidPosition);
        this.velocity.set(0, 0, 0);
        this.isMoving = false;
        this.backspin = 0;
        this.strokes++; // Penalty stroke
        this.updateGolferPosition();
        
        console.log('⚠️ Ball reset to last valid position - Penalty stroke!');
    }

    update(deltaTime, obstacles = [], boundaries = null, waterHazards = []) {
        // Update swing animation
        const swingComplete = this.golfer.updateSwing(deltaTime);
        
        if (!this.isMoving) return { inBounds: true, hitWater: false };

        // Apply gravity
        this.velocity.y -= 9.81 * deltaTime;
        
        // Track air time
        if (this.ball.position.y > this.radius) {
            this.airTime += deltaTime;
        }

        // Calculate next position
        const nextPosition = this.ball.position.clone().add(
            this.velocity.clone().multiplyScalar(deltaTime)
        );

        // Ground collision
        if (nextPosition.y <= this.radius) {
            nextPosition.y = this.radius;
            
            // Realistic bounce
            if (Math.abs(this.velocity.y) > 1) {
                this.velocity.y = -this.velocity.y * 0.4; // Bounce
            } else {
                this.velocity.y = 0; // Stop bouncing
            }
            
            // Ground friction and roll
            this.velocity.x *= 0.85;
            this.velocity.z *= 0.85;
            
            // Apply backspin effect on landing
            if (this.backspin > 0 && this.airTime > 0.3) {
                // Backspin makes ball roll backward
                const backspinForce = this.backspin * 5;
                this.velocity.x -= this.velocity.x * backspinForce * deltaTime;
                this.velocity.z -= this.velocity.z * backspinForce * deltaTime;
                this.backspin *= 0.95; // Decay backspin
            }
            
            this.airTime = 0;
        }

        // Check collisions with obstacles - improved collision detection
        let collided = false;
        for (const obstacle of obstacles) {
            const obstacleBox = new THREE.Box3().setFromObject(obstacle);
            
            // Check both current and next position to prevent tunneling
            const currentSphere = new THREE.Sphere(this.ball.position, this.radius);
            const nextSphere = new THREE.Sphere(nextPosition, this.radius);
            
            if (obstacleBox.intersectsSphere(nextSphere) || obstacleBox.intersectsSphere(currentSphere)) {
                collided = true;
                
                // Get closest point on obstacle to ball
                const closestPoint = new THREE.Vector3();
                obstacleBox.clampPoint(nextPosition, closestPoint);
                
                // Calculate collision normal (direction away from obstacle)
                const collisionNormal = nextPosition.clone().sub(closestPoint);
                const distance = collisionNormal.length();
                
                if (distance > 0) {
                    collisionNormal.normalize();
                } else {
                    // Ball is inside - push away from center
                    const center = obstacleBox.getCenter(new THREE.Vector3());
                    collisionNormal.copy(nextPosition.clone().sub(center)).normalize();
                }
                
                // Push ball out of obstacle
                const penetrationDepth = this.radius - distance;
                if (penetrationDepth > 0 || distance < this.radius) {
                    nextPosition.add(collisionNormal.multiplyScalar(Math.max(penetrationDepth + 0.05, this.radius * 1.1)));
                }
                
                // Reflect velocity with significant energy loss
                const velocityDotNormal = this.velocity.dot(collisionNormal);
                if (velocityDotNormal < 0) {
                    // Only reflect if moving toward obstacle
                    this.velocity.reflect(collisionNormal).multiplyScalar(0.4);
                }
                
                // Strong push away to prevent getting stuck
                this.velocity.add(collisionNormal.multiplyScalar(1.5));
                
                break; // Only handle one collision per frame
            }
        }

        // Update position
        this.ball.position.copy(nextPosition);
        
        // Check boundaries - now bounces off walls instead of resetting
        if (boundaries) {
            const pos = this.ball.position;
            let bounced = false;
            
            // X boundaries (left/right walls)
            if (pos.x < boundaries.minX) {
                pos.x = boundaries.minX;
                this.velocity.x = Math.abs(this.velocity.x) * 0.6; // Bounce right
                bounced = true;
            } else if (pos.x > boundaries.maxX) {
                pos.x = boundaries.maxX;
                this.velocity.x = -Math.abs(this.velocity.x) * 0.6; // Bounce left
                bounced = true;
            }
            
            // Z boundaries (front/back walls)
            if (pos.z < boundaries.minZ) {
                pos.z = boundaries.minZ;
                this.velocity.z = Math.abs(this.velocity.z) * 0.6; // Bounce forward
                bounced = true;
            } else if (pos.z > boundaries.maxZ) {
                pos.z = boundaries.maxZ;
                this.velocity.z = -Math.abs(this.velocity.z) * 0.6; // Bounce backward
                bounced = true;
            }
            
            if (bounced) {
                console.log('🎾 Ball bounced off wall!');
            }
        }
        
        // Check water hazards (keep this check)
        for (const water of waterHazards) {
            if (this.ball.position.distanceTo(water.position) < water.radius &&
                this.ball.position.y <= this.radius + 0.1) {
                return { inBounds: true, hitWater: true };
            }
        }

        // Apply air resistance
        if (this.ball.position.y > this.radius) {
            this.velocity.multiplyScalar(0.99); // Air resistance
        } else {
            this.velocity.multiplyScalar(0.96); // Ground friction
        }

        // Stop the ball if velocity is very low and on ground
        if (this.velocity.length() < 0.15 && this.ball.position.y <= this.radius + 0.01) {
            this.velocity.set(0, 0, 0);
            this.isMoving = false;
            this.lastValidPosition.copy(this.ball.position); // Save valid position
            this.updateGolferPosition();
            console.log('Ball stopped moving');
        }
        
        return { inBounds: true, hitWater: false };
    }

    getPosition() {
        return this.ball.position.clone();
    }

    getStrokes() {
        return this.strokes;
    }

    isInHole(holePosition, holeRadius) {
        const distance = this.ball.position.distanceTo(holePosition);
        return distance < holeRadius && Math.abs(this.ball.position.y - holePosition.y) < 0.2;
    }
}

class Jungle {
    constructor() {
        this.obstacles = [];
        this.waterHazards = [];
        this.holeRadius = 0.5;
        this.boundaries = {
            minX: -25,
            maxX: 25,
            minZ: -35,
            maxZ: 10
        };
    }
    
    getBoundaries() {
        return this.boundaries;
    }
    
    getWaterHazards() {
        return this.waterHazards;
    }

    loadScene(scene, holeData) {
        this.scene = scene;
        this.holePosition = holeData.holePosition.clone();
        this.holeData = holeData;
        
        // Set mystical jungle/forest background with fog
        scene.background = new THREE.Color(0x4a6741); // Deep forest green
        scene.fog = new THREE.Fog(0x4a6741, 20, 60); // Add atmospheric fog
        
        // Add lighting
        this.setupLighting();
        
        // Create ground
        this.createGround();
        
        // Create the hole
        this.createHole();
        
        // Create boundary walls
        this.createBoundaryWalls();
        
        // Add water hazards
        this.createWaterHazards();
        
        // Add jungle obstacles
        this.createObstacles();
        
        // Add jungle decorations
        this.addDecorations();
        
        // Add dense forest background
        this.createForestBackground();
    }

    setupLighting() {
        // Ambient light for jungle atmosphere
        const ambientLight = new THREE.AmbientLight(0x6b8e6b, 0.5); // Soft green ambient
        this.scene.add(ambientLight);

        // Directional light (sunlight through canopy)
        const directionalLight = new THREE.DirectionalLight(0xffeecc, 0.7);
        directionalLight.position.set(15, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    createGround() {
        // Create textured jungle ground
        const groundGeometry = new THREE.PlaneGeometry(60, 50);
        
        // Create a more natural grass-like material
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2d5016,  // Rich forest floor green
            side: THREE.DoubleSide 
        });
        
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
        
        // Add dirt path texture with darker stripes
        for (let i = 0; i < 30; i++) {
            const pathGeometry = new THREE.PlaneGeometry(8, 0.5);
            const pathMaterial = new THREE.MeshLambertMaterial({
                color: 0x3a5a1f,
                transparent: true,
                opacity: 0.3
            });
            const path = new THREE.Mesh(pathGeometry, pathMaterial);
            path.rotation.x = -Math.PI / 2;
            path.position.y = 0.01;
            path.position.z = -i * 1.5 + 5;
            this.scene.add(path);
        }
    }

    createHole() {
        // Create hole geometry
        const holeGeometry = new THREE.CylinderGeometry(this.holeRadius, this.holeRadius, 0.1, 16);
        const holeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        this.hole = new THREE.Mesh(holeGeometry, holeMaterial);
        this.hole.position.copy(this.holePosition);
        this.hole.position.y = -0.05; // Slightly below ground
        this.scene.add(this.hole);

        // Add hole rim
        const rimGeometry = new THREE.RingGeometry(this.holeRadius, this.holeRadius + 0.05, 16);
        const rimMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 }); // Brown
        this.rim = new THREE.Mesh(rimGeometry, rimMaterial);
        this.rim.rotation.x = -Math.PI / 2;
        this.rim.position.copy(this.holePosition);
        this.rim.position.y = 0.01;
        this.scene.add(this.rim);
        
        // Add flag pole (taller and thicker)
        const poleHeight = 3.5; // Taller pole
        const poleGeometry = new THREE.CylinderGeometry(0.03, 0.03, poleHeight, 8);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }); // White pole
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.copy(this.holePosition);
        pole.position.y = poleHeight / 2;
        pole.castShadow = true;
        this.scene.add(pole);
        
        // Add larger triangular flag
        const flagShape = new THREE.Shape();
        flagShape.moveTo(0, 0);
        flagShape.lineTo(1.2, 0.4); // Bigger flag
        flagShape.lineTo(0, 0.8);
        flagShape.lineTo(0, 0);
        
        const flagGeometry = new THREE.ShapeGeometry(flagShape);
        const flagMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff0000, // Red flag
            side: THREE.DoubleSide 
        });
        const flag = new THREE.Mesh(flagGeometry, flagMaterial);
        flag.position.copy(this.holePosition);
        flag.position.y = poleHeight - 0.4; // Near top of pole
        flag.rotation.y = Math.PI / 4; // Angle flag slightly
        flag.castShadow = true;
        this.scene.add(flag);
        
        // Create floating arrow indicator above hole
        this.createHoleIndicator();
    }
    
    createHoleIndicator() {
        // Create a group for the indicator
        this.holeIndicator = new THREE.Group();
        
        // Create downward-pointing arrow using cone
        const arrowGeometry = new THREE.ConeGeometry(0.3, 0.8, 4);
        const arrowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff00, // Bright yellow
            transparent: true,
            opacity: 0.9
        });
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow.rotation.x = Math.PI; // Point downward
        this.holeIndicator.add(arrow);
        
        // Add a glowing ring around the arrow
        const ringGeometry = new THREE.TorusGeometry(0.4, 0.08, 8, 16);
        const ringMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            transparent: true,
            opacity: 0.7
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        this.holeIndicator.add(ring);
        
        // Position the indicator high above the hole
        this.holeIndicator.position.copy(this.holePosition);
        this.holeIndicator.position.y = 6; // Float 6 units above hole
        
        this.scene.add(this.holeIndicator);
    }
    
    createBoundaryWalls() {
        // Create invisible walls at boundaries (physics only, no visuals)
        // Walls are handled purely by boundary collision in the Golf class
        // No visual walls needed - the ball just bounces off invisible boundaries
    }

    createObstacles() {
        // Clear existing obstacles
        this.obstacles = [];
        
        // Add obstacles based on hole configuration
        if (this.holeData && this.holeData.obstacles) {
            for (const obstacleData of this.holeData.obstacles) {
                switch (obstacleData.type) {
                    case 'stump':
                        this.addTreeStump(obstacleData.position);
                        break;
                    case 'rock':
                        this.addRock(obstacleData.position);
                        break;
                    case 'log':
                        this.addLog(obstacleData.position);
                        break;
                    case 'bush':
                        this.addBush(obstacleData.position);
                        break;
                    case 'temple':
                        this.addTempleBlock(obstacleData.position);
                        break;
                }
            }
        }
    }

    clearScene() {
        // Remove all obstacles from scene
        for (const obstacle of this.obstacles) {
            this.scene.remove(obstacle);
        }
        this.obstacles = [];
        
        // Remove water hazards
        for (const water of this.waterHazards) {
            this.scene.remove(water.mesh);
        }
        this.waterHazards = [];
        
        // Remove hole and rim if they exist
        if (this.hole) {
            this.scene.remove(this.hole);
        }
        if (this.rim) {
            this.scene.remove(this.rim);
        }
        
        // Remove hole indicator (floating arrow)
        if (this.holeIndicator) {
            this.scene.remove(this.holeIndicator);
            this.holeIndicator = null;
        }
    }
    
    createWaterHazards() {
        // Add water hazards based on hole
        const waterSpots = this.holeData.waterHazards || [];
        
        for (const spot of waterSpots) {
            this.addWaterHazard(spot.position, spot.radius || 2);
        }
    }
    
    addWaterHazard(position, radius = 2) {
        // Create water surface
        const waterGeometry = new THREE.CircleGeometry(radius, 32);
        const waterMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1e90ff,
            transparent: true,
            opacity: 0.7,
            shininess: 100
        });
        
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.position.copy(position);
        water.position.y = 0.05; // Slightly above ground
        water.rotation.x = -Math.PI / 2; // Lie flat
        water.receiveShadow = true;
        
        this.scene.add(water);
        
        // Store water hazard data
        this.waterHazards.push({
            mesh: water,
            position: position.clone(),
            radius: radius
        });
    }

    addTreeStump(position) {
        const stumpGeometry = new THREE.CylinderGeometry(0.5, 0.6, 1, 8);
        const stumpMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
        
        const stump = new THREE.Mesh(stumpGeometry, stumpMaterial);
        stump.position.copy(position);
        stump.position.y = 0.5;
        stump.castShadow = true;
        
        this.obstacles.push(stump);
        this.scene.add(stump);
    }

    addRock(position) {
        const rockGeometry = new THREE.DodecahedronGeometry(0.4);
        const rockMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 }); // Gray
        
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.copy(position);
        rock.position.y = 0.4;
        rock.castShadow = true;
        
        this.obstacles.push(rock);
        this.scene.add(rock);
    }

    addLog(position) {
        const logGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
        const logMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
        
        const log = new THREE.Mesh(logGeometry, logMaterial);
        log.position.copy(position);
        log.position.y = 0.2;
        log.rotation.z = Math.PI / 2; // Rotate to lie horizontally
        log.castShadow = true;
        
        this.obstacles.push(log);
        this.scene.add(log);
    }

    addBush(position) {
        // Create dense bush with multiple spheres clustered together
        const bushGroup = new THREE.Group();
        
        // Main bush body - larger green sphere
        const mainGeometry = new THREE.SphereGeometry(0.6, 8, 8);
        const bushMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2d5a2d // Dark green
        });
        
        const mainBush = new THREE.Mesh(mainGeometry, bushMaterial);
        mainBush.position.y = 0.4;
        mainBush.castShadow = true;
        bushGroup.add(mainBush);
        
        // Add smaller spheres for volume and realism
        const offsets = [
            { x: 0.3, y: 0.3, z: 0.2, size: 0.4 },
            { x: -0.3, y: 0.3, z: 0.1, size: 0.35 },
            { x: 0.1, y: 0.5, z: -0.3, size: 0.3 },
            { x: -0.2, y: 0.2, z: 0.3, size: 0.35 }
        ];
        
        for (const offset of offsets) {
            const smallGeometry = new THREE.SphereGeometry(offset.size, 6, 6);
            const smallBush = new THREE.Mesh(smallGeometry, bushMaterial);
            smallBush.position.set(offset.x, offset.y, offset.z);
            smallBush.castShadow = true;
            bushGroup.add(smallBush);
        }
        
        bushGroup.position.copy(position);
        
        // Add collision box for the bush
        const bushCollider = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 1.0, 1.2),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        bushCollider.position.y = 0.5;
        bushGroup.add(bushCollider);
        
        this.obstacles.push(bushGroup);
        this.scene.add(bushGroup);
    }

    addTempleBlock(position) {
        // Create ancient stone temple block
        const templeGroup = new THREE.Group();
        
        // Main stone block with weathered appearance
        const blockGeometry = new THREE.BoxGeometry(1.5, 1.2, 1.0);
        const stoneMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x8b8680 // Gray stone
        });
        
        const mainBlock = new THREE.Mesh(blockGeometry, stoneMaterial);
        mainBlock.position.y = 0.6;
        mainBlock.castShadow = true;
        templeGroup.add(mainBlock);
        
        // Add weathered detail - smaller blocks on top
        const detailGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.4);
        const detailMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x6b6660 // Darker stone
        });
        
        const detail1 = new THREE.Mesh(detailGeometry, detailMaterial);
        detail1.position.set(-0.4, 1.35, 0.2);
        detail1.castShadow = true;
        templeGroup.add(detail1);
        
        const detail2 = new THREE.Mesh(detailGeometry, detailMaterial);
        detail2.position.set(0.3, 1.35, -0.2);
        detail2.castShadow = true;
        templeGroup.add(detail2);
        
        // Add moss patches (small green cubes)
        const mossGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.3);
        const mossMaterial = new THREE.MeshLambertMaterial({ color: 0x3a5a40 });
        
        for (let i = 0; i < 3; i++) {
            const moss = new THREE.Mesh(mossGeometry, mossMaterial);
            moss.position.set(
                (Math.random() - 0.5) * 1.2,
                Math.random() * 0.8 + 0.2,
                (Math.random() - 0.5) * 0.8
            );
            moss.rotation.y = Math.random() * Math.PI;
            templeGroup.add(moss);
        }
        
        // Slightly rotate for ancient, settled look
        templeGroup.rotation.y = (Math.random() - 0.5) * 0.3;
        templeGroup.position.copy(position);
        
        this.obstacles.push(templeGroup);
        this.scene.add(templeGroup);
    }

    addDecorations() {
        // Add dense forest background
        this.createForestBackground();
        
        // Add some grass patches
        for (let i = 0; i < 20; i++) {
            this.addGrassClump(new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                0,
                (Math.random() - 0.5) * 20
            ));
        }

        // Add palm trees in the background
        this.addPalmTree(new THREE.Vector3(-8, 0, -10));
        this.addPalmTree(new THREE.Vector3(8, 0, -12));
        this.addPalmTree(new THREE.Vector3(-6, 0, 5));
    }

    createForestBackground() {
        // Create dense ring of trees around the play area
        const treeCount = 60; // Doubled tree count for denser forest
        const radius = 25; // Distance from center
        
        for (let i = 0; i < treeCount; i++) {
            const angle = (i / treeCount) * Math.PI * 2;
            const distance = radius + (Math.random() - 0.5) * 5; // Vary distance
            
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            
            // Alternate between different tree types
            if (Math.random() > 0.5) {
                this.addForestTree(new THREE.Vector3(x, 0, z));
            } else {
                this.addPalmTree(new THREE.Vector3(x, 0, z));
            }
        }
        
        // Add inner ring of trees for extra density
        const innerTreeCount = 40;
        const innerRadius = 32;
        for (let i = 0; i < innerTreeCount; i++) {
            const angle = (i / innerTreeCount) * Math.PI * 2;
            const distance = innerRadius + (Math.random() - 0.5) * 4;
            
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            
            if (Math.random() > 0.6) {
                this.addForestTree(new THREE.Vector3(x, 0, z));
            } else {
                this.addPalmTree(new THREE.Vector3(x, 0, z));
            }
        }
        
        // Add some closer bushes for depth
        for (let i = 0; i < 25; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 15 + Math.random() * 7;
            
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            
            this.addBackgroundBush(new THREE.Vector3(x, 0, z));
        }
    }

    addForestTree(position) {
        // Create a tall forest tree
        const treeGroup = new THREE.Group();
        
        // Trunk
        const trunkHeight = 8 + Math.random() * 4;
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, trunkHeight, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x4a3728 });
        
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = trunkHeight / 2;
        trunk.castShadow = true;
        treeGroup.add(trunk);
        
        // Canopy - multiple layers for volume
        const canopyMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x1a4d1a
        });
        
        const canopyLayers = 3;
        for (let i = 0; i < canopyLayers; i++) {
            const canopyGeometry = new THREE.ConeGeometry(
                2 - i * 0.3,
                2 + i * 0.5,
                8
            );
            const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
            canopy.position.y = trunkHeight + i * 1.5;
            canopy.castShadow = true;
            treeGroup.add(canopy);
        }
        
        treeGroup.position.copy(position);
        this.scene.add(treeGroup);
    }

    addBackgroundBush(position) {
        // Simpler bush for background
        const bushGeometry = new THREE.SphereGeometry(1 + Math.random() * 0.5, 6, 6);
        const bushMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2d5a2d
        });
        
        const bush = new THREE.Mesh(bushGeometry, bushMaterial);
        bush.position.copy(position);
        bush.position.y = 0.7;
        bush.castShadow = true;
        
        this.scene.add(bush);
    }

    addGrassClump(position) {
        const grassGeometry = new THREE.ConeGeometry(0.1, 0.3, 4);
        const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Forest green
        
        const grass = new THREE.Mesh(grassGeometry, grassMaterial);
        grass.position.copy(position);
        grass.position.y = 0.15;
        this.scene.add(grass);
    }

    addPalmTree(position) {
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 4, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.copy(position);
        trunk.position.y = 2;
        trunk.castShadow = true;
        this.scene.add(trunk);

        // Palm fronds
        const frondGeometry = new THREE.ConeGeometry(1, 2, 4);
        const frondMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const fronds = new THREE.Mesh(frondGeometry, frondMaterial);
        fronds.position.copy(position);
        fronds.position.y = 5;
        this.scene.add(fronds);
    }

    getObstacles() {
        return this.obstacles;
    }

    getHolePosition() {
        return this.holePosition.clone();
    }

    getHoleRadius() {
        return this.holeRadius;
    }

    update(deltaTime) {
        // Animate hole indicator - bob up and down and rotate
        if (this.holeIndicator) {
            // Bob up and down
            const time = Date.now() * 0.002; // Slower animation
            this.holeIndicator.position.y = this.holePosition.y + 6 + Math.sin(time) * 0.3;
            
            // Rotate slowly for visibility
            this.holeIndicator.rotation.y += deltaTime * 2; // Rotate around Y axis
        }
    }
}

// Game Configuration - Escape the Jungle Story
const holes = [
    {
        name: "Hole 1: The Jungle Entrance",
        story: "You've crashed in a mysterious jungle. Navigate through the entrance to find your way out!",
        startPosition: new THREE.Vector3(0, 0.5, 8),
        holePosition: new THREE.Vector3(0, 0, -12),
        par: 3,
        obstacles: [
            {type: 'stump', position: new THREE.Vector3(-3, 0, -2)},
            {type: 'stump', position: new THREE.Vector3(3, 0, -5)},
            {type: 'rock', position: new THREE.Vector3(0, 0, -7)},
            {type: 'rock', position: new THREE.Vector3(-2, 0, -10)},
            {type: 'bush', position: new THREE.Vector3(-4, 0, -8)},
            {type: 'bush', position: new THREE.Vector3(4, 0, -8)},
            {type: 'log', position: new THREE.Vector3(2, 0, -3)}
        ],
        waterHazards: [
            {position: new THREE.Vector3(-6, 0, 0), radius: 2.5},
            {position: new THREE.Vector3(6, 0, -4), radius: 2}
        ]
    },
    {
        name: "Hole 2: The Ancient Temple Path",
        story: "Ancient ruins block your path. Navigate through the sacred stones to continue your escape!",
        startPosition: new THREE.Vector3(-6, 0.5, 8),
        holePosition: new THREE.Vector3(6, 0, -15),
        par: 4,
        obstacles: [
            {type: 'temple', position: new THREE.Vector3(-3, 0, 0)},
            {type: 'temple', position: new THREE.Vector3(3, 0, -3)},
            {type: 'rock', position: new THREE.Vector3(-1, 0, -6)},
            {type: 'rock', position: new THREE.Vector3(1, 0, -9)},
            {type: 'rock', position: new THREE.Vector3(-2, 0, -12)},
            {type: 'stump', position: new THREE.Vector3(4, 0, -12)},
            {type: 'stump', position: new THREE.Vector3(-5, 0, -8)},
            {type: 'bush', position: new THREE.Vector3(-4, 0, -10)},
            {type: 'bush', position: new THREE.Vector3(5, 0, -6)},
            {type: 'log', position: new THREE.Vector3(0, 0, -14)}
        ],
        waterHazards: [
            {position: new THREE.Vector3(0, 0, -5), radius: 3},
            {position: new THREE.Vector3(-5, 0, -13), radius: 2}
        ]
    },
    {
        name: "Hole 3: The Final Escape",
        story: "The jungle's densest area stands between you and freedom. One final challenge awaits!",
        startPosition: new THREE.Vector3(0, 0.5, 10),
        holePosition: new THREE.Vector3(0, 0, -25),
        par: 5,
        obstacles: [
            {type: 'stump', position: new THREE.Vector3(-3, 0, -2)},
            {type: 'stump', position: new THREE.Vector3(3, 0, -2)},
            {type: 'stump', position: new THREE.Vector3(-2, 0, -6)},
            {type: 'stump', position: new THREE.Vector3(2, 0, -6)},
            {type: 'temple', position: new THREE.Vector3(0, 0, -8)},
            {type: 'temple', position: new THREE.Vector3(-4, 0, -15)},
            {type: 'rock', position: new THREE.Vector3(-4, 0, -12)},
            {type: 'rock', position: new THREE.Vector3(4, 0, -12)},
            {type: 'rock', position: new THREE.Vector3(0, 0, -10)},
            {type: 'log', position: new THREE.Vector3(-2, 0, -16)},
            {type: 'log', position: new THREE.Vector3(2, 0, -18)},
            {type: 'log', position: new THREE.Vector3(-1, 0, -21)},
            {type: 'bush', position: new THREE.Vector3(-5, 0, -20)},
            {type: 'bush', position: new THREE.Vector3(5, 0, -20)},
            {type: 'bush', position: new THREE.Vector3(-3, 0, -23)},
            {type: 'bush', position: new THREE.Vector3(3, 0, -23)},
            {type: 'stump', position: new THREE.Vector3(0, 0, -22)}
        ],
        waterHazards: [
            {position: new THREE.Vector3(-7, 0, -5), radius: 2.5},
            {position: new THREE.Vector3(7, 0, -10), radius: 2.5},
            {position: new THREE.Vector3(0, 0, -14), radius: 2}
        ]
    }
];

// Main Game Code
let scene, camera, renderer, golf, jungle;
let gameState, inputState, clock, gameWon = false;
let currentHole = 0;
let totalScore = [];
let uiContainer, strokeCounter, instructions, winMessage, powerDisplay, holeInfo, storyDisplay, clubDisplay, powerMeter, cameraViewDisplay;
let isPaused = false;
let pauseMenu = null;

// New power system
let isChargingPower = false;
let powerCharge = 0;
let maxPowerTime = 2.5; // seconds to reach max power

// Camera controls
let cameraAngle = 0;
let cameraDistance = 2; // Start very close for player view
let cameraHeight = 1.2; // Low, at player eye level
let cameraTarget = new THREE.Vector3(0, 0, 0);
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

// Camera view modes
let cameraMode = 'player'; // 'player', 'hole', 'follow'
let targetCameraDistance = 2; // Start close
let targetCameraHeight = 1.2; // Start low
let cameraLerpSpeed = 3; // Smooth camera transitions

function loadHole(holeIndex) {
    const holeData = holes[holeIndex];
    
    // Clear existing hole if it exists
    if (jungle && jungle.scene) {
        jungle.clearScene();
    }
    
    // Remove existing golf ball and golfer
    if (golf && golf.ball) {
        scene.remove(golf.ball);
        if (golf.golfer) {
            golf.golfer.remove();
        }
    }
    
    // Load new hole
    jungle.loadScene(scene, holeData);
    golf = new Golf(scene, holeData.startPosition);
    
    // Reset game state for new hole
    gameWon = false;
    isChargingPower = false;
    powerCharge = 0;
    
    // Remove aim line
    if (aimLine) {
        scene.remove(aimLine);
        aimLine = null;
    }
    
    // Update UI with story
    updateHoleInfo();
    updateClubDisplay();
    
    console.log(`Loaded ${holeData.name}`);
}

function nextHole() {
    // Save current score
    totalScore[currentHole] = golf.getStrokes();
    
    currentHole++;
    
    if (currentHole >= holes.length) {
        // Game complete
        showFinalScore();
        return;
    }
    
    // Load next hole
    loadHole(currentHole);
    gameState.currentHole = currentHole + 1;
    
    // Update UI
    updateHoleInfo();
    updateAimLine();
}

function showFinalScore() {
    const totalStrokes = totalScore.reduce((sum, strokes) => sum + strokes, 0);
    const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0);
    const scoreDiff = totalStrokes - totalPar;
    
    let performance;
    if (scoreDiff <= -5) performance = "🏆 Amazing! You're a mini-golf champion!";
    else if (scoreDiff <= -2) performance = "🥇 Excellent performance!";
    else if (scoreDiff <= 0) performance = "🥈 Great job!";
    else if (scoreDiff <= 3) performance = "🥉 Good effort!";
    else performance = "💪 Keep practicing!";
    
    winMessage.innerHTML = `
        <div style="font-size: 32px; margin-bottom: 15px;">🎊 COURSE COMPLETE! 🎊</div>
        <div>${performance}</div>
        <div style="margin: 15px 0;">
            <div>Total Strokes: ${totalStrokes}</div>
            <div>Course Par: ${totalPar}</div>
            <div>Score: ${scoreDiff > 0 ? '+' : ''}${scoreDiff}</div>
        </div>
        <div style="font-size: 14px; margin-top: 15px;">
            <div><strong>Hole-by-hole scores:</strong></div>
            ${holes.map((hole, i) => 
                `<div>Hole ${i + 1}: ${totalScore[i]} (Par ${hole.par})</div>`
            ).join('')}
        </div>
        <div style="margin-top: 20px; font-size: 16px;">Press R to play again</div>
    `;
    winMessage.style.display = 'block';
    
    gameState.gameComplete = true;
}

function resetGame() {
    currentHole = 0;
    totalScore = new Array(holes.length).fill(0);
    gameState.gameComplete = false;
    winMessage.style.display = 'none';
    
    loadHole(currentHole);
    gameState.currentHole = 1;
    updateHoleInfo();
}

function createPauseMenu() {
    pauseMenu = document.createElement('div');
    pauseMenu.style.position = 'absolute';
    pauseMenu.style.top = '50%';
    pauseMenu.style.left = '50%';
    pauseMenu.style.transform = 'translate(-50%, -50%)';
    pauseMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
    pauseMenu.style.color = 'white';
    pauseMenu.style.padding = '30px';
    pauseMenu.style.borderRadius = '15px';
    pauseMenu.style.fontSize = '18px';
    pauseMenu.style.textAlign = 'center';
    pauseMenu.style.display = 'none';
    pauseMenu.style.zIndex = '300';
    pauseMenu.style.minWidth = '400px';
    pauseMenu.style.maxWidth = '600px';
    pauseMenu.style.boxShadow = '0 0 30px rgba(0,0,0,0.8)';
    
    pauseMenu.innerHTML = `
        <div style="font-size: 32px; margin-bottom: 20px; color: #4CAF50;">⏸️ PAUSED</div>
        <div id="pause-score-display" style="margin: 20px 0; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 10px;">
            <div style="font-size: 20px; margin-bottom: 10px;"><strong>Current Round</strong></div>
            <div id="pause-holes-list"></div>
        </div>
        <div style="margin: 20px 0;">
            <button id="pause-resume" style="
                background: #4CAF50;
                color: white;
                border: none;
                padding: 12px 30px;
                margin: 5px;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                font-weight: bold;
            ">Resume (ESC)</button>
        </div>
        <div style="margin: 20px 0;">
            <div style="font-size: 16px; margin-bottom: 10px;"><strong>Jump to Hole:</strong></div>
            <div id="pause-hole-buttons" style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;"></div>
        </div>
        <div style="margin-top: 20px;">
            <button id="pause-restart" style="
                background: #ff9800;
                color: white;
                border: none;
                padding: 10px 25px;
                margin: 5px;
                border-radius: 8px;
                font-size: 14px;
                cursor: pointer;
            ">Restart Course</button>
        </div>
        <div style="margin-top: 15px; font-size: 14px; color: #aaa;">
            Press ESC to resume
        </div>
    `;
    
    document.body.appendChild(pauseMenu);
    
    // Add event listeners
    document.getElementById('pause-resume').addEventListener('click', togglePause);
    document.getElementById('pause-restart').addEventListener('click', () => {
        resetGame();
        togglePause();
    });
}

function updatePauseMenu() {
    if (!pauseMenu) return;
    
    // Update holes list with scores
    const holesList = document.getElementById('pause-holes-list');
    let holesHTML = '<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; text-align: left;">';
    
    for (let i = 0; i < holes.length; i++) {
        const hole = holes[i];
        const score = totalScore[i] || (i === currentHole ? golf.getStrokes() : 0);
        const status = i < currentHole ? '✓' : (i === currentHole ? '▶' : '⏳');
        const statusColor = i < currentHole ? '#4CAF50' : (i === currentHole ? '#2196F3' : '#666');
        
        holesHTML += `
            <div style="padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px;">
                <div style="color: ${statusColor}; font-weight: bold;">${status} Hole ${i + 1}</div>
                <div style="font-size: 14px; color: #aaa;">Par ${hole.par}</div>
                <div style="font-size: 16px; color: ${score > 0 ? '#fff' : '#666'};">
                    ${score > 0 ? `${score} stroke${score !== 1 ? 's' : ''}` : 'Not played'}
                </div>
            </div>
        `;
    }
    holesHTML += '</div>';
    holesList.innerHTML = holesHTML;
    
    // Update hole navigation buttons
    const holeButtons = document.getElementById('pause-hole-buttons');
    holeButtons.innerHTML = '';
    
    for (let i = 0; i < holes.length; i++) {
        const button = document.createElement('button');
        button.textContent = `Hole ${i + 1}`;
        button.style.cssText = `
            background: ${i === currentHole ? '#2196F3' : '#555'};
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;
            font-weight: ${i === currentHole ? 'bold' : 'normal'};
        `;
        button.addEventListener('click', () => {
            jumpToHole(i);
            togglePause();
        });
        holeButtons.appendChild(button);
    }
}

function jumpToHole(holeIndex) {
    if (holeIndex < 0 || holeIndex >= holes.length) return;
    
    // Save current hole score if not already saved
    if (currentHole !== holeIndex && !totalScore[currentHole]) {
        totalScore[currentHole] = golf.getStrokes();
    }
    
    currentHole = holeIndex;
    loadHole(currentHole);
    gameState.currentHole = currentHole + 1;
    updateHoleInfo();
    
    console.log(`Jumped to Hole ${currentHole + 1}`);
}

function togglePause() {
    isPaused = !isPaused;
    
    if (isPaused) {
        pauseMenu.style.display = 'block';
        updatePauseMenu();
        console.log('Game paused');
    } else {
        pauseMenu.style.display = 'none';
        console.log('Game resumed');
    }
}

function updateCameraPosition() {
    if (!golf || !golf.ball) {
        cameraTarget.set(0, 0, 0);
        return;
    }

    const ballPos = golf.ball.position;
    const ballVel = golf.velocity;
    const isMoving = golf.isMoving;
    
    // Determine camera behavior based on mode and ball state
    if (cameraMode === 'follow' || (cameraMode === 'player' && isMoving)) {
        // Follow mode - track the ball smoothly
        cameraTarget.lerp(ballPos, 0.1);
        
        // Dynamic zoom based on ball state
        if (isMoving) {
            const speed = ballVel.length();
            const ballHeight = ballPos.y;
            
            // Zoom in when ball is in air
            if (ballHeight > 1.0) {
                targetCameraDistance = 6 + ballHeight * 0.5; // Closer view in air
                targetCameraHeight = 4 + ballHeight * 0.8; // Follow ball height
            } else {
                // Zoom based on speed when rolling
                targetCameraDistance = 8 + Math.min(speed * 0.3, 4);
                targetCameraHeight = 5 + Math.min(speed * 0.2, 2);
            }
        } else {
            // Ball stopped - return to normal view
            targetCameraDistance = 8;
            targetCameraHeight = 5;
        }
    } else if (cameraMode === 'player') {
        // Player view - very close behind the ball, first-person style
        cameraTarget.copy(ballPos);
        cameraTarget.y += 0.3; // Look slightly above the ball
        
        targetCameraDistance = 2; // Very close - 2 units behind ball
        targetCameraHeight = 1.2; // Low, at player eye level
    } else if (cameraMode === 'hole') {
        // Hole view - look from hole towards ball
        const holePos = jungle.getHolePosition();
        const directionToHole = new THREE.Vector3()
            .subVectors(holePos, ballPos)
            .normalize();
        
        // Position camera behind ball looking toward hole
        cameraTarget.copy(ballPos);
        cameraAngle = Math.atan2(directionToHole.x, directionToHole.z) + Math.PI;
        
        targetCameraDistance = 10;
        targetCameraHeight = 6;
    }
    
    // Smoothly interpolate camera distance and height
    cameraDistance += (targetCameraDistance - cameraDistance) * 0.1;
    cameraHeight += (targetCameraHeight - cameraHeight) * 0.1;
    
    // Calculate camera position based on angle, distance, and height
    const x = cameraTarget.x + Math.sin(cameraAngle) * cameraDistance;
    const z = cameraTarget.z + Math.cos(cameraAngle) * cameraDistance;
    const y = cameraTarget.y + cameraHeight;
    
    camera.position.set(x, y, z);
    camera.lookAt(cameraTarget);
}

function setCameraMode(mode) {
    if (['player', 'hole', 'follow'].includes(mode)) {
        cameraMode = mode;
        console.log(`📷 Camera mode: ${mode}`);
        
        // Update UI to show current mode
        if (instructions) {
            const modeText = mode === 'player' ? 'Player View' : 
                           mode === 'hole' ? 'Hole View' : 'Follow View';
            // We'll update the instructions display to show current camera mode
        }
    }
}

function init() {
    console.log('🎮 INIT FUNCTION CALLED - STARTING GAME SETUP');
    
    // Initialize THREE.js
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    console.log('✅ Renderer created and added to body');

    // Initialize game objects
    jungle = new Jungle();
    loadHole(currentHole);

    console.log('✅ Jungle and hole loaded');

    // Set initial camera position
    updateCameraPosition();

    // Initialize game state
    gameState = {
        currentHole: currentHole + 1,
        totalHoles: holes.length,
        strokes: [],
        gameComplete: false
    };
    
    totalScore = new Array(holes.length).fill(0);

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
    console.log('Camera Controls: V to toggle view, A/D to rotate, W/S to zoom, Right-click+drag, Mouse wheel');
    console.log('Camera system loaded - Version 3.0 - Dynamic Follow Mode');
    
    // Update UI
    updateHoleInfo();
    updateCameraViewUI();
    
    // Initialize aim line
    updateAimLine();
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
    uiContainer.style.pointerEvents = 'none';
    document.body.appendChild(uiContainer);

    // Hole info
    holeInfo = document.createElement('div');
    holeInfo.style.fontSize = '20px';
    holeInfo.style.fontWeight = 'bold';
    holeInfo.innerHTML = 'Hole 1 (Par 3)';
    uiContainer.appendChild(holeInfo);

    // Story display
    storyDisplay = document.createElement('div');
    storyDisplay.style.marginTop = '10px';
    storyDisplay.style.fontSize = '14px';
    storyDisplay.style.fontStyle = 'italic';
    storyDisplay.style.padding = '10px';
    storyDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    storyDisplay.style.borderRadius = '5px';
    storyDisplay.style.maxWidth = '300px';
    storyDisplay.innerHTML = '';
    uiContainer.appendChild(storyDisplay);

    // Stroke counter
    strokeCounter = document.createElement('div');
    strokeCounter.innerHTML = 'Strokes: 0';
    strokeCounter.style.marginTop = '10px';
    uiContainer.appendChild(strokeCounter);

    // Club display
    clubDisplay = document.createElement('div');
    clubDisplay.innerHTML = '🏌️ Club: Driver';
    clubDisplay.style.marginTop = '5px';
    clubDisplay.style.fontWeight = 'bold';
    uiContainer.appendChild(clubDisplay);

    // Power display
    powerDisplay = document.createElement('div');
    powerDisplay.innerHTML = '⚡ Power: 0%';
    powerDisplay.style.marginTop = '5px';
    uiContainer.appendChild(powerDisplay);
    
    // Camera view display
    cameraViewDisplay = document.createElement('div');
    cameraViewDisplay.innerHTML = '📷 View: Player';
    cameraViewDisplay.style.marginTop = '5px';
    cameraViewDisplay.style.fontWeight = 'bold';
    cameraViewDisplay.style.color = '#00ffff';
    uiContainer.appendChild(cameraViewDisplay);
    
    // Power meter container
    const powerMeterContainer = document.createElement('div');
    powerMeterContainer.style.marginTop = '5px';
    powerMeterContainer.style.width = '200px';
    powerMeterContainer.style.height = '20px';
    powerMeterContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    powerMeterContainer.style.border = '2px solid white';
    powerMeterContainer.style.borderRadius = '10px';
    powerMeterContainer.style.overflow = 'hidden';
    uiContainer.appendChild(powerMeterContainer);
    
    // Power meter bar
    powerMeter = document.createElement('div');
    powerMeter.style.width = '0px';
    powerMeter.style.height = '100%';
    powerMeter.style.backgroundColor = '#00ff00';
    powerMeter.style.transition = 'width 0.05s linear';
    powerMeterContainer.appendChild(powerMeter);

    // Instructions
    instructions = document.createElement('div');
    instructions.style.marginTop = '10px';
    instructions.style.fontSize = '14px';
    instructions.innerHTML = `
        <div>🏌️ <strong>Controls:</strong></div>
        <div>🖱️ Move mouse to aim</div>
        <div>SPACE (hold): Charge power & hit</div>
        <div>1-4: Select club (Driver/Iron/Wedge/Putter)</div>
        <div>V: Toggle camera view (Player/Hole/Follow)</div>
        <div>🖱️ Right-click + drag: Rotate camera</div>
        <div>🖱️ Mouse wheel: Zoom in/out</div>
        <div>A/D keys: Rotate camera</div>
        <div>W/S keys: Zoom in/out</div>
        <div>R: Reset ball / Restart</div>
        <div>ESC: Pause menu</div>
        <div style="margin-top: 8px;">🎯 <strong>Goal:</strong> Get the ball in the black hole!</div>
        <div style="margin-top: 5px;">💦 <strong>Water:</strong> Avoid blue water spots!</div>
    `;
    uiContainer.appendChild(instructions);

    // Pause Menu
    createPauseMenu();

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
    winMessage.style.pointerEvents = 'auto';
    document.body.appendChild(winMessage);
}

function setupEventListeners() {
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keydown', handleKeyDown, false);
    document.addEventListener('keyup', handleKeyUp, false);
    document.addEventListener('mousedown', handleMouseDown, false);
    document.addEventListener('mouseup', handleMouseUp, false);
    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('wheel', handleMouseWheel, false);
    document.addEventListener('contextmenu', (e) => e.preventDefault(), false); // Prevent right-click menu
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

let aimLine = null;

function handleKeyDown(event) {
    inputState.keyPressed[event.code] = true;

    switch (event.code) {
        case 'Escape':
            event.preventDefault();
            togglePause();
            break;
        case 'Space':
            event.preventDefault();
            if (isPaused) return;
            
            if (gameWon) {
                // Progress to next hole or show final results
                winMessage.style.display = 'none';
                if (currentHole >= holes.length - 1) {
                    showFinalScore();
                } else {
                    nextHole();
                }
            } else if (!golf.isMoving && !isChargingPower) {
                // Start charging power
                isChargingPower = true;
                powerCharge = 0;
                console.log('⚡ Charging power...');
            }
            break;
        case 'KeyR':
            if (gameState.gameComplete) {
                resetGame();
            } else {
                golf.resetBall();
                gameWon = false;
                winMessage.style.display = 'none';
                if (aimLine) {
                    scene.remove(aimLine);
                    aimLine = null;
                }
                updateAimLine();
            }
            break;
        case 'Digit1':
            if (isPaused || golf.isMoving) return;
            golf.setClub(CLUBS.DRIVER);
            updateClubDisplay();
            updateAimLine();
            break;
        case 'Digit2':
            if (isPaused || golf.isMoving) return;
            golf.setClub(CLUBS.IRON);
            updateClubDisplay();
            updateAimLine();
            break;
        case 'Digit3':
            if (isPaused || golf.isMoving) return;
            golf.setClub(CLUBS.WEDGE);
            updateClubDisplay();
            updateAimLine();
            break;
        case 'Digit4':
            if (isPaused || golf.isMoving) return;
            golf.setClub(CLUBS.PUTTER);
            updateClubDisplay();
            updateAimLine();
            break;
        case 'KeyA':
        case 'ArrowLeft':
            // Rotate camera left
            cameraAngle -= 0.1;
            updateCameraPosition();
            if (!golf.isMoving && !gameWon) updateAimLine();
            break;
        case 'KeyD':
        case 'ArrowRight':
            // Rotate camera right
            cameraAngle += 0.1;
            updateCameraPosition();
            if (!golf.isMoving && !gameWon) updateAimLine();
            break;
        case 'KeyW':
            // Zoom in
            cameraDistance = Math.max(cameraDistance - 1, 5);
            updateCameraPosition();
            if (!golf.isMoving && !gameWon) updateAimLine();
            break;
        case 'KeyS':
            // Zoom out
            cameraDistance = Math.min(cameraDistance + 1, 30);
            updateCameraPosition();
            if (!golf.isMoving && !gameWon) updateAimLine();
            break;
        case 'KeyV':
            // Toggle camera view mode
            if (cameraMode === 'player') {
                setCameraMode('hole');
            } else if (cameraMode === 'hole') {
                setCameraMode('follow');
            } else {
                setCameraMode('player');
            }
            updateCameraViewUI();
            break;
    }
}

function handleKeyUp(event) {
    inputState.keyPressed[event.code] = false;
    
    // Release space bar - hit the ball with charged power
    if (event.code === 'Space' && isChargingPower) {
        isChargingPower = false;
        
        if (!golf.isMoving && !gameWon) {
            // Calculate direction from aim line
            const ballPos = golf.getPosition();
            const direction = new THREE.Vector3(0, 0, -1);
            
            if (aimLine) {
                const aimDirection = aimLine.geometry.attributes.position.array;
                direction.set(
                    aimDirection[3] - aimDirection[0],
                    0,
                    aimDirection[5] - aimDirection[2]
                ).normalize();
            }
            
            // Rotate golfer to face shot direction and position to side
            const angle = Math.atan2(direction.x, direction.z);
            golf.updateGolferPosition(angle);
            
            // Hit ball with charged power (0 to 1)
            const success = golf.hitBall(powerCharge, direction);
            
            if (success) {
                // Switch to follow mode when ball is hit
                if (cameraMode === 'player' || cameraMode === 'hole') {
                    setCameraMode('follow');
                    updateCameraViewUI();
                }
                
                // Hide aim line when ball is hit
                if (aimLine) {
                    scene.remove(aimLine);
                    aimLine = null;
                }
            }
        }
        
        powerCharge = 0;
    }
}

function handleMouseDown(event) {
    // Right click for camera rotation
    if (event.button === 2) {
        isDragging = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        event.preventDefault();
        return;
    }
    
    inputState.mouseDown = true;
    inputState.mousePosition.set(event.clientX, event.clientY);
}

function handleMouseUp(event) {
    if (event.button === 2) {
        isDragging = false;
        return;
    }
    
    inputState.mouseDown = false;
}

function handleMouseMove(event) {
    // Handle camera rotation with right mouse button
    if (isDragging) {
        const deltaX = event.clientX - lastMouseX;
        const deltaY = event.clientY - lastMouseY;
        
        // Rotate camera around the ball
        cameraAngle -= deltaX * 0.01; // Horizontal rotation
        cameraHeight = Math.max(2, Math.min(20, cameraHeight - deltaY * 0.05)); // Vertical movement
        
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        
        console.log('Dragging camera - angle:', cameraAngle, 'height:', cameraHeight);
        updateCameraPosition();
        return;
    }
    
    inputState.mousePosition.set(event.clientX, event.clientY);
    
    if (!golf.isMoving && !gameWon) {
        updateAimLine();
    }
}

function handleMouseWheel(event) {
    event.preventDefault();
    
    // Zoom in/out with mouse wheel
    const delta = event.deltaY > 0 ? 1 : -1;
    cameraDistance = Math.max(5, Math.min(30, cameraDistance + delta));
    
    updateCameraPosition();
    
    if (!golf.isMoving && !gameWon) {
        updateAimLine();
    }
}

function updateAimLine() {
    if (golf.isMoving || gameWon) return;
    
    // Remove existing aim line
    if (aimLine) {
        scene.remove(aimLine);
    }
    
    // Get mouse position in world coordinates
    const mouse = new THREE.Vector2();
    mouse.x = (inputState.mousePosition.x / window.innerWidth) * 2 - 1;
    mouse.y = -(inputState.mousePosition.y / window.innerHeight) * 2 + 1;
    
    // Create raycaster
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    // Get ball position
    const ballPos = golf.getPosition();
    
    // Create aim line from ball to mouse direction
    const direction = new THREE.Vector3();
    raycaster.ray.direction.normalize();
    
    // Project onto ground plane
    const groundY = ballPos.y;
    const rayOrigin = raycaster.ray.origin;
    const rayDir = raycaster.ray.direction;
    
    // Calculate intersection with ground plane
    const t = (groundY - rayOrigin.y) / rayDir.y;
    const targetPos = rayOrigin.clone().add(rayDir.multiplyScalar(t));
    
    // Limit the aim line length based on current club
    const club = golf.getClub();
    const aimDir = targetPos.clone().sub(ballPos).normalize();
    const aimLength = club.maxDistance * 0.3; // Visual representation scaled to club
    const aimEnd = ballPos.clone().add(aimDir.multiplyScalar(aimLength));
    
    // Create line geometry
    const points = [ballPos, aimEnd];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    
    // Create line material with color based on club
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: club.color,
        linewidth: 3,
        transparent: true,
        opacity: 0.8
    });
    
    aimLine = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(aimLine);
}

function updateGame() {
    const deltaTime = clock.getDelta();

    // Don't update game if paused
    if (isPaused) {
        return;
    }
    
    // Update power charging
    if (isChargingPower) {
        powerCharge = Math.min(powerCharge + deltaTime / maxPowerTime, 1.0);
        updatePowerMeter();
    }

    // Update golf ball with boundaries and water hazards
    const result = golf.update(
        deltaTime, 
        jungle.getObstacles(),
        jungle.getBoundaries(),
        jungle.getWaterHazards()
    );
    
    // Handle out of bounds
    if (!result.inBounds) {
        console.log('⚠️ Ball went out of bounds!');
        golf.resetToLastPosition();
    }
    
    // Handle water hazard
    if (result.hitWater) {
        console.log('💦 Ball hit water!');
        golf.resetToLastPosition();
    }

    // Update jungle environment
    jungle.update(deltaTime);
    
    // Check if ball just stopped moving - return to player view
    if (golf.wasMoving && !golf.isMoving && cameraMode === 'follow') {
        setCameraMode('player');
        updateCameraViewUI();
    }
    golf.wasMoving = golf.isMoving; // Track previous state
    
    // Update camera to follow ball
    updateCameraPosition();
    
    // Update golfer position and rotation based on aim when not moving
    if (!golf.isMoving && aimLine) {
        const ballPos = golf.getPosition();
        const aimDirection = aimLine.geometry.attributes.position.array;
        const direction = new THREE.Vector3(
            aimDirection[3] - aimDirection[0],
            0,
            aimDirection[5] - aimDirection[2]
        ).normalize();
        const angle = Math.atan2(direction.x, direction.z);
        golf.updateGolferPosition(angle);
    }

    // Check win condition
    if (!gameWon && golf.isInHole(jungle.getHolePosition(), jungle.getHoleRadius())) {
        gameWon = true;
        showHoleCompleteMessage();
    }

    // Update UI
    updateUI();
}

function updateUI() {
    if (strokeCounter) {
        strokeCounter.innerHTML = `Strokes: ${golf.getStrokes()}`;
    }
    
    if (clubDisplay && golf) {
        const club = golf.getClub();
        clubDisplay.innerHTML = `🏌️ Club: ${club.name}`;
    }
    
    // Update power display based on charging state
    if (powerDisplay) {
        if (isChargingPower) {
            const powerPercent = Math.round(powerCharge * 100);
            powerDisplay.innerHTML = `⚡ Power: ${powerPercent}%`;
        } else {
            powerDisplay.innerHTML = `⚡ Power: 0%`;
        }
    }
}

function updateClubDisplay() {
    if (clubDisplay && golf) {
        const club = golf.getClub();
        clubDisplay.innerHTML = `🏌️ Club: ${club.name}`;
        console.log(`Selected ${club.name}`);
    }
}

function updateCameraViewUI() {
    if (cameraViewDisplay) {
        const modeNames = {
            'player': 'Player',
            'hole': 'Hole',
            'follow': 'Follow'
        };
        cameraViewDisplay.innerHTML = `📷 View: ${modeNames[cameraMode]}`;
    }
}

function updatePowerMeter() {
    if (powerMeter) {
        const width = powerCharge * 200; // 200px max width
        powerMeter.style.width = `${width}px`;
        
        // Color based on power level
        if (powerCharge < 0.33) {
            powerMeter.style.backgroundColor = '#00ff00'; // Green
        } else if (powerCharge < 0.66) {
            powerMeter.style.backgroundColor = '#ffff00'; // Yellow
        } else {
            powerMeter.style.backgroundColor = '#ff0000'; // Red
        }
    }
}

function updateHoleInfo() {
    const hole = holes[currentHole];
    
    // Only update if UI elements exist
    if (holeInfo) {
        holeInfo.innerHTML = `${hole.name} - Hole ${currentHole + 1} of ${holes.length} (Par ${hole.par})`;
    }
    
    // Update story display
    if (storyDisplay && hole.story) {
        storyDisplay.innerHTML = `📖 ${hole.story}`;
        storyDisplay.style.display = 'block';
    }
}

function showHoleCompleteMessage() {
    const strokes = golf.getStrokes();
    const hole = holes[currentHole];
    const par = hole.par;
    
    let performance = '';
    let scoreText = '';
    
    if (strokes === 1) {
        performance = 'Hole in One! 🎉';
        scoreText = 'ACE!';
    } else if (strokes === par - 2) {
        performance = 'Eagle! 🦅';
        scoreText = `${strokes} strokes (-2)`;
    } else if (strokes === par - 1) {
        performance = 'Birdie! 🐦';
        scoreText = `${strokes} strokes (-1)`;
    } else if (strokes === par) {
        performance = 'Par! �';
        scoreText = `${strokes} strokes (Par)`;
    } else if (strokes === par + 1) {
        performance = 'Bogey 😐';
        scoreText = `${strokes} strokes (+1)`;
    } else if (strokes === par + 2) {
        performance = 'Double Bogey �';
        scoreText = `${strokes} strokes (+2)`;
    } else {
        performance = 'Keep practicing! 💪';
        scoreText = `${strokes} strokes (+${strokes - par})`;
    }

    const isLastHole = currentHole >= holes.length - 1;
    
    winMessage.innerHTML = `
        <div style="font-size: 32px; margin-bottom: 10px;">🎯 HOLE ${currentHole + 1} COMPLETE!</div>
        <div style="font-size: 20px; margin-bottom: 10px;">${performance}</div>
        <div>${scoreText}</div>
        <div style="margin-top: 20px; font-size: 16px;">
            ${isLastHole ? 
                'Press SPACE for final results' : 
                'Press SPACE for next hole'}
        </div>
        <div style="font-size: 14px; margin-top: 5px;">Press R to restart current hole</div>
    `;
    winMessage.style.display = 'block';
    
    console.log(`Hole ${currentHole + 1} completed in ${strokes} strokes!`);
}

function animate() {
    requestAnimationFrame(animate);
    
    updateGame();
    renderer.render(scene, camera);
}

// Start the game when THREE.js is loaded
console.log('🔍 Checking if THREE.js is loaded...');
if (typeof THREE !== 'undefined') {
    console.log('✅ THREE.js is loaded! Starting game...');
    init();
    animate();
} else {
    console.error('❌ THREE.js not loaded!');
}