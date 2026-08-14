import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Hero {

    constructor(scene, name, x, z, color = 0x3366ff) {

        this.scene = scene;
        this.name = name;

        this.maxHealth = 100;
        this.health = 100;

        this.speed = 0.10;
        this.energy = 100;

        this.defeated = false;
        this.injured = false;

        this.group = new THREE.Group();

        // BODY
        const body = new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.4,
                1.0,
                8,
                16
            ),
            new THREE.MeshStandardMaterial({
                color: color
            })
        );

        body.position.y = 1.4;
        this.group.add(body);

        // HEAD
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.42,
                20,
                20
            ),
            new THREE.MeshStandardMaterial({
                color: 0xffc79c
            })
        );

        head.position.y = 2.45;
        this.group.add(head);

        // ARMS
        const armMaterial =
            new THREE.MeshStandardMaterial({
                color: color
            });

        const leftArm = new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.12,
                0.7,
                6,
                12
            ),
            armMaterial
        );

        leftArm.position.set(
            -0.52,
            1.45,
            0
        );

        this.group.add(leftArm);

        const rightArm = leftArm.clone();

        rightArm.position.x = 0.52;

        this.group.add(rightArm);

        // LEGS
        const legMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x222222
            });

        const leftLeg = new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.14,
                0.7,
                6,
                12
            ),
            legMaterial
        );

        leftLeg.position.set(
            -0.2,
            0.45,
            0
        );

        this.group.add(leftLeg);

        const rightLeg = leftLeg.clone();

        rightLeg.position.x = 0.2;

        this.group.add(rightLeg);

        this.group.position.set(
            x,
            0,
            z
        );

        scene.add(this.group);
    }

    takeDamage(amount) {

        if (this.defeated) {
            return;
        }

        this.health -= amount;

        if (this.health < 0) {
            this.health = 0;
        }

        // Non-graphic injury state
        if (this.health <= 50) {
            this.injured = true;
            this.group.rotation.z = 0.05;
        }

        // Defeated
        if (this.health <= 0) {

            this.defeated = true;
            this.injured = true;

            this.group.rotation.x = -0.5;

            console.log(
                `${this.name} has been defeated.`
            );
        }
    }

    recover(amount) {

        if (this.defeated) {
            return;
        }

        this.health += amount;

        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }

        if (this.health > 50) {
            this.injured = false;
            this.group.rotation.z = 0;
        }
    }

    attack(target) {

        if (
            this.defeated ||
            target.defeated
        ) {
            return;
        }

        if (this.energy < 10) {
            return;
        }

        this.energy -= 10;

        target.takeDamage(20);

        console.log(
            `${this.name} attacked ${target.name}.`
        );
    }

    update() {

        // Slowly restore energy
        this.energy += 0.2;

        if (this.energy > 100) {
            this.energy = 100;
        }
    }
}
