import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { Player } from "./player.js";

// ======================================
// SCENE
// ======================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(
    0x87ceeb
);

// ======================================
// CAMERA
// ======================================

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
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

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1
    );

scene.add(ambientLight);

// ======================================
// GROUND
// ======================================

const ground =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            200,
            200
        ),

        new THREE.MeshStandardMaterial({
            color: 0x444444
        })
    );

ground.rotation.x =
    -Math.PI / 2;

scene.add(ground);

// ======================================
// PLAYER
// ======================================

const player =
    new Player(scene);

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
// GAME LOOP
// ======================================

function animate() {

    requestAnimationFrame(
        animate
    );

    // Update player

    player.update(
        keys
    );

    // ==================================
    // THIRD-PERSON CAMERA
    // ==================================

    const playerX =
        player.group.position.x;

    const playerY =
        player.group.position.y;

    const playerZ =
        player.group.position.z;

    camera.position.x =
        playerX;

    camera.position.y =
        playerY + 5;

    camera.position.z =
        playerZ + 10;

    camera.lookAt(
        playerX,
        playerY + 1.5,
        playerZ
    );

    // ==================================
    // RENDER
    // ==================================

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
