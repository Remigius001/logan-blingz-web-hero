import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { Player } from "./player.js";
import { createCity } from "./city.js";
import { createNPCs } from "./npcs.js";
import { Vehicle } from "./vehicles.js";

// ======================================
// SCENE
// ======================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

// ======================================
// CAMERA
// ======================================

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 5, 10);

// ======================================
// RENDERER
// ======================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

// Shadows
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

// ======================================
// LIGHTING
// ======================================

const sunlight = new THREE.DirectionalLight(
    0xffffff,
    4
);

sunlight.position.set(
    80,
    120,
    80
);

sunlight.castShadow = true;

scene.add(sunlight);

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.5
);

scene.add(ambientLight);

// ======================================
// CITY
// ======================================

createCity(scene);

// ======================================
// PLAYER
// ======================================

const player = new Player(scene);

// ======================================
// NPCS
// ======================================

const npcs = createNPCs(scene);

// ======================================
// VEHICLES
// ======================================

const car = new Vehicle(
    scene,
    "car",
    5,
    0
);

const bike = new Vehicle(
    scene,
    "bike",
    10,
    0
);

const jet = new Vehicle(
    scene,
    "jet",
    15,
    0
);

const vehicles = [
    car,
    bike,
    jet
];

// Currently occupied vehicle
let currentVehicle = null;

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

        // ==================================
        // ENTER / EXIT VEHICLE
        // ==================================

        if (key === "e") {

            // Exit current vehicle
            if (currentVehicle) {

                currentVehicle.exit();

                player.group.visible = true;

                player.group.position.copy(
                    currentVehicle.group.position
                );

                player.group.position.x += 3;

                currentVehicle = null;

                console.log(
                    "Logan exited the vehicle."
                );

                return;
            }

            // Find closest vehicle
            let nearestVehicle = null;

            let nearestDistance = Infinity;

            for (const vehicle of vehicles) {

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

            // Enter vehicle
            if (nearestVehicle) {

                currentVehicle =
                    nearestVehicle;

                currentVehicle.enter();

                player.group.visible = false;

                console.log(
                    `Logan entered ${currentVehicle.type}.`
                );
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
// NPC SYSTEM
// ======================================

function updateNPCs() {

    for (const npc of npcs) {

        // ==================================
        // NPC INSIDE BUILDING
        // ==================================

        if (
            npc.state === "inside"
        ) {

            npc.insideTimer -= 1;

            if (
                npc.insideTimer <= 0
            ) {

                npc.state = "walking";

                npc.object.visible = true;

                npc.object.position.y = 0;

                npc.direction =
                    Math.random() *
                    Math.PI *
                    2;
            }

            continue;
        }

        // ==================================
        // NPC REACTING TO ACCIDENT
        // ==================================

        if (
            npc.state === "reacting"
        ) {

            npc.reactionTimer -= 1;

            // Move away from the incident
            npc.object.position.x +=
                Math.cos(
                    npc.direction
                ) * 0.05;

            npc.object.position.z +=
                Math.sin(
                    npc.direction
                ) * 0.05;

            if (
                npc.reactionTimer <= 0
            ) {

                npc.state = "walking";

                npc.direction =
                    Math.random() *
                    Math.PI *
                    2;
            }

            continue;
        }

        // ==================================
        // NORMAL WALKING
        // ==================================

        if (
            npc.state === "walking"
        ) {

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

            // Random direction change
            if (
                Math.random() < 0.003
            ) {

                npc.direction =
                    Math.random() *
                    Math.PI *
                    2;
            }

            // ==================================
            // VISIT BUILDING
            // ==================================

            if (
                npc.targetBuilding
            ) {

                const bx =
                    npc.targetBuilding.x;

                const bz =
                    npc.targetBuilding.z;

                const dx =
                    bx -
                    npc.object.position.x;

                const dz =
                    bz -
                    npc.object.position.z;

                const distance =
                    Math.sqrt(
                        dx * dx +
                        dz * dz
                    );

                // Guide NPC toward building
                if (
                    distance < 25 &&
                    Math.random() < 0.01
                ) {

                    npc.direction =
                        Math.atan2(
                            dz,
                            dx
                        );
                }

                // Enter building area
                if (
                    distance < 3
                ) {

                    npc.state =
                        "inside";

                    npc.insideTimer =
                        500 +
                        Math.random() * 800;

                    npc.object.visible =
                        false;
                }
            }
        }

        // ==================================
        // KEEP NPCS INSIDE CITY
        // ==================================

        npc.object.position.x =
            THREE.MathUtils.clamp(
                npc.object.position.x,
                -245,
                245
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

    if (!currentVehicle) {
        return;
    }

    currentVehicle.update(keys);
}

// ======================================
// TRAFFIC ACCIDENT REACTIONS
// ======================================

function checkTrafficAccidents() {

    for (
        const vehicle of vehicles
    ) {

        // Only check a moving/occupied vehicle
        if (
            !vehicle.isOccupied ||
            Math.abs(vehicle.speed) < 0.01
        ) {

            continue;
        }

        for (
            const npc of npcs
        ) {

            if (
                npc.state === "inside"
            ) {

                continue;
            }

            const distance =
                vehicle.group.position.distanceTo(
                    npc.object.position
                );

            if (
                distance < 2.2
            ) {

                // Stop vehicle
                vehicle.speed = 0;

                // NPC reacts safely
                npc.state =
                    "reacting";

                npc.reactionTimer =
                    180;

                npc.direction +=
                    Math.PI;

                console.log(
                    `${npc.name} reacted to a traffic accident.`
                );
            }
        }
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
            currentVehicle.group.position.y + 5;

        camera.position.z =
            currentVehicle.group.position.z + 10;

        camera.lookAt(
            currentVehicle.group.position.x,
            currentVehicle.group.position.y + 1,
            currentVehicle.group.position.z
        );

        return;
    }

    camera.position.x =
        player.group.position.x;

    camera.position.y =
        player.group.position.y + 5;

    camera.position.z =
        player.group.position.z + 10;

    camera.lookAt(
        player.group.position.x,
        player.group.position.y + 1.5,
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

    // Logan
    if (
        !currentVehicle
    ) {

        player.update(keys);
    }

    // NPCs
    updateNPCs();

    // Vehicle
    updateVehicles();

    // Accident reactions
    checkTrafficAccidents();

    // Camera
    updateCamera();

    // Render
    renderer.render(
        scene,
        camera
    );
}

// ======================================
// START GAME
// ======================================

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
