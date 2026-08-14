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

renderer.domElement.id =
    "gameCanvas";

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

// Extra ground
const emergencyGround =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            900,
            500
        ),
        new THREE.MeshStandardMaterial({
            color: 0x555555
        })
    );

emergencyGround.rotation.x =
    -Math.PI / 2;

emergencyGround.position.y =
    -0.02;

scene.add(
    emergencyGround
);

// ======================================
// BASE
// ======================================

const base =
    createBase(scene);

// ======================================
// PLAYER
// ======================================

const player =
    new Player(scene);

if (
    typeof player.health !==
    "number"
) {
    player.health = 100;
}

player.maxHealth = 100;

// ======================================
// IDENTITY
// ======================================

const identity =
    new IdentitySystem(player);

// ======================================
// NPCS
// ======================================

const npcs =
    createNPCs(scene);

// ======================================
// HEROES
// ======================================

const skyblade =
    new Hero(
        scene,
        "Skyblade",
        8,
        4,
        0x3366ff
    );

const stormKnight =
    new Hero(
        scene,
        "Storm Knight",
        -10,
        8,
        0x22aa88
    );

const nightflare =
    new Hero(
        scene,
        "Nightflare",
        12,
        -8,
        0x9b44ff
    );

const titanNova =
    new Hero(
        scene,
        "Titan Nova",
        -14,
        -8,
        0xffaa22
    );

const heroes = [
    skyblade,
    stormKnight,
    nightflare,
    titanNova
];

// Hide backup heroes until called
stormKnight.group.visible = false;
nightflare.group.visible = false;
titanNova.group.visible = false;

// ======================================
// VILLAINS
// ======================================

const shadowKing =
    new Villain(
        scene,
        "Shadow King",
        18,
        0,
        0x5a1688,
        120,
        0.03,
        15
    );

const ironFang =
    new Villain(
        scene,
        "Iron Fang",
        30,
        10,
        0x444444,
        150,
        0.025,
        18
    );

const voltViper =
    new Villain(
        scene,
        "Volt Viper",
        -20,
        15,
        0x22aa22,
        100,
        0.05,
        12
    );

const nightCrusher =
    new Villain(
        scene,
        "Night Crusher",
        25,
        -20,
        0x222222,
        180,
        0.02,
        22
    );

const frostWarden =
    new Villain(
        scene,
        "Frost Warden",
        -25,
        -15,
        0x4488cc,
        130,
        0.035,
        16
    );

const villains = [
    shadowKing,
    ironFang,
    voltViper,
    nightCrusher,
    frostWarden
];

// Hide all villains until their mission
for (const villain of villains) {
    villain.group.visible = false;
}

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
// MISSION SYSTEM
// ======================================

let missionActive = false;
let missionComplete = false;

let currentVillainIndex = 0;
let currentVillain = null;

// ======================================
// BACKUP HERO SYSTEM
// ======================================

let backupHeroes = [];
let backupCallUsed = false;

// ======================================
// CALL UI
// ======================================

let callActive = false;
let callTimer = 0;
let callMessage = "";

function callHero(hero, message) {

    callActive = true;

    callTimer = 360;

    callMessage =
        `${hero.name}: ${message}`;

    updateCallUI();

    console.log(callMessage);
}

function updateCallUI() {

    const callBox =
        document.getElementById(
            "skyblade-call"
        );

    const messageBox =
        document.getElementById(
            "skyblade-call-message"
        );

    const titleBox =
        document.getElementById(
            "skyblade-call-title"
        );

    if (
        !callBox ||
        !messageBox
    ) {
        return;
    }

    if (callActive) {

        callBox.style.display =
            "block";

        messageBox.textContent =
            callMessage;

        if (titleBox) {

            titleBox.textContent =
                "📞 Hero Calling";
        }

    } else {

        callBox.style.display =
            "none";

        messageBox.textContent =
            "";

        if (titleBox) {

            titleBox.textContent =
                "📞 Hero Calling";
        }
    }
}

// ======================================
// START MISSION
// ======================================

function startMission() {

    // Finish the previous mission first
    for (const villain of villains) {

        villain.group.visible = false;
    }

    // Choose next villain
    currentVillain =
        villains[currentVillainIndex];

    currentVillainIndex++;

    if (
        currentVillainIndex >=
        villains.length
    ) {

        currentVillainIndex = 0;
    }

    // Reset villain
    currentVillain.health =
        currentVillain.maxHealth;

    currentVillain.defeated =
        false;

    currentVillain.injured =
        false;

    currentVillain.attackCooldown =
        0;

    currentVillain.group.rotation.set(
        0,
        0,
        0
    );

    // Put villain near Logan
    currentVillain.group.position.set(
        player.group.position.x + 20,
        0,
        player.group.position.z
    );

    currentVillain.group.visible =
        true;

    // Mission state
    missionActive = true;
    missionComplete = false;

    // Reset backup
    backupHeroes = [];
    backupCallUsed = false;

    stormKnight.group.visible = false;
    nightflare.group.visible = false;
    titanNova.group.visible = false;

    // Skyblade calls Logan
    callHero(
        skyblade,
        `Logan, ${currentVillain.name} is causing trouble. I'm checking another part of the city. Stay alert.`
    );

    console.log(
        `Mission started against ${currentVillain.name}.`
    );
}

