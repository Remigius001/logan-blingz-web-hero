import * as THREE from "three";
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

        this.model = null;
        this.mixer = null;

        scene.add(this.group);

        this.loadModel();
    }

    loadModel() {

        const loader = new GLTFLoader();

        loader.load(
            "./assets/characters/logan_blingz_original.glb",

            (gltf) => {

                console.log("LOGAN GLB LOADED");

                const model = gltf.scene;

                this.model = model;

                // Make sure the model is visible
                model.visible = true;

                // Put the model on the ground
                model.position.set(0, 0, 0);

                // The model is about 3.6 units tall.
                // Make it a little smaller for the game.
                model.scale.set(
                    0.8,
                    0.8,
                    0.8
                );

                this.group.add(model);

                // Center the model using its bounding box
                const box =
                    new THREE.Box3().setFromObject(model);

                const center =
                    box.getCenter(new THREE.Vector3());

                model.position.x -= center.x;
                model.position.z -= center.z;

                // Put feet approximately at ground level
                const newBox =
                    new THREE.Box3().setFromObject(model);

                model.position.y -= newBox.min.y;

                // Animations, if present
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
                    "LOGAN MODEL ERROR:",
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

        if (this.mixer) {
            this.mixer.update(delta);
        }
    }
}
