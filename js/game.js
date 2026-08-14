import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { Player } from "./player.js";
import { createCity } from "./city.js";
import { createNPCs } from "./npcs.js";
import { Vehicle } from "./vehicles.js";
import { buildingList } from "./buildings.js";


// ======================================
// SCENE
// ======================================

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(
        0x87ceeb
    );


// ======================================
// CAMERA
// ======================================

const camera =
    new THREE.PerspectiveCamera(
        70,
        window.innerWidth /
        window.innerHeight,
        0.1,
        2000
    );


// ======================================
// RENDERER
// ======================================

const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    });

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);

document.body.appendChild(
    renderer.domElement
);


// ======================================
// LIGHTING
// ======================================

const sunlight =
    new THREE.DirectionalLight(
        0xffffff,
        4
    );

sunlight.position.set(
    100,
    150,
    100
);

scene.add(
    sunlight
);

scene.add(
    new THREE.AmbientLight(
        0xffffff,
        1.5
    )
);


// ======================================
// CITY
// ======================================

createCity(
    scene
);


// ======================================
// PLAYER
// ======================================

const player =
    new Player(
        scene
    );


// ======================================
// NPCS
// ======================================

const npcs =
    createNPCs(
        scene
    );


// ======================================
// VEHICLES
// ======================================

const car =
    new Vehicle(
        scene,
        "car",
        8,
        0
    );

const bike =
    new Vehicle(
        scene,
        "bike",
        14,
        0
    );

const jet =
    new Vehicle(
        scene,
        "jet",
        25,
        0
    );

const vehicles = [
    car,
    bike,
    jet
];

let currentVehicle =
    null;


// ======================================
// KEYBOARD
// ======================================

const keys = {};

window.addEventListener(
    "keydown",
    (event) => {

        const key =
            event.key.toLowerCase();

        keys[key] = true;

        // ENTER / EXIT VEHICLE

        if (key === "e") {

            if (
                currentVehicle
            ) {

                currentVehicle.exit();

                player.group.visible =
                    true;

                player.group.position.copy(
                    currentVehicle.group.position
                );

                player.group.position.x +=
                    3;

                currentVehicle =
                    null;

                return;
            }

            let nearestVehicle =
                null;

            let nearestDistance =
                Infinity;

            for (
                const vehicle of vehicles
            ) {

                const distance =
                    player.group.position.distanceTo(
                        vehicle.group.position
                    );

                if (
                    distance < 6 &&
                    distance < nearestDistance
                ) {

                    nearestDistance =
                        distance;

                    nearestVehicle =
                        vehicle;
                }
            }

            if (
                nearestVehicle
            ) {

                currentVehicle =
                    nearestVehicle;

                currentVehicle.enter();

                player.group.visible =
                    false;
            }
        }
    }
);


window.addEventListener(
    "keyup",
    (event) => {

        keys[
            event.key.toLowerCase()
        ] = false;
    }
);


// ======================================
// FIND WORKPLACE
// ======================================

function findWorkplace(
    npc
) {

    const matching =
        buildingList.filter(
            building =>
                building.workplace ===
                npc.job &&
                building.city ===
                npc.homeCity
        );

    if (
        matching.length === 0
    ) {

        return null;
    }

    return matching[
        Math.floor(
            Math.random() *
            matching.length
        )
    ];
}


// ======================================
// NPC JOB SYSTEM
// ======================================

