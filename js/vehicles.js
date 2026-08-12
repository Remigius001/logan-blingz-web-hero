import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Vehicle {

    constructor(scene, type = "car", x = 0, z = 0) {

        this.scene = scene;
        this.type = type;

        this.group = new THREE.Group();

        this.speed = 0;
        this.maxSpeed = 0.35;

        this.isOccupied = false;

        this.createVehicle();

        this.group.position.set(
            x,
            0,
            z
        );

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

    createCar() {

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(2.4, 0.7, 4),
            new THREE.MeshStandardMaterial({
                color: 0xff2222
            })
        );

        body.position.y = 0.8;
        this.group.add(body);

        const roof = new THREE.Mesh(
            new THREE.BoxGeometry(1.7, 0.6, 2),
            new THREE.MeshStandardMaterial({
                color: 0x222222
            })
        );

        roof.position.y = 1.3;
        this.group.add(roof);

        const wheelMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x111111
            });

        const wheelPositions = [
            [-1.1, 0.4, -1.25],
            [1.1, 0.4, -1.25],
            [-1.1, 0.4, 1.25],
            [1.1, 0.4, 1.25]
        ];

        for (const p of wheelPositions) {

            const wheel = new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.42,
                    0.42,
                    0.3,
                    24
                ),
                wheelMaterial
            );

            wheel.rotation.z =
                Math.PI / 2;

            wheel.position.set(
                p[0],
                p[1],
                p[2]
            );

            this.group.add(wheel);
        }
    }

    createBike() {

        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.35,
                0.45,
                1.8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x2255cc
            })
        );

        frame.position.y = 0.9;
        this.group.add(frame);

        const wheelMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x111111
            });

        const frontWheel = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.45,
                0.45,
                0.18,
                24
            ),
            wheelMaterial
        );

        frontWheel.rotation.z =
            Math.PI / 2;

        frontWheel.position.set(
            0,
            0.45,
            -0.9
        );

        this.group.add(frontWheel);

        const rearWheel =
            frontWheel.clone();

        rearWheel.position.z = 0.9;

        this.group.add(rearWheel);

        const seat = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.45,
                0.15,
                0.5
            ),
            new THREE.MeshStandardMaterial({
                color: 0x111111
            })
        );

        seat.position.y = 1.2;
        this.group.add(seat);
    }

    createJet() {

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(
                2,
                0.8,
                5
            ),
            new THREE.MeshStandardMaterial({
                color: 0xeeeeee
            })
        );

        body.position.y = 4;
        this.group.add(body);

        const wing = new THREE.Mesh(
            new THREE.BoxGeometry(
                7,
                0.15,
                1.2
            ),
            new THREE.MeshStandardMaterial({
                color: 0x333333
            })
        );

        wing.position.y = 4;
        this.group.add(wing);

        const tail = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.3,
                1.2,
                0.8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x333333
            })
        );

        tail.position.set(
            0,
            4.7,
            2
        );

        this.group.add(tail);
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

        if (this.type === "bike") {
            acceleration = 0.015;
        }

        if (this.type === "jet") {
            acceleration = 0.02;
        }

        if (keys["w"]) {
            this.speed += acceleration;
        }

        if (keys["s"]) {
            this.speed -= acceleration;
        }

        let maximum =
            this.maxSpeed;

        if (this.type === "bike") {
            maximum = 0.45;
        }

        if (this.type === "jet") {
            maximum = 0.8;
        }

        this.speed = THREE.MathUtils.clamp(
            this.speed,
            -maximum / 2,
            maximum
        );

        if (keys["a"]) {
            this.group.rotation.y += 0.03;
        }

        if (keys["d"]) {
            this.group.rotation.y -= 0.03;
        }

        const direction =
            new THREE.Vector3(
                0,
                0,
                -1
            );

        direction.applyQuaternion(
            this.group.quaternion
        );

        this.group.position.addScaledVector(
            direction,
            this.speed
        );
    }
}
