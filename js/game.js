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

document.body.appendChild(renderer.domElement);

// ======================================
// LIGHTING
// ======================================

const sunlight = new THREE.DirectionalLight(
    0xffffff,
    4
);

sunlight.position.set(10, 20, 10);

scene.add(sunlight);

scene.add(
    new THREE.AmbientLight(
        0xffffff,
        1.5
    )
);

// ======================================
// CITY
// ======================================

createCity(scene);

// ======================================
// PLAYER
// ======================================

const player = new Player(scene);

// ======================================
// NPCs
// ======================================

const npcs = createNPCs(scene);

// ======================================
// VEHICLES
// ======================================

// Car
const car = new Vehicle(
    scene,
    "car",
    4,
    0
);

// Bike
const bike = new Vehicle(
    scene,
    "bike",
    8,
    0
);

// Jet
const jet = new Vehicle(
    scene,
    "jet",
    14,
    0
);

// All vehicles
const vehicles = [
    car,
    bike,
    jet
];

// Current vehicle
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
        // ENTER VEHICLE
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

            // Find nearest vehicle
            let nearestVehicle = null;
            let nearestDistance = Infinity;

            for (const vehicle of vehicles) {

                const distance =
                    player.group.position.distanceTo(
                        vehicle.group.position
                    );

                if (
                    distance < nearestDistance &&
                    distance < 6
                ) {

                    nearestDistance =
                        distance;

                    nearestVehicle =
                        vehicle;
                }
            }

            // Enter nearest vehicle
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
// NPC MOVEMENT
// ======================================

function updateNPCs() {

    for (const npc of npcs) {

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

        // Randomly change direction

        if (Math.random() < 0.002) {

            npc.direction =
                Math.random() *
                Math.PI *
                2;
        }

        // Keep NPCs inside city

        npc.object.position.x =
            THREE.MathUtils.clamp(
                npc.object.position.x,
                -140,
                140
            );

        npc.object.position.z =
            THREE.MathUtils.clamp(
                npc.object.position.z,
                -140,
                140
            );
    }
}

// ======================================
// VEHICLE UPDATE
// ======================================

function updateVehicles() {

    for (const vehicle of vehicles) {

        if (
            vehicle === currentVehicle
        ) {

            vehicle.update(keys);
        }
    }
}

// ======================================
// CAMERA
// ======================================

function updateCamera() {

    if (currentVehicle) {

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
    if (!currentVehicle) {

        player.update(keys);
    }

    // People
    updateNPCs();

    // Vehicles
    updateVehicles();

    // Camera
    updateCamera();

    // Draw everything
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
// WINDOW RESIZE
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
