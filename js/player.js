import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Player {

    constructor(scene) {

        this.group = new THREE.Group();

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

        const leftLeg = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 1, 0.35),
            new THREE.MeshStandardMaterial({
                color: 0x222222
            })
        );

        leftLeg.position.set(-0.25, 0.75, 0);
        this.group.add(leftLeg);

        const rightLeg = leftLeg.clone();

        rightLeg.position.x = 0.25;
        this.group.add(rightLeg);

        scene.add(this.group);
    }

    update(keys) {

        const speed = 0.12;

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
    }
}
