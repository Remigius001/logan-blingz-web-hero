import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const cities = [
    {
        name: "Blingz City",
        x: 0,
        z: 0
    },
    {
        name: "Central City",
        x: 350,
        z: 0
    },
    {
        name: "Metro City",
        x: 700,
        z: 0
    },
    {
        name: "Ocean City",
        x: 1050,
        z: 0
    },
    {
        name: "Liberty City",
        x: 0,
        z: 350
    },
    {
        name: "Neon City",
        x: 350,
        z: 350
    },
    {
        name: "Mountain City",
        x: 700,
        z: 350
    }
];

const firstNames = [
    "Daniel",
    "Sarah",
    "Michael",
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
    "Leo",
    "Amelia",
    "Henry",
    "Ella",
    "Jack",
    "Chloe",
    "William",
    "Zoe",
    "Benjamin",
    "Hannah",
    "Samuel",
    "Aria",
    "Joseph",
    "Nora",
    "Alexander",
    "Layla",
    "Dylan",
    "Ellie",
    "Matthew",
    "Scarlett",
    "Aiden",
    "Victoria",
    "Ryan",
    "Luna",
    "Nathan",
    "Stella",
    "Caleb",
    "Avery",
    "Isaac",
    "Sofia",
    "Logan",
    "Maya",
    "Owen",
    "Hazel",
    "Carter",
    "Ruby",
    "Luke",
    "Ivy",
    "Wyatt",
    "Lucy",
    "Julian",
    "Naomi",
    "Gabriel",
    "Clara",
    "Adam",
    "Eva",
    "Thomas",
    "Alice",
    "Daniel",
    "Jasmine",
    "Jordan",
    "Elena",
    "Marcus",
    "Bella"
];

const jobs = [
    "Teacher",
    "Doctor",
    "Police Officer",
    "Shop Worker",
    "Mechanic",
    "Engineer",
    "Taxi Driver",
    "Chef",
    "Firefighter",
    "Nurse",
    "Builder",
    "Pilot",
    "Cashier",
    "Security Guard",
    "Scientist",
    "Electrician",
    "Dentist",
    "Lawyer",
    "Student",
    "Delivery Driver"
];

const clothingColors = [
    0x3366ff,
    0xff4444,
    0x22aa66,
    0xffaa22,
    0xaa44cc,
    0xffffff,
    0xff7733,
    0x44aaff,
    0x55aa55,
    0xdd66aa
];

function randomItem(array) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];
}

export function createNPCs(scene) {

    const npcs = [];

    let globalNameIndex = 0;

    for (
        const city of cities
    ) {

        // 10 people per city
        for (
            let i = 0;
            i < 10;
            i++
        ) {

            const npc =
                createNPCBody();

            const startX =
                city.x -
                110 +
                Math.random() * 220;

            const startZ =
                city.z -
                110 +
                Math.random() * 220;

            npc.position.set(
                startX,
                0,
                startZ
            );

            scene.add(npc);

            let name =
                firstNames[
                    globalNameIndex %
                    firstNames.length
                ];

            globalNameIndex++;

            // Add a number if a name is reused
            if (
                npcs.some(
                    person =>
                        person.name === name
                )
            ) {

                name =
                    `${name} ${globalNameIndex}`;
            }

            npcs.push({

                object: npc,

                name,

                job:
                    randomItem(jobs),

                city: city.name,

                homeCity:
                    city.name,

                currentCity:
                    city.name,

                state: "walking",

                speed:
                    0.02 +
                    Math.random() *
                    0.025,

                direction:
                    Math.random() *
                    Math.PI *
                    2,

                workplace: null,

                workTimer:
                    400 +
                    Math.random() *
                    900,

                insideTimer: 0,

                destinationCity: null,

                targetX: startX,

                targetZ: startZ
            });
        }
    }

    return npcs;
}


// ==========================================
// CREATE NPC BODY
// ==========================================

function createNPCBody() {

    const npc =
        new THREE.Group();

    // ==================================
    // BODY
    // ==================================

    const body =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.35,
                0.8,
                8,
                16
            ),
            new THREE.MeshStandardMaterial({
                color:
                    randomItem(
                        clothingColors
                    )
            })
        );

    body.position.y =
        1.3;

    body.castShadow = true;

    npc.add(body);

    // ==================================
    // HEAD
    // ==================================

    const skinColors = [
        0xffc79c,
        0xe0a276,
        0xb97850,
        0x75482f
    ];

    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.38,
                20,
                20
            ),
            new THREE.MeshStandardMaterial({
                color:
                    randomItem(
                        skinColors
                    )
            })
        );

    head.position.y =
        2.3;

    head.castShadow = true;

    npc.add(head);

    // ==================================
    // ARMS
    // ==================================

    const armMaterial =
        new THREE.MeshStandardMaterial({
            color:
                0xdddddd
        });

    const leftArm =
        new THREE.Mesh(
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

    leftArm.castShadow = true;

    npc.add(leftArm);

    const rightArm =
        leftArm.clone();

    rightArm.position.x =
        0.48;

    npc.add(rightArm);

    // ==================================
    // LEGS
    // ==================================

    const legColors = [
        0x222222,
        0x333333,
        0x444444,
        0x111111
    ];

    const legMaterial =
        new THREE.MeshStandardMaterial({
            color:
                randomItem(
                    legColors
                )
        });

    const leftLeg =
        new THREE.Mesh(
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

    leftLeg.castShadow = true;

    npc.add(leftLeg);

    const rightLeg =
        leftLeg.clone();

    rightLeg.position.x =
        0.2;

    npc.add(rightLeg);

    return npc;
}