// ======================================
// CHOOSE BACKUP HERO
// ======================================

function chooseBackupHero() {

    const available =
        heroes.filter(
            hero =>
                hero !== skyblade &&
                !hero.defeated
        );

    if (
        available.length === 0
    ) {

        return null;
    }

    return available[
        Math.floor(
            Math.random() *
            available.length
        )
    ];
}

// ======================================
// CALL BACKUP
// ======================================

function callBackupHero() {

    if (
        !missionActive ||
        backupCallUsed
    ) {

        return;
    }

    const hero =
        chooseBackupHero();

    if (!hero) {

        callHero(
            skyblade,
            "There are no available heroes nearby. Keep going, Logan."
        );

        return;
    }

    backupCallUsed =
        true;

    backupHeroes = [
        hero
    ];

    hero.health =
        hero.maxHealth;

    hero.energy =
        hero.maxEnergy;

    hero.defeated =
        false;

    hero.injured =
        false;

    hero.group.rotation.set(
        0,
        0,
        0
    );

    hero.group.position.set(
        player.group.position.x - 10,
        0,
        player.group.position.z + 8
    );

    hero.group.visible =
        true;

    callHero(
        hero,
        "Logan, I'm on my way. I'll help you."
    );
}

// ======================================
// MINIMAP
// ======================================

const minimap =
    document.getElementById(
        "minimap"
    );

const minimapContext =
    minimap
        ? minimap.getContext("2d")
        : null;

const MAP_WIDTH = 220;
const MAP_HEIGHT = 220;

function mapX(worldX) {

    return (
        (worldX + 260) /
        520
    ) *
    MAP_WIDTH;
}

function mapY(worldZ) {

    return (
        (worldZ + 260) /
        520
    ) *
    MAP_HEIGHT;
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

    minimapContext.fillStyle =
        color;

    minimapContext.fill();
}

