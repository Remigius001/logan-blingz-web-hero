import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { Player } from "./player.js";
import { createCity } from "./city.js";
import { createNPCs } from "./npcs.js";
import { Vehicle } from "./vehicles.js";
import { Hero } from "./heroes.js";
import { Villain } from "./villains.js";
import { IdentitySystem } from "./identity.js";
import { createBase } from "./base.js";
import {
    attack,
    isDefeated
} from "./combat.js";

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
    2000
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

renderer.shadowMap.enabled = true;

renderer.domElement.id = "gameCanvas";

document.body.appendChild(
    renderer.domElement
);

// ======================================
// LIGHTING
// ======================================

const sunlight = new THREE.DirectionalLight(
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

// Guaranteed ground
const emergencyGround = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshStandardMaterial({
        color: 0x555555
    })
);

emergencyGround.rotation.x = -Math.PI / 2;
emergencyGround.position.y = -0.02;

scene.add(emergencyGround);

// ======================================
// BASE
// ======================================

const base = createBase(scene);

// ======================================
// PLAYER
// ======================================

const player = new Player(scene);

if (typeof player.health !== "number") {
    player.health = 100;
}

player.maxHealth = 100;

// ======================================
// IDENTITY
// ======================================

const identity = new IdentitySystem(player);

// ======================================
// NPCS
// ======================================

const npcs = createNPCs(scene);

// ======================================
// HERO
// ======================================

const skyblade = new Hero(
    scene,
    "Skyblade",
    8,
    4,
    0x3366ff
);

// ======================================
// VILLAIN
// ======================================

const shadowKing = new Villain(
    scene,
    "Shadow King",
    18,
    0,
    0x5a1688
);

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
    12,
    0
);

