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
    createRandomMission
} from "./missions.js";

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
        window.innerWidth / window.innerHeight,
        0.1,
        3000
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
    Math.min(window.devicePixelRatio, 2)
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
    300,
    400,
    200
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

// Extra ground safety
const emergencyGround =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            1700,
            1100
        ),
        new THREE.MeshStandardMaterial({
            color: 0x555555
        })
    );

emergencyGround.rotation.x =
    -Math.PI / 2;

emergencyGround.position.z =
    175;

emergencyGround.position.y =
    -0.03;

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
    typeof player.health !== "number"
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
// PEOPLE
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

for (
    const villain of villains
) {
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
// MISSION STATE
// ======================================

let currentMission = null;
let currentVillain = null;
let currentMissionHero = null;

let missionActive = false;
let missionComplete = false;

let backupHeroes = [];
let backupCallUsed = false;

// ======================================
// MONEY
// ======================================

let money = 0;

// ======================================
// CALL SYSTEM
// ======================================

let callActive = false;
let callTimer = 0;
let callMessage = "";

function callHero(
    hero,
    message
) {

    if (!hero) {
        return;
    }

    callActive = true;
    callTimer = 360;

    callMessage =
        `${hero.name}: ${message}`;

    updateCallUI();

    console.log(
        callMessage
    );
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
    }
}

// ======================================
// START MISSION
// ======================================

function startMission() {

    hideMissionCharacters();

    currentMission =
        createRandomMission();

    currentVillain = null;
    currentMissionHero = null;

    backupHeroes = [];
    backupCallUsed = false;

    missionActive = true;
    missionComplete = false;

    setupMissionCharacters();

    console.log(
        `MISSION ${currentMission.id}`
    );

    console.log(
        currentMission.title
    );

    console.log(
        currentMission.objective
    );

    console.log(
        `CITY: ${currentMission.city}`
    );

    console.log(
        `REWARD: $${currentMission.reward}`
    );

    callHero(
        skyblade,
        `${currentMission.title}. ${currentMission.objective}`
    );
}

// ======================================
// HIDE MISSION CHARACTERS
// ======================================

function hideMissionCharacters() {

    for (
        const villain of villains
    ) {
        villain.group.visible = false;
    }

    stormKnight.group.visible = false;
    nightflare.group.visible = false;
    titanNova.group.visible = false;
}

// ======================================
// FIND VILLAIN
// ======================================

function findVillain(name) {

    return villains.find(
        villain =>
            villain.name === name
    );
}

// ======================================
// FIND HERO
// ======================================

function findHero(name) {

    return heroes.find(
        hero =>
            hero.name === name
    );
}

// ======================================
// RESET HERO
// ======================================

function resetHero(hero) {

    if (!hero) {
        return;
    }

    hero.health =
        hero.maxHealth;

    hero.energy =
        hero.maxEnergy;

    hero.defeated = false;
    hero.injured = false;

    hero.group.rotation.set(
        0,
        0,
        0
    );

    hero.group.visible = true;
}

// ======================================
// RESET VILLAIN
// ======================================

function resetVillain(villain) {

    if (!villain) {
        return;
    }

    villain.health =
        villain.maxHealth;

    villain.energy =
        villain.maxEnergy;

    villain.defeated = false;
    villain.injured = false;
    villain.attackCooldown = 0;

    villain.group.rotation.set(
        0,
        0,
        0
    );

    villain.group.visible = true;
}

// ======================================
// SET UP MISSION CHARACTERS
// ======================================

function setupMissionCharacters() {

    if (
        currentMission.villain
    ) {

        currentVillain =
            findVillain(
                currentMission.villain
            );

        if (currentVillain) {

            resetVillain(
                currentVillain
            );

            currentVillain.group.position.set(
                player.group.position.x + 20,
                0,
                player.group.position.z
            );
        }
    }

    if (
        currentMission.hero
    ) {

        currentMissionHero =
            findHero(
                currentMission.hero
            );

        if (currentMissionHero) {

            resetHero(
                currentMissionHero
            );

            currentMissionHero.group.position.set(
                player.group.position.x - 8,
                0,
                player.group.position.z + 7
            );
        }
    }
}

// ======================================
// BACKUP HERO
// ======================================

