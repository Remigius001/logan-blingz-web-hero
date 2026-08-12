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

sunlight.position.set(20, 30, 20);

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

const car = new Vehicle(
    scene,
    "car",
    4,
    0
);

const bike = new Vehicle(
    scene,
    "bike",
    8,
    0
);

const jet = new Vehicle(
    scene,
    "jet",
    0,
    -10
);

// Jet is visible above the city
jet.group.position.set(
    0,
    6,
    -10
);

const vehicles = [
    car,
    bike,
    jet
];

// ======================================
// JET ENTRY POINT
// ======================================

// This invisible point is where Logan
// can stand to enter the jet.
const jetEntryPoint =
    new THREE.Vector3(
        0,
        0,
        -7
    );

// Visible landing/entry pad
const jetPad = new THREE.Mesh(
    new THREE.CylinderGeometry(
        2.5,
        2.5,
        0.15,
        32
    ),
    new THREE.MeshStandardMaterial({
        color: 0x333333
    })
);

jetPad.position.set(
    0,
    0.1,
    -7
);

scene.add(jetPad);

// ======================================
// CURRENT VEHICLE
// ======================================

let currentVehicle = null;

// ======================================
// CONTROLS
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

            // ------------------------------
            // EXIT VEHICLE
            // ------------------------------

            if (currentVehicle) {

                const vehicle =
                    currentVehicle;

                vehicle.exit();

                player.group.visible =
                    true;

                if (vehicle.type === "jet") {

                    player.group.position.set(
                        jetEntryPoint.x + 3,
                        0,
                        jetEntryPoint.z
                    );

                } else {

                    player.group.position.set(
                        vehicle.group.position.x + 3,
                        0,
                        vehicle.group.position.z
                    );
                }

                currentVehicle = null;

                console.log(
                    "Logan exited the " +
                    vehicle.type
                );

                return;
            }

            // ------------------------------
            // FIND ENTERABLE VEHICLE
            // ------------------------------

            let nearestVehicle = null;
            let nearestDistance = Infinity;

            for (
                const vehicle of vehicles
            ) {

                let targetPosition;

                if (
                    vehicle.type === "jet"
                ) {

                    // Logan enters the jet
                    // through the ground pad.
                    targetPosition =
                        jetEntryPoint;

                } else {

                    targetPosition =
                        new THREE.Vector3(
                            vehicle.group.position.x,
                            0,
                            vehicle.group.position.z
                        );
                }

                const distance =
                    player.group.position.distanceTo(
                        targetPosition
                    );

                if (
                    distance < nearestDistance &&
                    distance < 5
                ) {

                    nearestDistance =
                        distance;

                    nearestVehicle =
                        vehicle;
                }
            }

            // ------------------------------
            // ENTER VEHICLE
            // ------------------------------

            if (nearestVehicle) {

                currentVehicle =
                    nearestVehicle;

                currentVehicle.enter();

                player.group.visible =
                    false;

                console.log(
                    "Logan entered the " +
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

    for (
        const npc of npcs
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
// VEHICLE UPDATE
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

    requestAnimationFrame(
        animate
    );

    if (!currentVehicle) {

        player.update(keys);
    }

    updateNPCs();

    updateVehicles();

    updateCamera();

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