const jet = new Vehicle(
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

// ======================================
// MINIMAP
// ======================================

const minimap =
    document.getElementById("minimap");

const minimapContext =
    minimap
        ? minimap.getContext("2d")
        : null;

const MAP_WIDTH = 220;
const MAP_HEIGHT = 220;

function mapX(worldX) {

    return (
        (worldX + 260) / 520
    ) * MAP_WIDTH;
}

function mapY(worldZ) {

    return (
        (worldZ + 260) / 520
    ) * MAP_HEIGHT;
}

function mapPoint(
    worldX,
    worldZ,
    radius,
    color
) {

    if (!minimapContext) {
        return;
    }

    minimapContext.beginPath();

    minimapContext.arc(
        mapX(worldX),
        mapY(worldZ),
        radius,
        0,
        Math.PI * 2
    );

    minimapContext.fillStyle = color;

    minimapContext.fill();
}

function updateMinimap() {

    if (!minimapContext) {
        return;
    }

    // Clear
    minimapContext.clearRect(
        0,
        0,
        MAP_WIDTH,
        MAP_HEIGHT
    );

    // Background
    minimapContext.fillStyle =
        "#263238";

    minimapContext.fillRect(
        0,
        0,
        MAP_WIDTH,
        MAP_HEIGHT
    );

    // ==================================
    // BLINGZ CITY
    // ==================================

    minimapContext.fillStyle =
        "#455a64";

    minimapContext.fillRect(
        10,
        45,
        90,
        120
    );

    // ==================================
    // CENTRAL CITY
    // ==================================

    minimapContext.fillStyle =
        "#546e7a";

    minimapContext.fillRect(
        120,
        45,
        90,
        120
    );

    // ==================================
    // HIGHWAY
    // ==================================

    minimapContext.fillStyle =
        "#777777";

    minimapContext.fillRect(
        95,
        95,
        30,
        25
    );

    // ==================================
    // ROAD GRID
    // ==================================

    minimapContext.strokeStyle =
        "#9e9e9e";

    minimapContext.lineWidth = 2;

    for (
        let x = 25;
        x <= 85;
        x += 30
    ) {

        minimapContext.beginPath();

        minimapContext.moveTo(
            x,
            45
        );

        minimapContext.lineTo(
            x,
            165
        );

        minimapContext.stroke();
    }

    for (
        let x = 135;
        x <= 195;
        x += 30
    ) {

        minimapContext.beginPath();

        minimapContext.moveTo(
            x,
            45
        );

        minimapContext.lineTo(
            x,
            165
        );

        minimapContext.stroke();
    }

    for (
        let y = 75;
        y <= 150;
        y += 25
    ) {

        minimapContext.beginPath();

        minimapContext.moveTo(
            10,
            y
        );

        minimapContext.lineTo(
            100,
            y
        );

        minimapContext.stroke();

        minimapContext.beginPath();

        minimapContext.moveTo(
            120,
            y
        );

        minimapContext.lineTo(
            210,
            y
        );

        minimapContext.stroke();
    }

    // ==================================
    // CITY LABELS
    // ==================================

    minimapContext.font =
        "bold 11px Arial";

    minimapContext.fillStyle =
        "white";

    minimapContext.fillText(
        "BLINGZ CITY",
        14,
        35
    );

    minimapContext.fillText(
        "CENTRAL CITY",
        125,
        35
    );

    // ==================================
    // BASE
    // ==================================

    mapPoint(
        -60,
        -55,
        5,
        "#00ff66"
    );

    // ==================================
    // LOGAN
    // ==================================

    mapPoint(
        player.group.position.x,
        player.group.position.z,
        6,
        "#00aaff"
    );

    // ==================================
    // SKYBLADE
    // ==================================

    if (
        skyblade &&
        !skyblade.defeated
    ) {

        mapPoint(
            skyblade.group.position.x,
            skyblade.group.position.z,
            4,
            "#9c4dff"
        );
    }

    // ==================================
    // SHADOW KING
    // ==================================

    if (
        shadowKing &&
        missionActive &&
        !shadowKing.defeated
    ) {

        mapPoint(
            shadowKing.group.position.x,
            shadowKing.group.position.z,
            5,
            "#ff3333"
        );
    }

    // ==================================
    // BORDER
    // ==================================

    minimapContext.strokeStyle =
        "#ffffff";

    minimapContext.lineWidth = 2;

    minimapContext.strokeRect(
        1,
        1,
        MAP_WIDTH - 2,
        MAP_HEIGHT - 2
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
        // IDENTITY
        // ==================================

        if (key === "i") {

            identity.toggleIdentity();

            updateIdentityUI();
        }

        // ==================================
        // VEHICLE ENTER / EXIT
        // ==================================

        if (key === "e") {

            if (currentVehicle) {

                currentVehicle.exit();

                player.group.visible = true;

                player.group.position.copy(
                    currentVehicle.group.position
                );

                player.group.position.x += 3;

                currentVehicle = null;

                return;
            }

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

            if (nearestVehicle) {

                currentVehicle =
                    nearestVehicle;

                currentVehicle.enter();

                player.group.visible = false;
            }
        }

        // ==================================
        // START MISSION
        // ==================================

        if (key === "m") {

            missionActive = true;
            missionComplete = false;

            shadowKing.defeated = false;
            shadowKing.health =
                shadowKing.maxHealth;

            shadowKing.group.visible = true;

            console.log(
                "Mission started: Stop Shadow King."
            );
        }

        // ==================================
        // LOGAN ATTACK
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

                shadowKing.takeDamage(20);
            }
        }

        // ==================================
        // SKYBLADE ATTACK
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
// BASE
// ======================================

function updateBase() {

    if (
        !base ||
        !base.suitPosition
    ) {
        return;
    }

    const distance =
        player.group.position.distanceTo(
            base.suitPosition
        );

    if (distance < 8) {

        identity.enterBase();

    } else {

        identity.leaveBase();
    }
}

// ======================================
// NPC MOVEMENT
// ======================================

function updateNPCs() {

    for (const npc of npcs) {

        if (npc.state === "working") {
            continue;
        }

        npc.object.position.x +=
            Math.cos(
                npc.direction
            ) * npc.speed;

        npc.object.position.z +=
            Math.sin(
                npc.direction
            ) * npc.speed;

        if (Math.random() < 0.003) {

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
// NPC JOBS
// ======================================

function updateNPCJobs() {

    for (const npc of npcs) {

        if (npc.state !== "working") {
            continue;
        }

        npc.workTimer--;

        if (npc.workTimer <= 0) {

            npc.state = "goingToWork";
            npc.object.visible = true;

            npc.workTimer =
                600 +
                Math.random() * 600;
        }
    }
}

// ======================================
// VEHICLES
// ======================================

function updateVehicles() {

    if (currentVehicle) {

        currentVehicle.update(keys);
    }
}

// ======================================
// SKYBLADE
// ======================================

function updateSkyblade() {

    skyblade.update();

    if (skyblade.defeated) {
        return;
    }

    const targetX =
        player.group.position.x + 5;

    const targetZ =
        player.group.position.z + 3;

    skyblade.group.position.x +=
        (targetX -
            skyblade.group.position.x) * 0.02;

    skyblade.group.position.z +=
        (targetZ -
            skyblade.group.position.z) * 0.02;
}

// ======================================
// SHADOW KING
// ======================================

function updateShadowKing() {

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

    if (distance > 4) {

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

    if (
        distance < 5 &&
        shadowKing.attackCooldown <= 0
    ) {

        player.health -= 5;

        if (player.health < 0) {
            player.health = 0;
        }

        shadowKing.attackCooldown = 120;
    }
}

// ======================================
// MISSION
// ======================================

function updateMission() {

    if (
        missionActive &&
        shadowKing.defeated &&
        !missionComplete
    ) {

        missionActive = false;
        missionComplete = true;

        console.log(
            "MISSION COMPLETE!"
        );
    }
}

// ======================================
// IDENTITY UI
// ======================================

function updateIdentityUI() {

    const element =
        document.getElementById("identity");

    if (!element) {
        return;
    }

    const current =
        identity.getCurrentIdentity();

    element.textContent =
        `Identity: ${current.name} (${current.role})`;
}

// ======================================
// HEALTH UI
// ======================================

function updateHealthUI() {

    const healthElement =
        document.getElementById("health");

    const heroHealthElement =
        document.getElementById("hero-health");

    const villainHealthElement =
        document.getElementById("villain-health");

    if (healthElement) {

        healthElement.textContent =
            `Logan Health: ${player.health}`;
    }

    if (heroHealthElement) {

        heroHealthElement.textContent =
            `Skyblade Health: ${skyblade.health}`;
    }

    if (villainHealthElement) {

        villainHealthElement.textContent =
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
            currentVehicle.group.position.y + 6;

        camera.position.z =
            currentVehicle.group.position.z + 12;

        camera.lookAt(
            currentVehicle.group.position
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

    requestAnimationFrame(animate);

    if (!currentVehicle) {

        player.update(keys);
    }

    updateBase();
    updateNPCJobs();
    updateNPCs();
    updateVehicles();
    updateSkyblade();
    updateShadowKing();
    updateMission();
    updateIdentityUI();
    updateHealthUI();
    updateCamera();
    updateMinimap();

    renderer.render(
        scene,
        camera
    );
}

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