function callBackupHero() {

    if (
        !missionActive ||
        backupCallUsed
    ) {
        return;
    }

    const available =
        heroes.filter(
            hero =>
                hero !== skyblade &&
                !hero.defeated &&
                !hero.group.visible
        );

    if (
        available.length === 0
    ) {

        callHero(
            skyblade,
            "There isn't another available hero nearby."
        );

        return;
    }

    const hero =
        available[
            Math.floor(
                Math.random() *
                available.length
            )
        ];

    resetHero(hero);

    hero.group.position.set(
        player.group.position.x - 10,
        0,
        player.group.position.z + 8
    );

    backupHeroes = [
        hero
    ];

    backupCallUsed = true;

    callHero(
        hero,
        "I'm on my way, Logan. I'll help you."
    );
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
// HERO VS VILLAIN BATTLE
// ======================================

function updateMissionHeroBattle() {

    if (
        !missionActive ||
        !currentMissionHero ||
        !currentVillain
    ) {
        return;
    }

    if (
        currentMissionHero.defeated ||
        currentVillain.defeated
    ) {
        return;
    }

    const distance =
        currentMissionHero.group.position.distanceTo(
            currentVillain.group.position
        );

    if (
        distance > 7
    ) {

        currentMissionHero.moveToward(
            currentVillain.group.position.x,
            currentVillain.group.position.z
        );

        return;
    }

    // Hero attacks villain
    attack(
        currentMissionHero,
        currentVillain,
        15
    );

    // Villain attacks hero
    if (
        currentVillain.attackCooldown <= 0
    ) {

        currentVillain.attack(
            currentMissionHero,
            currentVillain.damage
        );

        currentVillain.attackCooldown = 120;
    }
}

// ======================================
// HERO RESCUE MISSION
// ======================================

function updateHeroRescueMission() {

    if (
        !missionActive ||
        !currentMission ||
        currentMission.type !== "hero_rescue" ||
        !currentMissionHero
    ) {
        return;
    }

    const distance =
        player.group.position.distanceTo(
            currentMissionHero.group.position
        );

    if (
        currentMissionHero.defeated &&
        distance < 8
    ) {

        resetHero(
            currentMissionHero
        );

        callHero(
            currentMissionHero,
            "Thanks, Logan. I'm safe now."
        );
    }
}

// ======================================
// BACKUP HERO AI
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

        currentVillain.attackCooldown = 120;
    }
}

// ======================================
// MISSION COMPLETION
// ======================================

function completeMission() {

    if (
        !missionActive
    ) {
        return;
    }

    missionActive = false;
    missionComplete = true;

    if (
        currentMission &&
        typeof currentMission.reward === "number"
    ) {

        money +=
            currentMission.reward;
    }

    callHero(
        skyblade,
        currentMission
            ? `Mission complete. You earned $${currentMission.reward}.`
            : "Mission complete."
    );

    for (
        const hero of backupHeroes
    ) {

        hero.group.visible = false;
    }

    backupHeroes = [];

    console.log(
        `Money: $${money}`
    );
}

// ======================================
// MISSION UPDATE
// ======================================

function updateMission() {

    if (
        !missionActive ||
        !currentMission
    ) {
        return;
    }

    // Villain objective
    if (
        currentVillain &&
        currentVillain.defeated
    ) {

        completeMission();

        return;
    }

    // Hero rescue
    if (
        currentMission.type === "hero_rescue" &&
        currentMissionHero &&
        !currentMissionHero.defeated
    ) {

        const distance =
            player.group.position.distanceTo(
                currentMissionHero.group.position
            );

        if (
            distance < 8
        ) {

            completeMission();
        }
    }
}

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
                1195
            );

        npc.object.position.z =
            THREE.MathUtils.clamp(
                npc.object.position.z,
                -245,
                595
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
            npc.state === "working"
        ) {

            npc.workTimer--;

            if (
                npc.workTimer <= 0
            ) {

                npc.state = "walking";

                npc.object.visible = true;

                npc.direction =
                    Math.random() *
                    Math.PI *
                    2;

                npc.workTimer =
                    600 +
                    Math.random() *
                    900;
            }

            continue;
        }

        // Some people go to work
        if (
            npc.state === "walking" &&
            npc.workplace &&
            Math.random() < 0.0005
        ) {

            npc.state =
                "goingToWork";
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

            if (
                distance > 4
            ) {

                npc.direction =
                    Math.atan2(
                        dz,
                        dx
                    );

            } else {

                npc.state =
                    "working";

                npc.object.visible =
                    false;

                npc.workTimer =
                    600 +
                    Math.random() *
                    900;
            }
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

    // Skyblade stays away from Logan
    // during missions.
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

        callActive = false;
        callMessage = "";
    }

    updateCallUI();
}

// ======================================
// MISSION UI
// ======================================

