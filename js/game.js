import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { Player } from "./player.js";

// ==============================
// GAME SETUP
// ==============================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 5, 10);

// ==============================
// RENDERER
// ==============================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.body.appendChild(renderer.domElement);

// ==============================
// LIGHTING
// ==============================

const sunlight = new THREE.DirectionalLight(
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

// ==============================
// GROUND
// ==============================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(
        200,
        200
    ),
    new THREE.MeshStandardMaterial({
        color: 0x444444
    })
);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);

// ==============================
// PLAYER
// ==============================

const player = new Player(scene);

// ==============================
// KEYBOARD
// ==============================

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

// ==============================
// GAME LOOP
// ==============================

function animate() {

    requestAnimationFrame(
        animate
    );

    // Update Logan

    player.update(
        keys
    );

    // Camera follows Logan

    camera.position.x =
        player.group.position.x;

    camera.position.z =
        player.group.position.z + 10;

    camera.lookAt(
        player.group.position.x,
        1.5,
        player.group.position.z
    );

    // Render

    renderer.render(
        scene,
        camera
    );
}

animate();

// ==============================
// WINDOW RESIZE
// ==============================

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