function updateMinimap() {

    if (!minimapContext) {
        return;
    }

    minimapContext.clearRect(
        0,
        0,
        MAP_WIDTH,
        MAP_HEIGHT
    );

    minimapContext.fillStyle =
        "#263238";

    minimapContext.fillRect(
        0,
        0,
        MAP_WIDTH,
        MAP_HEIGHT
    );

    // Cities

    minimapContext.fillStyle =
        "#455a64";

    minimapContext.fillRect(
        10,
        45,
        90,
        120
    );

    minimapContext.fillStyle =
        "#546e7a";

    minimapContext.fillRect(
        120,
        45,
        90,
        120
    );

    // Highway

    minimapContext.fillStyle =
        "#777777";

    minimapContext.fillRect(
        95,
        95,
        30,
        25
    );

    // Roads

    minimapContext.strokeStyle =
        "#9e9e9e";

    minimapContext.lineWidth =
        2;

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

    // Labels

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

    // Base

    mapPoint(
        -60,
        -55,
        5,
        "#00ff66"
    );

    // Logan

    mapPoint(
        player.group.position.x,
        player.group.position.z,
        6,
        "#00aaff"
    );

    // Heroes

    for (
        const hero of heroes
    ) {

        if (
            hero.defeated ||
            !hero.group.visible
        ) {

            continue;
        }

        let color =
            "#9c4dff";

        if (
            hero === stormKnight
        ) {
            color =
                "#22aa88";
        }

        if (
            hero === nightflare
        ) {
            color =
                "#cc44ff";
        }

        if (
            hero === titanNova
        ) {
            color =
                "#ffaa22";
        }

        if (
            hero === skyblade
        ) {
            color =
                "#6633ff";
        }

        mapPoint(
            hero.group.position.x,
            hero.group.position.z,
            4,
            color
        );
    }

    // Active villain

    if (
        missionActive &&
        currentVillain &&
        !currentVillain.defeated
    ) {

        mapPoint(
            currentVillain.group.position.x,
            currentVillain.group.position.z,
            5,
            "#ff3333"
        );
    }

    minimapContext.strokeStyle =
        "white";

    minimapContext.lineWidth =
        2;

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
    event => {

        const key =
            event.key.toLowerCase();

        keys[key] = true;

        // Identity
        if (
            key === "i"
        ) {

            identity.toggleIdentity();

            updateIdentityUI();
        }

        // Enter / exit vehicle
        if (
            key === "e"
        ) {

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

        // Start next villain mission
        if (
            key === "m"
        ) {

            startMission();
        }

        // Manual backup
        if (
            key === "h"
        ) {

            callBackupHero();
        }

        // Logan attack
        if (
            key === "f" &&
            currentVillain
        ) {

            const distance =
                player.group.position.distanceTo(
                    currentVillain.group.position
                );

            if (
                distance < 8 &&
                !isDefeated(
                    currentVillain
                )
            ) {

                currentVillain.takeDamage(
                    20
                );
            }
        }

        // Skyblade attack
        if (
            key === "g" &&
            currentVillain
        ) {

            const distance =
                skyblade.group.position.distanceTo(
                    currentVillain.group.position
                );

            if (
                distance < 10 &&
                !isDefeated(
                    currentVillain
                )
            ) {

                attack(
                    skyblade,
                    currentVillain,
                    25
                );
            }
        }
    }
);

window.addEventListener(
    "keyup",
    event => {

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

    if (
        distance < 8
    ) {

        identity.enterBase();

    } else {

        identity.leaveBase();
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

        const targetRotation =
            Math.atan2(
                Math.cos(
                    npc.direction
                ),
                Math.sin(
                    npc.direction
                )
            );

        npc.object.rotation.y =
            THREE.MathUtils.lerp(
                npc.object.rotation.y,
                targetRotation,
                0.12
            );

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
// NPC JOBS
// ======================================

function updateNPCJobs() {

    for (
        const npc of npcs
    ) {

        if (
            npc.state !== "working"
        ) {

            continue;
        }

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
// SKYBLADE
// ======================================

function updateSkyblade() {

    skyblade.update();

    if (
        skyblade.defeated
    ) {

        return;
    }

    // Skyblade stays away during missions
    if (
        missionActive
    ) {

        return;
    }

    skyblade.moveToward(
        player.group.position.x + 5,
        player.group.position.z + 3
    );
}

// ======================================
// BACKUP HEROES
// ======================================

function updateBackupHeroes() {

    for (
        const hero of backupHeroes
    ) {

        hero.update();

        if (
            hero.defeated
        ) {

            continue;
        }

        const distance =
            hero.group.position.distanceTo(
                player.group.position
            );

        if (
            distance > 7
        ) {

            hero.moveToward(
                player.group.position.x - 5,
                player.group.position.z + 4
            );
        }

        if (
            currentVillain &&
            !currentVillain.defeated
        ) {

            const enemyDistance =
                hero.group.position.distanceTo(
                    currentVillain.group.position
                );

            if (
                enemyDistance < 9
            ) {

                attack(
                    hero,
                    currentVillain,
                    15
                );
            }
        }
    }
}

// ======================================
// AUTOMATIC BACKUP
// ======================================

function checkForBackupCall() {

    if (
        !missionActive ||
        backupCallUsed
    ) {

        return;
    }

    if (
        player.health <= 35
    ) {

        callBackupHero();
    }
}

// ======================================
// CURRENT VILLAIN AI
// ======================================

function updateCurrentVillain() {

    if (
        !missionActive ||
        !currentVillain
    ) {

        return;
    }

    currentVillain.update();

    if (
        currentVillain.defeated
    ) {

        return;
    }

    currentVillain.moveToward({
        x:
            player.group.position.x,
        z:
            player.group.position.z
    });

    const distance =
        currentVillain.group.position.distanceTo(
            player.group.position
        );

    if (
        distance < 5 &&
        currentVillain.attackCooldown <= 0
    ) {

        currentVillain.attack(
            player,
            currentVillain.damage
        );

        currentVillain.attackCooldown =
            120;
    }
}

// ======================================
// MISSION COMPLETION
// ======================================

function updateMission() {

    if (
        missionActive &&
        currentVillain &&
        currentVillain.defeated &&
        !missionComplete
    ) {

        missionActive =
            false;

        missionComplete =
            true;

        callHero(
            skyblade,
            `Nice work, Logan. ${currentVillain.name} has been stopped.`
        );

        for (
            const hero of backupHeroes
        ) {

            hero.group.visible =
                false;
        }

        backupHeroes = [];
    }
}

// ======================================
// CALL TIMER
// ======================================

function updateCallTimer() {

    if (
        !callActive
    ) {

        return;
    }

    callTimer--;

    if (
        callTimer <= 0
    ) {

        callActive =
            false;

        callMessage =
            "";
    }

    updateCallUI();
}

// ======================================
// IDENTITY UI
// ======================================

function updateIdentityUI() {

    const element =
        document.getElementById(
            "identity"
        );

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
        document.getElementById(
            "health"
        );

    const heroHealthElement =
        document.getElementById(
            "hero-health"
        );

    const villainHealthElement =
        document.getElementById(
            "villain-health"
        );

    if (
        healthElement
    ) {

        healthElement.textContent =
            `Logan Health: ${player.health}`;
    }

    if (
        heroHealthElement
    ) {

        heroHealthElement.textContent =
            `Skyblade Health: ${skyblade.health}`;
    }

    if (
        villainHealthElement
    ) {

        const name =
            currentVillain
                ? currentVillain.name
                : "No Villain";

        const health =
            currentVillain
                ? currentVillain.health
                : 0;

        villainHealthElement.textContent =
            `${name} Health: ${health}`;
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

    updateBase();

    updateNPCJobs();

    updateNPCs();

    updateVehicles();

    updateSkyblade();

    updateBackupHeroes();

    checkForBackupCall();

    updateCurrentVillain();

    updateMission();

    updateCallTimer();

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