function updateMissionUI() {

    const missionElement =
        document.getElementById(
            "mission"
        );

    if (
        !missionElement
    ) {
        return;
    }

    if (
        !currentMission
    ) {

        missionElement.textContent =
            "Mission: None";

        return;
    }

    missionElement.textContent =
        `Mission ${currentMission.id}: ${currentMission.title} | ${currentMission.city} | ${currentMission.objective} | Reward: $${currentMission.reward}`;
}

// ======================================
// IDENTITY UI
// ======================================

function updateIdentityUI() {

    const element =
        document.getElementById(
            "identity"
        );

    if (
        !element
    ) {
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

    const moneyElement =
        document.getElementById(
            "money"
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

        const villainName =
            currentVillain
                ? currentVillain.name
                : "No Villain";

        const villainHealth =
            currentVillain
                ? currentVillain.health
                : 0;

        villainHealthElement.textContent =
            `${villainName} Health: ${villainHealth}`;
    }

    if (
        moneyElement
    ) {

        moneyElement.textContent =
            `Money: $${money}`;
    }
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

const MAP_WORLD_MIN_X = -260;
const MAP_WORLD_MAX_X = 1190;

const MAP_WORLD_MIN_Z = -260;
const MAP_WORLD_MAX_Z = 590;

function mapX(worldX) {

    return (
        (worldX - MAP_WORLD_MIN_X) /
        (MAP_WORLD_MAX_X - MAP_WORLD_MIN_X)
    ) * MAP_WIDTH;
}

function mapY(worldZ) {

    return (
        (worldZ - MAP_WORLD_MIN_Z) /
        (MAP_WORLD_MAX_Z - MAP_WORLD_MIN_Z)
    ) * MAP_HEIGHT;
}

function mapPoint(
    worldX,
    worldZ,
    radius,
    color
) {

    if (
        !minimapContext
    ) {
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

    if (
        !minimapContext
    ) {
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

    // City areas

    minimapContext.fillStyle =
        "#455a64";

    minimapContext.fillRect(
        5,
        15,
        45,
        45
    );

    minimapContext.fillStyle =
        "#546e7a";

    minimapContext.fillRect(
        60,
        15,
        45,
        45
    );

    minimapContext.fillStyle =
        "#607d8b";

    minimapContext.fillRect(
        115,
        15,
        45,
        45
    );

    minimapContext.fillStyle =
        "#78909c";

    minimapContext.fillRect(
        170,
        15,
        45,
        45
    );

    minimapContext.fillStyle =
        "#52635b";

    minimapContext.fillRect(
        5,
        100,
        45,
        45
    );

    minimapContext.fillStyle =
        "#62576d";

    minimapContext.fillRect(
        60,
        100,
        45,
        45
    );

    minimapContext.fillStyle =
        "#6a6a4d";

    minimapContext.fillRect(
        115,
        100,
        45,
        45
    );

    // Labels

    minimapContext.font =
        "bold 8px Arial";

    minimapContext.fillStyle =
        "white";

    minimapContext.fillText(
        "BLINGZ",
        8,
        28
    );

    minimapContext.fillText(
        "CENTRAL",
        63,
        28
    );

    minimapContext.fillText(
        "METRO",
        119,
        28
    );

    minimapContext.fillText(
        "OCEAN",
        174,
        28
    );

    minimapContext.fillText(
        "LIBERTY",
        8,
        113
    );

    minimapContext.fillText(
        "NEON",
        63,
        113
    );

    minimapContext.fillText(
        "MOUNTAIN",
        118,
        113
    );

    // Logan

    mapPoint(
        player.group.position.x,
        player.group.position.z,
        6,
        "#00aaff"
    );

    // Base

    mapPoint(
        -60,
        -55,
        5,
        "#00ff66"
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
            hero === skyblade
        ) {
            color =
                "#6633ff";
        }

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

        mapPoint(
            hero.group.position.x,
            hero.group.position.z,
            4,
            color
        );
    }

    // Villain

    if (
        currentVillain &&
        currentVillain.group.visible &&
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

        // Vehicle enter / exit

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

                player.group.position.x += 3;

                currentVehicle = null;

                return;
            }

            let nearestVehicle = null;
            let nearestDistance = Infinity;

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

        // New endless mission

        if (
            key === "m"
        ) {

            startMission();
        }

        // Call backup

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
// GAME LOOP
// ======================================

function animate() {

    requestAnimationFrame(
        animate
    );

    if (
        !currentVehicle
    ) {

        player.update(keys);
    }

    updateBase();

    updateNPCJobs();

    updateNPCs();

    updateVehicles();

    updateSkyblade();

    updateMissionHeroBattle();

    updateHeroRescueMission();

    updateBackupHeroes();

    checkForBackupCall();

    updateCurrentVillain();

    updateMission();

    updateCallTimer();

    updateMissionUI();

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
