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

export function createNPCs(scene) {

    const npcs = [];

    for (let i = 0; i < 12; i++) {

        const npc = new THREE.Group();

        // ==============================
        // BODY
        // ==============================

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.7,
                1.2,
                0.5
            ),
            new THREE.MeshStandardMaterial({
                color:
                    0x3366ff +
                    Math.floor(
                        Math.random() * 0x333333
                    )
            })
        );

        body.position.y = 1.2;

        npc.add(body);

        // ==============================
        // HEAD
        // ==============================

        const head = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.35,
                16,
                16
            ),
            new THREE.MeshStandardMaterial({
                color: 0xffc79c
            })
        );

        head.position.y = 2.05;

        npc.add(head);

        // ==============================
        // POSITION
        // ==============================

        npc.position.set(
            (Math.random() - 0.5) * 150,
            0,
            (Math.random() - 0.5) * 150
        );

        scene.add(npc);

        npcs.push({
            object: npc,
            name: names[i],
            direction: Math.random() * Math.PI * 2,
            speed: 0.01 + Math.random() * 0.02
        });
    }

    return npcs;
}
