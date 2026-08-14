import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Villain {

    constructor(
        scene,
        name,
        x,
        z,
        color = 0x5511aa
    ) {
        this.scene = scene;
        this.name = name;

        this.maxHealth = 120;
        this.health = 120;

        this.maxEnergy = 100;
        this.energy = 100;

        this.defeated = false;
        this.injured = false;

        this.attackCooldown = 0;
        this.speed = 0.03;

        this.group = new THREE.Group();

        // Body
        const body = new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.45,
                1.05,
                8,
                16
            ),
            new THREE.MeshStandardMaterial({
                color: color
            })
        );

        body.position.y = 1.45;
        this.group.add(body);

        // Head
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.43,
                20,
                20
            ),
            new THREE.MeshStandardMaterial({
                color: 0x9a6a4a
            })
        );

        head.position.y = 2.5;
        this.group.add(head);

        // Arms
        const armMaterial =
            new THREE.MeshStandardMaterial({
                color: color
            });

        const leftArm = new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.13,
                0.72,
                6,
                12
            ),
            armMaterial
        );

        leftArm.position.set(
            -0.55,
            1.5,
            0
        );

        this.group.add(leftArm);

        const rightArm = leftArm.clone();
        rightArm.position.x = 0.55;
        this.group.add(rightArm);

        // Legs
        const legMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x111111
            });

        const leftLeg = new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.15,
                0.72,
                6,
                12
            ),
            legMaterial
        );

        leftLeg.position.set(
            -0.22,
            0.45,
            0
        );

        this.group.add(leftLeg);

        const rightLeg = leftLeg.clone();
        rightLeg.position.x = 0.22;
        this.group.add(rightLeg);

        this.group.position.set(
            x,
            0,
            z
        );

        scene.add(this.group);
    }

    moveToward(target) {

        if (
            this.defeated ||
            !target
        ) {
            return;
        }

        const dx =
            target.x -
            this.group.position.x;

        const dz =
            target.z -
            this.group.position.z;

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
                0.12
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

        if (this.health <= 60) {
            this.injured = true;
        }

        if (this.health === 0) {
            this.defeated = true;
            this.group.rotation.x = -0.45;
        }
    }

    attack(target, damage = 15) {

        if (
            this.defeated ||
            !target ||
            target.defeated
        ) {
            return false;
        }

        if (this.attackCooldown > 0) {
            return false;
        }

        this.attackCooldown = 60;

        target.takeDamage(damage);

        return true;
    }

    update() {

        if (this.defeated) {
            return;
        }

        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }

        this.energy += 0.2;

        this.energy =
            Math.min(
                this.maxEnergy,
                this.energy
            );
    }
}
