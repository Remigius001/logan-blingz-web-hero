import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Player {

    constructor(scene) {

        this.group = new THREE.Group();

        // ==============================
        // PLAYER SETTINGS
        // ==============================

        this.speed = 0.12;
        this.runSpeed = 0.22;

        this.velocityY = 0;
        this.gravity = -0.02;
        this.jumpPower = 0.35;

        this.isGrounded = true;

        // ==============================
        // BODY
        // ==============================

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1.5, 0.6),
            new THREE.MeshStandardMaterial({
                color: 0x2255cc
            })
        );

        body.position.y = 2;

        this.group.add(body);

        // ==============================
        // HEAD
        // ==============================

        const head = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.45,
                24,
                24
            ),
            new THREE.MeshStandardMaterial({
                color: 0xffc79c
            })
        );

        head.position.y = 3.1;

        this.group.add(head);

        // ==============================
        // LEFT ARM
        // ==============================

        const leftArm = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.3,
                1.2,
                0.3
            ),
            new THREE.MeshStandardMaterial({
                color: 0x2255cc
            })
        );

        leftArm.position.set(
            -0.7,
            2,
            0
        );

        this.group.add(leftArm);

        // ==============================
        // RIGHT ARM
        // ==============================

        const rightArm = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.3,
                1.2,
                0.3
            ),
            new THREE.MeshStandardMaterial({
                color: 0x2255cc
            })
        );

        rightArm.position.set(
            0.7,
            2,
            0
        );

        this.group.add(rightArm);

        // ==============================
        // LEFT LEG
        // ==============================

        const leftLeg = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.35,
                1,
                0.35
            ),
            new THREE.MeshStandardMaterial({
                color: 0x222222
            })
        );

        leftLeg.position.set(
            -0.25,
            0.75,
            0
        );

        this.group.add(leftLeg);

        // ==============================
        // RIGHT LEG
        // ==============================

        const rightLeg = leftLeg.clone();

        rightLeg.position.x = 0.25;

        this.group.add(rightLeg);

        // ==============================
        // ADD PLAYER TO WORLD
        // ==============================

        scene.add(this.group);
    }

    // ==============================
    // UPDATE PLAYER
    // ==============================

    update(keys) {

        let currentSpeed = this.speed;

        // Hold SHIFT to run

        if (
            keys["shift"]
        ) {
            currentSpeed = this.runSpeed;
        }

        // ==============================
        // MOVEMENT
        // ==============================

        if (keys["w"]) {
            this.group.position.z -= currentSpeed;
        }

        if (keys["s"]) {
            this.group.position.z += currentSpeed;
        }

        if (keys["a"]) {
            this.group.position.x -= currentSpeed;
        }

        if (keys["d"]) {
            this.group.position.x += currentSpeed;
        }

        // ==============================
        // JUMP / GRAVITY
        // ==============================

        this.velocityY += this.gravity;

        this.group.position.y += this.velocityY;

        // Ground level

        if (
            this.group.position.y <= 0
        ) {

            this.group.position.y = 0;

            this.velocityY = 0;

            this.isGrounded = true;
        }

        // SPACE = JUMP

        if (
            keys[" "] &&
            this.isGrounded
        ) {

            this.velocityY =
                this.jumpPower;

            this.isGrounded = false;
        }
    }
}
