import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Hero {

    constructor(
        scene,
        name,
        x,
        z,
        color = 0x3366ff
    ) {
        this.scene = scene;
        this.name = name;

        this.maxHealth = 100;
        this.health = 100;

        this.maxEnergy = 100;
        this.energy = 100;

        this.speed = 0.10;

        this.injured = false;
        this.defeated = false;

        this.group = new THREE.Group();

        // Body
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

        // Head
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

        // Left arm
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

        // Right arm
        const rightArm = leftArm.clone();
        rightArm.position.x = 0.52;
        this.group.add(rightArm);

        // Left leg
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

        // Right leg
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

    moveToward(x, z) {

        if (this.defeated) {
            return;
        }

        const dx =
            x - this.group.position.x;

        const dz =
            z - this.group.position.z;

        const distance =
            Math.sqrt(
                dx * dx +
                dz * dz
            );

        if (distance < 0.15) {
            return;
        }

        const directionX =
            dx / distance;

        const directionZ =
            dz / distance;

        this.group.position.x +=
            directionX * this.speed;

        this.group.position.z +=
            directionZ * this.speed;

        const targetRotation =
            Math.atan2(
                directionX,
                directionZ
            );

        this.group.rotation.y =
            THREE.MathUtils.lerp(
                this.group.rotation.y,
                targetRotation,
                0.15
            );
    }

    takeDamage(amount) {

        if (this.defeated) {
            return;
        }

        this.health -= amount;

        this.health =
            Math.max(
                0,
                this.health
            );

        if (this.health <= 50) {
            this.injured = true;
        }

        if (this.health === 0) {
            this.defeated = true;
            this.injured = true;
            this.group.rotation.x = -0.45;
        }
    }

    recover(amount) {

        if (this.defeated) {
            return;
        }

        this.health += amount;

        this.health =
            Math.min(
                this.maxHealth,
                this.health
            );

        if (this.health > 50) {
            this.injured = false;
            this.group.rotation.x = 0;
            this.group.rotation.z = 0;
        }
    }

    attack(target, damage = 20) {

        if (
            this.defeated ||
            !target ||
            target.defeated
        ) {
            return false;
        }

        if (this.energy < 10) {
            return false;
        }

        this.energy -= 10;

        target.takeDamage(damage);

        return true;
    }

    update() {

        if (this.defeated) {
            return;
        }

        this.energy += 0.25;

        this.energy =
            Math.min(
                this.maxEnergy,
                this.energy
            );
    }
}
