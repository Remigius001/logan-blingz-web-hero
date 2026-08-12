import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Vehicle {

    constructor(scene, type = "car", x = 0, z = 0) {

        this.scene = scene;
        this.type = type;

        this.group = new THREE.Group();

        this.speed = 0;
        this.maxSpeed = 0.35;
        this.isOccupied = false;
        this.weaponCooldown = 0;

        this.createVehicle();

        this.group.position.set(x, 0, z);

        // Start jet at a visible flying height
        if (this.type === "jet") {
            this.group.position.y = 8;
        }

        scene.add(this.group);
    }

    createVehicle() {

        if (this.type === "car") {
            this.createCar();
        }

        if (this.type === "bike") {
            this.createBike();
        }

        if (this.type === "jet") {
            this.createJet();
        }
    }

    // ======================================
    // CAR
    // ======================================

    createCar() {

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 0.7, 4.2),
            new THREE.MeshStandardMaterial({
                color: 0xd72626
            })
        );

        body.position.y = 0.8;
        this.group.add(body);

        const roof = new THREE.Mesh(
            new THREE.BoxGeometry(1.7, 0.7, 2),
            new THREE.MeshStandardMaterial({
                color: 0x202020
            })
        );

        roof.position.y = 1.35;
        this.group.add(roof);

        const wheelMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x111111
            });

        const positions = [
            [-1.15, 0.4, -1.35],
            [1.15, 0.4, -1.35],
            [-1.15, 0.4, 1.35],
            [1.15, 0.4, 1.35]
        ];

        for (const p of positions) {

            const wheel = new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.43,
                    0.43,
                    0.32,
                    24
                ),
                wheelMaterial
            );

            wheel.rotation.z = Math.PI / 2;

            wheel.position.set(
                p[0],
                p[1],
                p[2]
            );

            this.group.add(wheel);
        }
    }

    // ======================================
    // BIKE
    // ======================================

    createBike() {

        const frameMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x2266ff
            });

        const wheelMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x111111
            });

        const rearWheel = new THREE.Mesh(
            new THREE.TorusGeometry(
                0.45,
                0.09,
                12,
                24
            ),
            wheelMaterial
        );

        rearWheel.rotation.y = Math.PI / 2;
        rearWheel.position.set(0, 0.55, 0.9);

        this.group.add(rearWheel);

        const frontWheel = rearWheel.clone();

        frontWheel.position.z = -0.9;

        this.group.add(frontWheel);

        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.18,
                0.65,
                1.5
            ),
            frameMaterial
        );

        frame.position.y = 0.95;

        this.group.add(frame);

        const seat = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.42,
                0.12,
                0.55
            ),
            new THREE.MeshStandardMaterial({
                color: 0x111111
            })
        );

        seat.position.set(
            0,
            1.35,
            0.45
        );

        this.group.add(seat);

        const handlebars = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.8,
                0.12,
                0.12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x333333
            })
        );

        handlebars.position.set(
            0,
            1.45,
            -0.85
        );

        this.group.add(handlebars);
    }

    // ======================================
    // JET
    // ======================================

    createJet() {

        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.7,
                0.9,
                5,
                24
            ),
            new THREE.MeshStandardMaterial({
                color: 0xd8d8d8
            })
        );

        body.rotation.x = Math.PI / 2;

        this.group.add(body);

        // Wings

        const wings = new THREE.Mesh(
            new THREE.BoxGeometry(
                7,
                0.18,
                1.4
            ),
            new THREE.MeshStandardMaterial({
                color: 0x333333
            })
        );

        this.group.add(wings);

        // Tail

        const tail = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.25,
                1.6,
                0.8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x333333
            })
        );

        tail.position.set(
            0,
            0.8,
            1.8
        );

        this.group.add(tail);

        // Cockpit

        const cockpit = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.6,
                20,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x2266aa,
                transparent: true,
                opacity: 0.8
            })
        );

        cockpit.scale.set(
            1,
            0.6,
            1.4
        );

        cockpit.position.z = -0.8;

        this.group.add(cockpit);

        // Engines

        const engineMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x444444
            });

        const engine1 = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.25,
                0.25,
                1.2,
                16
            ),
            engineMaterial
        );

        engine1.rotation.x = Math.PI / 2;

        engine1.position.set(
            -1,
            0,
            1.8
        );

        this.group.add(engine1);

        const engine2 = engine1.clone();

        engine2.position.x = 1;

        this.group.add(engine2);

        // Bright engine glow

        const glowMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xff6600
            });

        const glow1 = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.18,
                12,
                12
            ),
            glowMaterial
        );

        glow1.position.set(
            -1,
            0,
            2.45
        );

        this.group.add(glow1);

        const glow2 = glow1.clone();

        glow2.position.x = 1;

        this.group.add(glow2);
    }

    enter() {
        this.isOccupied = true;
    }

    exit() {
        this.isOccupied = false;
        this.speed = 0;
    }

    update(keys) {

        if (!this.isOccupied) {
            return;
        }

        let acceleration = 0.01;
        let maximumSpeed = this.maxSpeed;

        if (this.type === "bike") {
            acceleration = 0.015;
            maximumSpeed = 0.45;
        }

        if (this.type === "jet") {
            acceleration = 0.02;
            maximumSpeed = 0.8;
        }

        if (keys["w"]) {
            this.speed += acceleration;
        }

        if (keys["s"]) {
            this.speed -= acceleration;
        }

        this.speed = THREE.MathUtils.clamp(
            this.speed,
            -maximumSpeed / 2,
            maximumSpeed
        );

        if (keys["a"]) {
            this.group.rotation.y += 0.03;
        }

        if (keys["d"]) {
            this.group.rotation.y -= 0.03;
        }

        // Jet up/down

        if (this.type === "jet") {

            if (keys[" "]) {
                this.group.position.y += 0.15;
            }

            if (keys["control"]) {
                this.group.position.y -= 0.15;
            }

            this.group.position.y =
                Math.max(
                    3,
                    this.group.position.y
                );
        }

        const direction =
            new THREE.Vector3(0, 0, -1);

        direction.applyQuaternion(
            this.group.quaternion
        );

        this.group.position.addScaledVector(
            direction,
            this.speed
        );

        // In-game energy pulse

        if (
            keys["f"] &&
            this.weaponCooldown <= 0
        ) {

            this.fireEnergyPulse();

            this.weaponCooldown = 20;
        }

        if (this.weaponCooldown > 0) {
            this.weaponCooldown--;
        }
    }

    fireEnergyPulse() {

        const projectile = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.12,
                12,
                12
            ),
            new THREE.MeshBasicMaterial({
                color: 0x33ffff
            })
        );

        const direction =
            new THREE.Vector3(
                0,
                0,
                -1
            );

        direction.applyQuaternion(
            this.group.quaternion
        );

        projectile.position.copy(
            this.group.position
        );

        this.scene.add(projectile);

        let distance = 0;

        const move = () => {

            projectile.position.addScaledVector(
                direction,
                0.8
            );

            distance += 0.8;

            if (distance < 80) {

                requestAnimationFrame(move);

            } else {

                this.scene.remove(projectile);
            }
        };

        move();
    }
}
