import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";

export class Player {

    constructor(scene) {

        this.scene = scene;

        this.group = new THREE.Group();

        this.speed = 0.12;
        this.runSpeed = 0.22;

        this.velocityY = 0;
        this.gravity = -0.02;
        this.jumpPower = 0.35;

        this.isGrounded = true;

        this.mixer = null;

        scene.add(this.group);

        this.loadModel();
    }

    loadModel() {

        const loader = new GLTFLoader();

        loader.load(
            "./assets/characters/logan_blingz_original.glb",

            (gltf) => {

                const model = gltf.scene;

                model.scale.set(
                    1,
                    1,
                    1
                );

                model.position.set(
                    0,
                    0,
                    0
                );

                this.group.add(model);

                this.model = model;

                // Load animations if the model has any

                if (
                    gltf.animations &&
                    gltf.animations.length > 0
                ) {

                    this.mixer =
                        new THREE.AnimationMixer(
                            model
                        );

                    const animation =
                        this.mixer.clipAction(
                            gltf.animations[0]
                        );

                    animation.play();
                }

                console.log(
                    "Logan 3D model loaded successfully!"
                );
            },

            (progress) => {

                if (progress.total) {

                    const percent =
                        (progress.loaded /
                         progress.total) * 100;

                    console.log(
                        `Logan model: ${percent.toFixed(0)}%`
                    );
                }
            },

            (error) => {

                console.error(
                    "Could not load Logan model:",
                    error
                );
            }
        );
    }

    update(keys, delta = 0.016) {

        let currentSpeed =
            this.speed;

        if (keys["shift"]) {

            currentSpeed =
                this.runSpeed;
        }

        if (keys["w"]) {

            this.group.position.z -=
                currentSpeed;
        }

        if (keys["s"]) {

            this.group.position.z +=
                currentSpeed;
        }

        if (keys["a"]) {

            this.group.position.x -=
                currentSpeed;
        }

        if (keys["d"]) {

            this.group.position.x +=
                currentSpeed;
        }

        // Jump

        if (
            keys[" "] &&
            this.isGrounded
        ) {

            this.velocityY =
                this.jumpPower;

            this.isGrounded =
                false;
        }

        // Gravity

        this.velocityY +=
            this.gravity;

        this.group.position.y +=
            this.velocityY;

        // Ground

        if (
            this.group.position.y <= 0
        ) {

            this.group.position.y = 0;

            this.velocityY = 0;

            this.isGrounded = true;
        }

        // Update animations

        if (this.mixer) {

            this.mixer.update(
                delta
            );
        }
    }
}
