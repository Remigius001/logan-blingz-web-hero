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
            "./assets/logan_blingz_original (3).glb",

            (gltf) => {

                console.log("Logan GLB loaded!");

                const model = gltf.scene;

                this.model = model;

                model.scale.set(
                    0.8,
                    0.8,
                    0.8
                );

                model.position.set(
                    0,
                    0,
                    0
                );

                model.traverse((object) => {

                    if (object.isMesh) {

                        object.visible = true;
                        object.castShadow = true;
                        object.receiveShadow = true;
                    }
                });

                this.group.add(model);

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
                    "Logan GLB error:",
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
