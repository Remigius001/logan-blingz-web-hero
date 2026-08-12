import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

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

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.body.appendChild(renderer.domElement);

// ==============================
// LIGHT
// ==============================

const sunlight = new THREE.DirectionalLight(
    0xffffff,
    3
);

sunlight.position.set(10, 20, 10);

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
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({
        color: 0x444444
    })
);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);

// ==============================
// TEST PLAYER
// ==============================

const player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshStandardMaterial({
        color: 0x2255cc
    })
);

player.position.y = 1;

scene.add(player);

// ==============================
// CONTROLS
// ==============================

const keys = {};

window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

// ==============================
// GAME LOOP
// ==============================

function animate() {

    requestAnimationFrame(animate);

    const speed = 0.12;

    if (keys["w"]) {
        player.position.z -= speed;
    }

    if (keys["s"]) {
        player.position.z += speed;
    }

    if (keys["a"]) {
        player.position.x -= speed;
    }

    if (keys["d"]) {
        player.position.x += speed;
    }

    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 10;

    camera.lookAt(
        player.position.x,
        1,
        player.position.z
    );

    renderer.render(
        scene,
        camera
    );
}

// Start game

animate();

// ==============================
// WINDOW RESIZE
// ==============================

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});
