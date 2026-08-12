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

camera.position.set(0, 6, 12);

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

sunlight.position.set(
    20,
    30,
    20
);

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
// NPCS
// ======================================

const npcs = createNPCs(scene);

// ======================================
// VEHICLES
// ======================================

// Car: directly to Logan's right
const car = new Vehicle(
    scene,
    "car",
    4,
    0
);

// Bike: a little farther right
const bike = new Vehicle(
    scene,
    "bike",
    8,
    0
);

// Jet: directly in front of Logan
const jet = new Vehicle(
    scene,
    "jet",
    0,
    -10
);

// Force the jet into a clearly visible position
jet.group.position.set(
    0,
    6,
    -10
);

// Make sure all vehicles are visible
car.group.visible = true;
bike.group.visible = true;
jet.group.visible = true;

const vehicles = [
    car,
    bike,
    jet
];

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
        // ENTER / EXIT
        // ==================================

        if (key === "e") {

            // EXIT
            if (currentVehicle) {

                const vehicle =
                    currentVehicle;

                vehicle.exit();

                player.group.visible = true;

                // Put Logan next to the vehicle
                player.group.position.set(
                    vehicle.group.position.x + 3,
                    0,
                    vehicle.group.position.z
                );

                currentVehicle = null;

                console.log(
                    "Exited " + vehicle.type
                );

                return;
            }

            // FIND NEAREST VEHICLE
            let nearestVehicle = null;
            let nearestDistance = Infinity;

            for (const vehicle of vehicles) {

                const distance =
                    player.group.position.distanceTo(
                        new THREE.Vector3(
                            vehicle.group.position.x,
                            0,
                            vehicle.group.position.z
                        )
                    );

                if (
                    distance < nearestDistance &&
                    distance < 8
                ) {

                    nearestDistance =
                        distance;

                    nearestVehicle =
                        vehicle;
                }
            }

            // ENTER VEHICLE
            if (nearestVehicle) {

                currentVehicle =
                    nearestVehicle;

                currentVehicle.enter();

                player.group.visible = false;

                console.log(
                    "Entered " +
                    currentVehicle.type
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

        if (
            Math.random() < 0.002
        ) {

            npc.direction =
                Math.random() *
                Math.PI *
                2;
        }

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
// VEHICLES
// ======================================

function updateVehicles() {

    if (!currentVehicle) {
        return;
    }

    currentVehicle.update(keys);
}

// ======================================
// CAMERA
// ======================================

function updateCamera() {

    // Camera follows vehicle
    if (currentVehicle) {

        const vehicle =
            currentVehicle;

        camera.position.x =
            vehicle.group.position.x;

        camera.position.y =
            vehicle.group.position.y + 5;

        camera.position.z =
            vehicle.group.position.z + 12;

        camera.lookAt(
            vehicle.group.position.x,
            vehicle.group.position.y + 1,
            vehicle.group.position.z
        );

        return;
    }

    // Camera follows Logan
    camera.position.x =
        player.group.position.x;

    camera.position.y =
        player.group.position.y + 6;

    camera.position.z =
        player.group.position.z + 12;

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

    requestAnimationFrame(animate);

    // Logan
    if (!currentVehicle) {
        player.update(keys);
    }

    // NPCs
    updateNPCs();

    // Vehicle
    updateVehicles();

    // Camera
    updateCamera();

    // Render
    renderer.render(
        scene,
        camera
    );
}

// ======================================
// START
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
