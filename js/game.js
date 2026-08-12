import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { Player } from "./player.js";
import { createCity } from "./city.js";
import { createNPCs } from "./npcs.js";
import { Vehicle } from "./vehicles.js";

// ======================================
// SCENE
// ======================================

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x87ceeb);

// ======================================
// CAMERA
// ======================================

const camera =
    new THREE.PerspectiveCamera(
        70,
        window.innerWidth /
        window.innerHeight,
        0.1,
        1000
    );

camera.position.set(
    0,
    5,
    10
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
        3
    );

sunlight.position.set(
    10,
    20,
    10
);

scene.add(sunlight);

scene.add(
    new THREE.AmbientLight(
        0xffffff,
        1
    )
);

// ======================================
// CITY
// ======================================

createCity(scene);

// ======================================
// PLAYER
// ======================================

const player =
    new Player(scene);

// ======================================
// NPCS
// ======================================

const npcs =
    createNPCs(scene);

// ======================================
// VEHICLE
// ======================================

const car =
    new Vehicle(
        scene,
        8,
        0
    );

// ======================================
// KEYBOARD
// ======================================

const keys = {};

window.addEventListener(
    "keydown",
    (event) => {

        keys[
            event.key.toLowerCase()
        ] = true;

        // E = enter / exit car

        if (
            event.key.toLowerCase()
            === "e"
        ) {

            const distance =
                player.group.position
                    .distanceTo(
                        car.group.position
                    );

            if (
                distance < 5 &&
                !car.isOccupied
            ) {

                car.enter();

                player.group.visible =
                    false;

                console.log(
                    "Logan entered the car"
                );

            } else if (
                car.isOccupied
            ) {

                car.exit();

                player.group.visible =
                    true;

                player.group.position.copy(
                    car.group.position
                );

                player.group.position.x +=
                    2;

                console.log(
                    "Logan exited the car"
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
    }
}

// ======================================
// GAME LOOP
// ======================================

function animate() {

    requestAnimationFrame(
        animate
    );

    if (!car.isOccupied) {

        player.update(keys);

    }

    updateNPCs();

    car.update(keys);

    // ==================================
    // CAMERA
    // ==================================

    if (car.isOccupied) {

        camera.position.x =
            car.group.position.x;

        camera.position.y =
            car.group.position.y + 5;

        camera.position.z =
            car.group.position.z + 10;

        camera.lookAt(
            car.group.position
        );

    } else {

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
