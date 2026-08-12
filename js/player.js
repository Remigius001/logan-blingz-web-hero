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

        scene.add(this.group);

        // Temporary fallback so the game always has a player
        this.createFallback();

        // Try to load the real model
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

        this.group.add(body);

        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.45, 24, 24),
            new THREE.MeshStandardMaterial({
                color: 0xffc79c
            })
        );

        head.position.y = 3.1;

        this.group.add(head);

        this.fallback = this.group;
    }

    loadModel() {

        const loader = new GLTFLoader();

        const modelURL =
            "./assets/characters/logan_blingz_original.glb";

        console.log("Trying to load:", modelURL);

        loader.load(

            modelURL,

            (gltf) => {

                console.log("LOGAN GLB LOADED!");

                const model = gltf.scene;

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

                // Hide fallback parts
                this.group.children.forEach(
                    child => {
                        child.visible = false;
                    }
                );

                this.group.add(model);

                this.model = model;

                // Make sure every part is visible
                model.traverse(
                    object => {

                        if (object.isMesh) {

                            object.visible = true;

                            object.castShadow = true;
                            object.receiveShadow = true;
                        }
                    }
                );

                // Center model
                const box =
                    new THREE.Box3()
                        .setFromObject(model);

                const size =
                    box.getSize(
                        new THREE.Vector3()
                    );

                const center =
                    box.getCenter(
                        new THREE.Vector3()
                    );

                model.position.x -= center.x;
                model.position.z -= center.z;
                model.position.y -= box.min.y;

                console.log(
                    "Logan size:",
                    size.x,
                    size.y,
                    size.z
                );

                if (gltf.animations.length > 0) {

                    this.mixer =
                        new THREE.AnimationMixer(
                            model
                        );

                    this.action =
                        this.mixer.clipAction(
                            gltf.animations[0]
                        );

                    this.action.play();
                }
            },

            undefined,

            (error) => {

                console.error(
                    "LOGAN GLB FAILED:",
                    error
                );

                console.error(
                    "Check that the file is exactly at:",
                    modelURL
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

            this.velocityY =
                this.jumpPower;

            this.isGrounded = false;
        }

        this.velocityY += this.gravity;

        this.group.position.y +=
            this.velocityY;

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
