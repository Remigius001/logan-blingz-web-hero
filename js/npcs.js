import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { buildingList } from "./buildings.js";

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
    "Grace",
    "Lucas",
    "Ava",
    "Mason",
    "Lily",
    "Ethan",
    "Chloe",
    "Leo",
    "Amelia"
];

export function createNPCs(scene) {

    const npcs = [];

    for (let i = 0; i < names.length; i++) {

        const npc = new THREE.Group();

        // =================================
        // BODY
        // =================================

        const body = new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.35,
                0.8,
                8,
                16
            ),
            new THREE.MeshStandardMaterial({
                color:
                    0x3366ff +
                    Math.floor(
                        Math.random() * 0x444444
                    )
            })
        );

        body.position.y = 1.3;

        npc.add(body);

        // =================================
        // HEAD
        // =================================

        const head = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.38,
                20,
                20
            ),
            new THREE.MeshStandardMaterial({
                color: 0xffc79c
            })
        );

        head.position.y = 2.3;

        npc.add(head);

        // =================================
        // ARMS
        // =================================

        const armMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xdddddd
            });

        const leftArm = new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.11,
                0.65,
                6,
                12
            ),
            armMaterial
        );

        leftArm.position.set(
            -0.48,
            1.35,
            0
        );

        npc.add(leftArm);

        const rightArm =
            leftArm.clone();

        rightArm.position.x = 0.48;

        npc.add(rightArm);

        // =================================
        // LEGS
        // =================================

        const legMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x222222
            });

        const leftLeg = new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.13,
                0.6,
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

        npc.add(leftLeg);

        const rightLeg =
            leftLeg.clone();

        rightLeg.position.x = 0.2;

        npc.add(rightLeg);

        // =================================
        // POSITION
        // =================================

        npc.position.set(
            (Math.random() - 0.5) * 420,
            0,
            (Math.random() - 0.5) * 420
        );

        scene.add(npc);

        // Pick building
        const targetBuilding =
            buildingList.length > 0
                ? buildingList[
                    Math.floor(
                        Math.random() *
                        buildingList.length
                    )
                ]
                : null;

        npcs.push({

            object: npc,

            name: names[i],

            direction:
                Math.random() *
                Math.PI *
                2,

            speed:
                0.02 +
                Math.random() *
                0.02,

            state: "walking",

            targetBuilding,

            insideTimer: 0,

            reactionTimer: 0
        });
    }

    return npcs;
}
