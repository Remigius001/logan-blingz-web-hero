import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// ===============================
// WORLD
// ===============================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);


// ===============================
// CAMERA
// ===============================

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 5, 10);


// ===============================
// RENDERER
// ===============================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.body.appendChild(renderer.domElement);


// ===============================
// LIGHT
// ===============================

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


// ===============================
// CITY GROUND
// ===============================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({
        color: 0x444444
    })
);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);


// ===============================
// LOGAN
// ===============================

const logan = new THREE.Group();


// Body

const body = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.5, 0.6),
    new THREE.MeshStandardMaterial({
        color: 0x2255cc
    })
);

body.position.y = 2;

logan.add(body);


// Head

const head = new THREE.Mesh(
    new THREE.SphereGeometry(
        0.45,
        24,
        24
    ),
    new THREE.MeshStandardMaterial({
        color: 0xffc79c
    })
);

head.position.y = 3.1;

logan.add(head);


// Legs

const leg1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 1, 0.35),
    new THREE.MeshStandardMaterial({
        color: 0x222222
    })
);

leg1.position.set(
    -0.25,
    0.75,
    0
);

logan.add(leg1);


const leg2 = leg1.clone();

leg2.position.x = 0.25;

logan.add(leg2);


// Put Logan into the world

scene.add(logan);


// ===============================
// CONTROLS
// ===============================

const keys = {};

window.addEventListener(
    "keydown",
    (event) => {

        keys[event.key.toLowerCase()] = true;

    }
);

window.addEventListener(
    "keyup",
    (event) => {

        keys[event.key.toLowerCase()] = false;

    }
);


// ===============================
// GAME LOOP
// ===============================

function animate() {

    requestAnimationFrame(animate);


    const speed = 0.12;


    if (keys["w"]) {
        logan.position.z -= speed;
    }

    if (keys["s"]) {
        logan.position.z += speed;
    }

    if (keys["a"]) {
        logan.position.x -= speed;
    }

    if (keys["d"]) {
        logan.position.x += speed;
    }


    // Camera follows Logan

    camera.position.x =
        logan.position.x;

    camera.position.z =
        logan.position.z + 10;


    camera.lookAt(
        logan.position.x,
        1.5,
        logan.position.z
    );


    renderer.render(
        scene,
        camera
    );
}


animate();


// ===============================
// RESIZE
// ===============================

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
