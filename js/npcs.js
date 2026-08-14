import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const npcData = [
    { name: "Daniel", job: "Teacher", city: "Blingz City" },
    { name: "Sarah", job: "Doctor", city: "Central City" },
    { name: "Michael", job: "Police Officer", city: "Blingz City" },
    { name: "Emma", job: "Shop Worker", city: "Central City" },
    { name: "David", job: "Mechanic", city: "Blingz City" },
    { name: "Sophia", job: "Engineer", city: "Central City" },
    { name: "James", job: "Taxi Driver", city: "Blingz City" },
    { name: "Olivia", job: "Teacher", city: "Central City" },
    { name: "Noah", job: "Student", city: "Blingz City" },
    { name: "Mia", job: "Shop Worker", city: "Central City" },
    { name: "Ethan", job: "Engineer", city: "Blingz City" },
    { name: "Grace", job: "Doctor", city: "Central City" },
    { name: "Lucas", job: "Mechanic", city: "Blingz City" },
    { name: "Ava", job: "Police Officer", city: "Central City" },
    { name: "Mason", job: "Taxi Driver", city: "Blingz City" },
    { name: "Lily", job: "Student", city: "Central City" }
];

export function createNPCs(scene) {

    const npcs = [];

    for (const data of npcData) {

        const npc = new THREE.Group();

        // BODY
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

        // HEAD
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

        // ARMS
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

        const rightArm = leftArm.clone();
        rightArm.position.x = 0.48;
        npc.add(rightArm);

        // LEGS
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

        const rightLeg = leftLeg.clone();
        rightLeg.position.x = 0.2;
        npc.add(rightLeg);

        // CITY START POSITION
        let startX;
        let startZ;

        if (data.city === "Blingz City") {
            startX = -100 + Math.random() * 160;
            startZ = -120 + Math.random() * 240;
        } else {
            startX = 260 + Math.random() * 160;
            startZ = -120 + Math.random() * 240;
        }

        npc.position.set(
            startX,
            0,
            startZ
        );

        scene.add(npc);

        npcs.push({

            object: npc,

            name: data.name,

            job: data.job,

            homeCity: data.city,

            currentCity: data.city,

            state: "goingToWork",

            speed:
                0.02 +
                Math.random() * 0.02,

            direction:
                Math.random() *
                Math.PI *
                2,

            workTimer:
                600 +
                Math.random() * 600,

            travelTimer: 0,

            workplace: null,

            destinationCity: null
        });
    }

    return npcs;
}
