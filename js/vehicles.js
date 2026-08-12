import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Vehicle {

    constructor(scene, x = 0, z = 0) {

        this.scene = scene;

        this.group = new THREE.Group();

        this.speed = 0;
        this.maxSpeed = 0.35;
        this.acceleration = 0.01;
        this.braking = 0.02;

        this.isOccupied = false;

        // ==============================
        // CAR BODY
        // ==============================

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 0.7, 4),
            new THREE.MeshStandardMaterial({
                color: 0xcc2222
            })
        );

        body.position.y = 0.65;

        this.group.add(body);

        // ==============================
        // CAR TOP
        // ==============================

        const top = new THREE.Mesh(
            new THREE.BoxGeometry(1.7, 0.55, 2),
            new THREE.MeshStandardMaterial({
                color: 0x222222
            })
        );

        top.position.y = 1.2;

        this.group.add(top);

        // ==============================
        // WHEELS
        // ==============================

        const wheelMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x111111
            });

        const wheelPositions = [
            [-1.0, 0.35, -1.3],
            [ 1.0, 0.35, -1.3],
            [-1.0, 0.35,  1.3],
            [ 1.0, 0.35,  1.3]
        ];

        for (const position of wheelPositions) {

            const wheel = new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.4,
                    0.4,
                    0.25,
                    20
                ),
                wheelMaterial
            );

            wheel.rotation.z =
                Math.PI / 2;

            wheel.position.set(
                position[0],
                position[1],
                position[2]
            );

            this.group.add(wheel);
        }

        this.group.position.set(
            x,
            0,
            z
        );

        scene.add(this.group);
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

        // Accelerate

        if (keys["w"]) {

            this.speed +=
                this.acceleration;

            if (
                this.speed >
                this.maxSpeed
            ) {

                this.speed =
                    this.maxSpeed;
            }
        }

        // Reverse

        if (keys["s"]) {

            this.speed -=
                this.acceleration;

            if (
                this.speed <
                -this.maxSpeed / 2
            ) {

                this.speed =
                    -this.maxSpeed / 2;
            }
        }

        // Brake when no throttle

        if (
            !keys["w"] &&
            !keys["s"]
        ) {

            if (this.speed > 0) {

                this.speed -=
                    this.braking;

                if (this.speed < 0) {
                    this.speed = 0;
                }

            } else if (this.speed < 0) {

                this.speed +=
                    this.braking;

                if (this.speed > 0) {
                    this.speed = 0;
                }
            }
        }

        // Steering

        if (keys["a"]) {

            this.group.rotation.y +=
                0.025;
        }

        if (keys["d"]) {

            this.group.rotation.y -=
                0.025;
        }

        // Move car forward

        const direction =
            new THREE.Vector3(0, 0, -1);

        direction.applyQuaternion(
            this.group.quaternion
        );

        this.group.position.addScaledVector(
            direction,
            this.speed
        );
    }
}
