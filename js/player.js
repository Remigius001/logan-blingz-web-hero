import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { GLTFLoader } from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";

export class Player {

    constructor(scene) {

        this.group = new THREE.Group();

        this.speed = 0.12;
        this.runSpeed = 0.22;

        this.velocityY = 0;
        this.gravity = -0.02;
        this.jumpPower = 0.35;

        this.isGrounded = true;

        this.model = null;
        this.fallback = null;

        scene.add(this.group);

        this.createFallback();
        this.loadModel();
    }

    // ======================================
    // FALLBACK CHARACTER
    // ======================================

    createFallback() {

        const fallback =
            new THREE.Group();

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(
                1,
                1.5,
                0.6
            ),
            new THREE.MeshStandardMaterial({
                color: 0x2255cc
            })
        );

        body.position.y = 2;

        fallback.add(body);

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

        fallback.add(head);

        // Arms
        const armMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x2255cc
            });

        const leftArm = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.3,
                1.2,
                0.3
            ),
            armMaterial
        );

        leftArm.position.set(
            -0.7,
            2,
            0
        );

        fallback.add(leftArm);

        const rightArm =
            leftArm.clone();

        rightArm.position.x =
            0.7;

        fallback.add(rightArm);

        // Legs
        const legMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x222222
            });

        const leftLeg = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.35,
                1,
                0.35
            ),
            legMaterial
        );

        leftLeg.position.set(
            -0.25,
            0.75,
            0
        );

        fallback.add(leftLeg);

        const rightLeg =
            leftLeg.clone();

        rightLeg.position.x =
            0.25;

        fallback.add(rightLeg);

        this.fallback =
            fallback;

        this.group.add(
            this.fallback
        );
    }

    // ======================================
    // LOAD REAL MODEL
    // ======================================

    loadModel() {

        const loader =
            new GLTFLoader();

        const modelPath =
            "./assets/logan_blingz_original (3).glb";

        loader.load(
            modelPath,

            (gltf) => {

                const model =
                    gltf.scene;

                model.scale.set(
                    0.8,
                    0.8,
                    0.8
                );

                model.traverse(
                    (object) => {

                        if (
                            object.isMesh
                        ) {

                            object.visible =
                                true;

                            object.castShadow =
                                true;

                            object.receiveShadow =
                                true;
                        }
                    }
                );

                this.group.add(
                    model
                );

                this.model =
                    model;

                this.fallback.visible =
                    false;

                console.log(
                    "LOGAN MODEL LOADED"
                );
            },

            undefined,

            (error) => {

                console.error(
                    "LOGAN MODEL COULD NOT LOAD:",
                    error
                );

                this.fallback.visible =
                    true;
            }
        );
    }

    // ======================================
    // UPDATE
    // ======================================

    update(keys) {

        let speed =
            this.speed;

        if (keys["shift"]) {

            speed =
                this.runSpeed;
        }

        let moveX = 0;
        let moveZ = 0;

        if (keys["w"]) {
            moveZ -= 1;
        }

        if (keys["s"]) {
            moveZ += 1;
        }

        if (keys["a"]) {
            moveX -= 1;
        }

        if (keys["d"]) {
            moveX += 1;
        }

        // ==================================
        // MOVEMENT
        // ==================================

        const moving =
            moveX !== 0 ||
            moveZ !== 0;

        if (moving) {

            const length =
                Math.sqrt(
                    moveX * moveX +
                    moveZ * moveZ
                );

            moveX /= length;
            moveZ /= length;

            this.group.position.x +=
                moveX * speed;

            this.group.position.z +=
                moveZ * speed;

            // ==================================
            // TURN TO FACE MOVEMENT DIRECTION
            // ==================================

            const targetRotation =
                Math.atan2(
                    moveX,
                    moveZ
                );

            this.group.rotation.y =
                THREE.MathUtils.lerp(
                    this.group.rotation.y,
                    targetRotation,
                    0.18
                );
        }

        // ==================================
        // JUMP
        // ==================================

        if (
            keys[" "] &&
            this.isGrounded
        ) {

            this.velocityY =
                this.jumpPower;

            this.isGrounded =
                false;
        }

        // ==================================
        // GRAVITY
        // ==================================

        this.velocityY +=
            this.gravity;

        this.group.position.y +=
            this.velocityY;

        if (
            this.group.position.y <= 0
        ) {

            this.group.position.y = 0;

            this.velocityY = 0;

            this.isGrounded = true;
        }
    }
}
