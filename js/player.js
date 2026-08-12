import * as THREE from "three";
import { GLTFLoader } from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";

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

                console.log("LOGAN MODEL LOADED");

                const model = gltf.scene;

                this.model = model;

                // Make every part of the model visible
                model.traverse((object) => {

                    if (object.isMesh) {

                        object.visible = true;

                        object.castShadow = true;
                        object.receiveShadow = true;
                    }

                });

                // Size
                model.scale.set(
                    0.8,
                    0.8,
                    0.8
                );

                // Position
                model.position.set(
                    0,
                    0,
                    0
                );

                this.group.add(model);

                // Center the model
                const box =
                    new THREE.Box3()
                        .setFromObject(model);

                const center =
                    box.getCenter(
                        new THREE.Vector3()
                    );

                model.position.x -= center.x;
                model.position.z -= center.z;

                // Put feet on the ground
                const finalBox =
                    new THREE.Box3()
                        .setFromObject(model);

                model.position.y -= finalBox.min.y;

                // Animations, if the model has them
                if (gltf.animations.length > 0) {

                    this.mixer =
                        new THREE.AnimationMixer(model);

                    const action =
                        this.mixer.clipAction(
                            gltf.animations[0]
                        );

                    action.play();
                }

            },

            undefined,

            (error) => {

                console.error(
                    "Could not load Logan GLB:",
                    error
                );
            }
        );
    }

    update(keys, delta = 0.016) {

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

        // Jump
        if (
            keys[" "] &&
            this.isGrounded
        ) {

            this.velocityY =
                this.jumpPower;

            this.isGrounded = false;
        }

        // Gravity
        this.velocityY += this.gravity;

        this.group.position.y +=
            this.velocityY;

        // Ground collision
        if (
            this.group.position.y <= 0
        ) {

            this.group.position.y = 0;

            this.velocityY = 0;

            this.isGrounded = true;
        }

        // Animation
        if (this.mixer) {

            this.mixer.update(delta);
        }
    }
}
