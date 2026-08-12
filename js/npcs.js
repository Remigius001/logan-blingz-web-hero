import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const names = [
    "Daniel",
    "Michael",
    "Sarah",
    "Emma",
    "David",
    "Sophia",
    "James",
    "Olivia",
    "Noah",
    "Mia",
    "Ethan",
    "Grace"
];

const skinColors = [
    0xffc79c,
    0xd99b72,
    0x8d5524,
    0x6b3e26
];

const shirtColors = [
    0x3366ff,
    0xff4444,
    0x22aa66,
    0xffaa22,
    0xaa44cc,
    0xeeeeee
];

export function createNPCs(scene) {

    const npcs = [];

    for (let i = 0; i < names.length; i++) {

        const npc = new THREE.Group();

        // ==================================
        // BODY
        // ==================================

        const body = new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.35,
                0.9,
                8,
                16
            ),
            new THREE.MeshStandardMaterial({
                color:
                    shirtColors[
                        Math.floor(
                            Math.random() *
                            shirtColors.length
                        )
                    ]
            })
        );

        body.position.y = 1.35;

        npc.add(body);

        // ==================================
        // HEAD
        // ==================================

        const head = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.38,
                24,
                24
            ),
            new THREE.MeshStandardMaterial({
                color:
                    skinColors[
                        Math.floor(
                            Math.random() *
                            skinColors.length
                        )
                    ]
            })
        );

        head.position.y = 2.35;

        npc.add(head);

        // ==================================
        // LEFT ARM
        // ==================================

        const leftArm = new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.12,
                0.65,
                6,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0xeeeeee
            })
        );

        leftArm.position.set(
            -0.5,
            1.4,
            0
        );

        npc.add(leftArm);

        // ==================================
        // RIGHT ARM
        // ==================================

        const rightArm = leftArm.clone();

        rightArm.position.x = 0.5;

        npc.add(rightArm);

        // ==================================
        // LEFT LEG
        // ==================================

        const leftLeg = new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.14,
                0.65,
                6,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x222222
            })
        );

        leftLeg.position.set(
            -0.2,
            0.45,
            0
        );

        npc.add(leftLeg);

        // ==================================
        // RIGHT LEG
        // ==================================

        const rightLeg = leftLeg.clone();

        rightLeg.position.x = 0.2;

        npc.add(rightLeg);

        // ==================================
        // POSITION
        // ==================================

        npc.position.set(
            (Math.random() - 0.5) * 120,
            0,
            (Math.random() - 0.5) * 120
        );

        scene.add(npc);

        // ==================================
        // NPC DATA
        // ==================================

        npcs.push({
            object: npc,
            name: names[i],
            direction:
                Math.random() *
                Math.PI *
                2,
            speed:
                0.01 +
                Math.random() * 0.02
        });
    }

    return npcs;
}
