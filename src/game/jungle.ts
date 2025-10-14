import * as THREE from 'three';

export class Jungle {
    public scene!: THREE.Scene;
    public obstacles: THREE.Object3D[];
    public ground!: THREE.Mesh;
    public hole!: THREE.Mesh;
    public holePosition: THREE.Vector3;
    public holeRadius: number;

    constructor() {
        this.obstacles = [];
        this.holePosition = new THREE.Vector3(0, 0, -15);
        this.holeRadius = 0.5;
    }

    loadScene(scene: THREE.Scene) {
        this.scene = scene;
        
        // Set jungle-like background
        scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Add lighting
        this.setupLighting();
        
        // Create ground
        this.createGround();
        
        // Create the hole
        this.createHole();
        
        // Add jungle obstacles
        this.createObstacles();
        
        // Add jungle decorations
        this.addDecorations();
    }

    private setupLighting() {
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    private createGround() {
        // Create grass-like ground
        const groundGeometry = new THREE.PlaneGeometry(50, 30);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x3d5a27,  // Dark green
            side: THREE.DoubleSide 
        });
        
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
    }

    private createHole() {
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
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.rotation.x = -Math.PI / 2;
        rim.position.copy(this.holePosition);
        rim.position.y = 0.01;
        this.scene.add(rim);
    }

    private createObstacles() {
        // Tree stumps as obstacles
        this.addTreeStump(new THREE.Vector3(-3, 0, -5));
        this.addTreeStump(new THREE.Vector3(4, 0, -8));
        this.addTreeStump(new THREE.Vector3(-2, 0, -12));
        
        // Rocks
        this.addRock(new THREE.Vector3(2, 0, -3));
        this.addRock(new THREE.Vector3(-4, 0, -10));
        
        // Logs
        this.addLog(new THREE.Vector3(0, 0, -7));
    }

    private addTreeStump(position: THREE.Vector3) {
        const stumpGeometry = new THREE.CylinderGeometry(0.5, 0.6, 1, 8);
        const stumpMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
        
        const stump = new THREE.Mesh(stumpGeometry, stumpMaterial);
        stump.position.copy(position);
        stump.position.y = 0.5;
        stump.castShadow = true;
        
        this.obstacles.push(stump);
        this.scene.add(stump);
    }

    private addRock(position: THREE.Vector3) {
        const rockGeometry = new THREE.DodecahedronGeometry(0.4);
        const rockMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 }); // Gray
        
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.copy(position);
        rock.position.y = 0.4;
        rock.castShadow = true;
        
        this.obstacles.push(rock);
        this.scene.add(rock);
    }

    private addLog(position: THREE.Vector3) {
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

    private addDecorations() {
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

    private addGrassClump(position: THREE.Vector3) {
        const grassGeometry = new THREE.ConeGeometry(0.1, 0.3, 4);
        const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Forest green
        
        const grass = new THREE.Mesh(grassGeometry, grassMaterial);
        grass.position.copy(position);
        grass.position.y = 0.15;
        this.scene.add(grass);
    }

    private addPalmTree(position: THREE.Vector3) {
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

    addObstacle(obstacle: THREE.Object3D) {
        this.obstacles.push(obstacle);
        this.scene.add(obstacle);
    }

    getObstacles(): THREE.Object3D[] {
        return this.obstacles;
    }

    getHolePosition(): THREE.Vector3 {
        return this.holePosition.clone();
    }

    getHoleRadius(): number {
        return this.holeRadius;
    }

    update(deltaTime: number) {
        // Add any environmental animations here
        // For example, swaying palm trees, moving grass, etc.
    }
}