function updateNPCJobs() {

    for (
        const npc of npcs
    ) {

        // Assign workplace
        if (
            !npc.workplace
        ) {

            npc.workplace =
                findWorkplace(
                    npc
                );
        }

        // ==================================
        // WORKING
        // ==================================

        if (
            npc.state ===
            "working"
        ) {

            npc.workTimer--;

            if (
                npc.workTimer <= 0
            ) {

                npc.state =
                    "goingHome";

                npc.object.visible =
                    true;

                npc.direction =
                    Math.random() *
                    Math.PI *
                    2;

                npc.workTimer =
                    600 +
                    Math.random() *
                    600;
            }

            continue;
        }

        // ==================================
        // GO TO WORK
        // ==================================

        if (
            npc.state ===
            "goingToWork"
        ) {

            if (
                npc.workplace
            ) {

                const dx =
                    npc.workplace.x -
                    npc.object.position.x;

                const dz =
                    npc.workplace.z -
                    npc.object.position.z;

                const distance =
                    Math.sqrt(
                        dx * dx +
                        dz * dz
                    );

                npc.direction =
                    Math.atan2(
                        dz,
                        dx
                    );

                if (
                    distance < 4
                ) {

                    npc.state =
                        "working";

                    npc.object.visible =
                        false;
                }
            }
        }

        // ==================================
        // GO HOME
        // ==================================

        if (
            npc.state ===
            "goingHome"
        ) {

            const targetX =
                npc.homeCity ===
                "Blingz City"
                    ? 0
                    : 350;

            const dx =
                targetX -
                npc.object.position.x;

            npc.direction =
                dx >= 0
                    ? 0
                    : Math.PI;

            if (
                Math.abs(dx) < 5
            ) {

                npc.state =
                    "goingToWork";
            }
        }

        // ==================================
        // RANDOM CITY TRAVEL
        // ==================================

        if (
            Math.random() < 0.00015 &&
            !currentVehicle
        ) {

            npc.state =
                "travelling";

            npc.destinationCity =
                npc.currentCity ===
                "Blingz City"
                    ? "Central City"
                    : "Blingz City";
        }

        // ==================================
        // CITY TRAVEL
        // ==================================

        if (
            npc.state ===
            "travelling"
        ) {

            const targetX =
                npc.destinationCity ===
                "Central City"
                    ? 350
                    : 0;

            const dx =
                targetX -
                npc.object.position.x;

            npc.direction =
                dx >= 0
                    ? 0
                    : Math.PI;

            npc.object.position.x +=
                Math.cos(
                    npc.direction
                ) *
                npc.speed *
                2;

            if (
                Math.abs(dx) < 5
            ) {

                npc.currentCity =
                    npc.destinationCity;

                npc.state =
                    "goingToWork";
            }
        }
    }
}


// ======================================
// NORMAL NPC MOVEMENT
// ======================================

function updateNPCs() {

    for (
        const npc of npcs
    ) {

        if (
            npc.state ===
            "working"
        ) {

            continue;
        }

        if (
            npc.state ===
            "travelling"
        ) {

            continue;
        }

        npc.object.position.x +=
            Math.cos(
                npc.direction
            ) *
            npc.speed;

        npc.object.position.z +=
            Math.sin(
                npc.direction
            ) *
            npc.speed;

        if (
            Math.random() < 0.003
        ) {

            npc.direction =
                Math.random() *
                Math.PI *
                2;
        }

        npc.object.position.x =
            THREE.MathUtils.clamp(
                npc.object.position.x,
                -245,
                595
            );

        npc.object.position.z =
            THREE.MathUtils.clamp(
                npc.object.position.z,
                -245,
                245
            );
    }
}


// ======================================
// VEHICLES
// ======================================

function updateVehicles() {

    if (
        currentVehicle
    ) {

        currentVehicle.update(
            keys
        );
    }
}


// ======================================
// PLAYER CITY TRAVEL
// ======================================

function updatePlayerTravel() {

    // Highway area between cities
    // Blingz City ends around x=150
    // Central City begins around x=250

    if (
        player.group.position.x > 170 &&
        player.group.position.x < 180
    ) {

        console.log(
            "Entering the highway to Central City..."
        );
    }
}


// ======================================
// CAMERA
// ======================================

function updateCamera() {

    if (
        currentVehicle
    ) {

        camera.position.x =
            currentVehicle.group.position.x;

        camera.position.y =
            currentVehicle.group.position.y +
            6;

        camera.position.z =
            currentVehicle.group.position.z +
            12;

        camera.lookAt(
            currentVehicle.group.position
        );

        return;
    }

    camera.position.x =
        player.group.position.x;

    camera.position.y =
        player.group.position.y +
        5;

    camera.position.z =
        player.group.position.z +
        10;

    camera.lookAt(
        player.group.position.x,
        player.group.position.y +
        1.5,
        player.group.position.z
    );
}


// ======================================
// GAME LOOP
// ======================================

function animate() {

    requestAnimationFrame(
        animate
    );

    if (
        !currentVehicle
    ) {

        player.update(
            keys
        );
    }

    updateNPCJobs();

    updateNPCs();

    updateVehicles();

    updatePlayerTravel();

    updateCamera();

    renderer.render(
        scene,
        camera
    );
}


animate();


// ======================================
// RESIZE
// ======================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);
