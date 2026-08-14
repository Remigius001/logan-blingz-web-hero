import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { Player } from "./player.js";
import { createCity } from "./city.js";
import { createNPCs } from "./npcs.js";
import { Vehicle } from "./vehicles.js";
import { buildingList } from "./buildings.js";
import { Hero } from "./heroes.js";
import { Villain } from "./villains.js";
import {
    attack,
    recoverCharacter,
    isDefeated
} from "./combat.js";

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
        2000
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

renderer.shadowMap.enabled = true;

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

sunlight.castShadow = true;

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

const player =
    new Player(scene);

// ======================================
// NPCS
// ======================================

const npcs =
    createNPCs(scene);

// ======================================
// SECOND HERO
// ======================================

const skyblade =
    new Hero(
        scene,
        "Skyblade",
        8,
        4,
        0x3366ff
    );

// ======================================
// VILLAIN
// ======================================

const shadowKing =
    new Villain(
        scene,
        "Shadow King",
        18,
        0,
        0x5a1688
    );

// ======================================
// VEHICLES
// ======================================

const car =
    new Vehicle(
        scene,
        "car",
        5,
        0
    );

const bike =
    new Vehicle(
        scene,
        "bike",
        12,
        0
    );

const jet =
    new Vehicle(
        scene,
        "jet",
        20,
        0
    );

const vehicles = [
    car,
    bike,
    jet
];

let currentVehicle = null;

// ======================================
// MISSION
// ======================================

let missionActive = false;
let missionComplete = false;

function startHeroMission() {

    missionActive = true;
    missionComplete = false;

    shadowKing.group.visible = true;

    console.log(
        "Mission started: Stop Shadow King."
    );
}

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

            if (currentVehicle) {

                currentVehicle.exit();

                player.group.visible =
                    true;

                player.group.position.copy(
                    currentVehicle.group.position
                );

                player.group.position.x += 3;

                currentVehicle = null;

                return;
            }

            let nearestVehicle = null;

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

            if (nearestVehicle) {

                currentVehicle =
                    nearestVehicle;

                currentVehicle.enter();

                player.group.visible =
                    false;
            }
        }

        // ==================================
        // F = LOGAN ATTACK
        // ==================================

        if (key === "f") {

            const distance =
                player.group.position.distanceTo(
                    shadowKing.group.position
                );

            if (
                distance < 8 &&
                !isDefeated(shadowKing)
            ) {

                // Player currently uses the
                // same combat idea as the hero.
                shadowKing.takeDamage(20);

                console.log(
                    "Logan attacked Shadow King."
                );
            }
        }

        // ==================================
        // G = SKYBLADE ATTACKS
        // ==================================

        if (key === "g") {

            const distance =
                skyblade.group.position.distanceTo(
                    shadowKing.group.position
                );

            if (
                distance < 10 &&
                !isDefeated(shadowKing)
            ) {

                attack(
                    skyblade,
                    shadowKing,
                    25
                );
            }
        }

        // ==================================
        // H = VILLAIN ATTACKS LOGAN
        // ==================================

        if (key === "h") {

            const distance =
                shadowKing.group.position.distanceTo(
                    player.group.position
                );

            if (
                distance < 10
            ) {

                // Player fallback/player class
                // needs a health value.
                if (
                    typeof player.health !==
                    "number"
                ) {

                    player.health = 100;
                }

                player.health -= 15;

                if (
                    player.health < 0
                ) {

                    player.health = 0;
                }

                console.log(
                    "Logan took damage."
                );
            }
        }

        // ==================================
        // M = START MISSION
        // ==================================

        if (key === "m") {

            startHeroMission();
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
// NPC JOBS
// ======================================

function updateNPCJobs() {

    for (
        const npc of npcs
    ) {

        if (
            npc.state === "working"
        ) {

            npc.workTimer--;

            if (
                npc.workTimer <= 0
            ) {

                npc.state =
                    "goingToWork";

                npc.object.visible =
                    true;

                npc.workTimer =
                    600 +
                    Math.random() *
                    600;
            }

            continue;
        }

        if (
            npc.state === "goingToWork" &&
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
}

// ======================================
// NPC MOVEMENT
// ======================================

function updateNPCs() {

    for (
        const npc of npcs
    ) {

        if (
            npc.state === "working"
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

    if (currentVehicle) {

        currentVehicle.update(
            keys
        );
    }
}

// ======================================
// HERO
// ======================================

function updateHero() {

    skyblade.update();

    // Simple partner follow
    if (
        !skyblade.defeated
    ) {

        const targetX =
            player.group.position.x + 5;

        const targetZ =
            player.group.position.z + 3;

        skyblade.group.position.x +=
            (
                targetX -
                skyblade.group.position.x
            ) * 0.02;

        skyblade.group.position.z +=
            (
                targetZ -
                skyblade.group.position.z
            ) * 0.02;
    }
}

// ======================================
// VILLAIN AI
// ======================================

function updateVillain() {

    shadowKing.update();

    if (
        !missionActive ||
        shadowKing.defeated
    ) {

        return;
    }

    const distance =
        shadowKing.group.position.distanceTo(
            player.group.position
        );

    // Move toward Logan
    if (
        distance > 4
    ) {

        const dx =
            player.group.position.x -
            shadowKing.group.position.x;

        const dz =
            player.group.position.z -
            shadowKing.group.position.z;

        const length =
            Math.sqrt(
                dx * dx +
                dz * dz
            );

        if (length > 0) {

            shadowKing.group.position.x +=
                (dx / length) * 0.015;

            shadowKing.group.position.z +=
                (dz / length) * 0.015;
        }
    }

    // Villain attacks after cooldown
    if (
        distance < 5
    ) {

        if (
            shadowKing.attackCooldown <= 0
        ) {

            if (
                typeof player.health !==
                "number"
            ) {

                player.health = 100;
            }

            player.health -= 5;

            if (
                player.health < 0
            ) {

                player.health = 0;
            }

            shadowKing.attackCooldown =
                120;
        }
    }
}

// ======================================
// MISSION COMPLETION
// ======================================

function updateMission() {

    if (
        missionActive &&
        shadowKing.defeated &&
        !missionComplete
    ) {

        missionComplete = true;

        missionActive = false;

        console.log(
            "MISSION COMPLETE!"
        );
    }
}

// ======================================
// HEALTH UI
// ======================================

function updateHealthUI() {

    let healthDisplay =
        document.getElementById(
            "health"
        );

    let heroHealthDisplay =
        document.getElementById(
            "hero-health"
        );

    let villainHealthDisplay =
        document.getElementById(
            "villain-health"
        );

    if (healthDisplay) {

        const health =
            typeof player.health ===
            "number"
                ? player.health
                : 100;

        healthDisplay.textContent =
            `Logan Health: ${health}`;
    }

    if (heroHealthDisplay) {

        heroHealthDisplay.textContent =
            `Skyblade Health: ${skyblade.health}`;
    }

    if (villainHealthDisplay) {

        villainHealthDisplay.textContent =
            `Shadow King Health: ${shadowKing.health}`;
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

    updateHero();

    updateVillain();

    updateMission();

    updateHealthUI();

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
