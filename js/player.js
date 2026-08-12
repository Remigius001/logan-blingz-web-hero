import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";

export class Player {

    constructor(scene) {

        this.group = new THREE.Group();

        this.speed = 0.12;
        this.runSpeed = 0.22;

        this.velocityY = 0;
        this.gravity = -0.02;
        this.jumpPower = 0.35;
        this.isGrounded = true;

        scene.add(this.group);

        this.createFallback();
        this.loadModel();
    }

    createFallback() {

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1.5, 0.6),
            new THREE.MeshStandardMaterial({
                color: 0x2255cc
            })
        );

        body.position.y = 2;

        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.45, 24, 24),
            new THREE.MeshStandardMaterial({
                color: 0xffc79c
            })
        );

        head.position.y = 3.1;

        this.fallback = new THREE.Group();

        this.fallback.add(body);
        this.fallback.add(head);

        this.group.add(this.fallback);
    }

    loadModel() {

        const loader = new GLTFLoader();

        const modelPath =
            "./assets/logan_blingz_original (3).glb";

        loader.load(
            modelPath,

            (gltf) => {

                const model = gltf.scene;

                model.scale.set(
                    0.8,
                    0.8,
                    0.8
                );

                model.traverse((object) => {

                    if (object.isMesh) {
                        object.visible = true;
                    }

                });

                this.group.add(model);

                this.fallback.visible = false;

                this.model = model;

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

                // Keep the fallback character visible
                this.fallback.visible = true;
            }
        );
    }

    update(keys) {

        let speed = this.speed;

        if (keys["shift"]) {
            speed = this.runSpeed;
        }

        if (keys["w"]) {
            this.group.position.z -= speed;
        }

        if (keys["s"]) {
            this.group.position.z += speed;
        }

        if (keys["a"]) {
            this.group.position.x -= speed;
        }

        if (keys["d"]) {
            this.group.position.x += speed;
        }

        if (keys[" "] && this.isGrounded) {

            this.velocityY = this.jumpPower;
            this.isGrounded = false;
        }

        this.velocityY += this.gravity;

        this.group.position.y += this.velocityY;

        if (this.group.position.y <= 0) {

            this.group.position.y = 0;
            this.velocityY = 0;
            this.isGrounded = true;
        }
    }
}
