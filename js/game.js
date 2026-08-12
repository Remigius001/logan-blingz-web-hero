import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// ======================================================
// GAME SETUP
// ======================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x10182b);

scene.fog = new THREE.Fog(
    0x10182b,
    40,
    180
);


// ======================================================
// CAMERA
// ======================================================

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 6, 10);


// ======================================================
// RENDERER
// ======================================================

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


// ======================================================
// LIGHTING
// ======================================================

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1.2
    );

scene.add(ambientLight);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        2
    );

sun.position.set(
    50,
    100,
    30
);

scene.add(sun);


// ======================================================
// GROUND
// ======================================================

const groundGeometry =
    new THREE.PlaneGeometry(
        500,
        500
    );

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x20242c
    });

const ground =
    new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );

ground.rotation.x =
    -Math.PI / 2;

scene.add(ground);


// ======================================================
// CITY
// ======================================================

function createBuilding(
    x,
    z,
    width,
    height,
    depth
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            depth
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: new THREE.Color(
                0.08 + Math.random() * 0.1,
                0.08 + Math.random() * 0.1,
                0.15 + Math.random() * 0.15
            )
        });

    const building =
        new THREE.Mesh(
            geometry,
            material
        );

    building.position.set(
        x,
        height / 2,
        z
    );

    scene.add(building);

    return building;
}


for (
    let x = -100;
    x <= 100;
    x += 15
) {

    for (
        let z = -100;
        z <= 100;
        z += 15
    ) {

        if (
            Math.abs(x) < 10 &&
            Math.abs(z) < 10
        ) {
            continue;
        }

        const height =
            8 + Math.random() * 35;

        createBuilding(
            x,
            z,
            10,
            height,
            10
        );
    }
}


// ======================================================
// PLAYER
// ======================================================

const player =
    new THREE.Group();

scene.add(player);


// Body
const body =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            1,
            1.5,
            0.6
        ),
        new THREE.MeshStandardMaterial({
            color: 0xc62828
        })
    );

body.position.y = 1.2;

player.add(body);


// Head
const head =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.42,
            24,
            24
        ),
        new THREE.MeshStandardMaterial({
            color: 0xf1c7a5
        })
    );

head.position.y = 2.2;

player.add(head);


// ======================================================
// PLAYER PHYSICS
// ======================================================

const velocity =
    new THREE.Vector3();

const playerSpeed = 0.18;

const gravity = 0.025;

let onGround = false;

let swinging = false;


// ======================================================
// KEYBOARD
// ======================================================

const keys = {};

window.addEventListener(
    "keydown",
    event => {

        keys[event.key.toLowerCase()] = true;

        if (
            event.code === "Space" &&
            onGround
        ) {

            velocity.y = 0.55;

            onGround = false;
        }

        if (
            event.key.toLowerCase() === "e"
        ) {

            startSwing();
        }
    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[event.key.toLowerCase()] =
            false;

        if (
            event.key.toLowerCase() === "e"
        ) {

            stopSwing();
        }
    }
);


// ======================================================
// WEB
// ======================================================

let webLine = null;

let webTarget = null;


function findWebTarget() {

    const direction =
        new THREE.Vector3(
            0,
            1,
            -1
        );

    direction.applyQuaternion(
        camera.quaternion
    );

    const origin =
        player.position.clone();

    const raycaster =
        new THREE.Raycaster(
            origin,
            direction.normalize(),
            0,
            100
        );

    const objects =
        scene.children.filter(
            object =>
                object.isMesh &&
                object !== ground &&
                object.parent !== player
        );

    const hits =
        raycaster.intersectObjects(
            objects,
            true
        );

    if (hits.length > 0) {
        return hits[0].point;
    }

    return null;
}


function startSwing() {

    if (swinging) return;

    const target =
        findWebTarget();

    if (!target) return;

    webTarget =
        target;

    swinging = true;

    webLine =
        new THREE.Line(
            new THREE.BufferGeometry(),
            new THREE.LineBasicMaterial({
                color: 0xffffff
            })
        );

    scene.add(webLine);
}


function stopSwing() {

    swinging = false;

    webTarget = null;

    if (webLine) {

        scene.remove(webLine);

        webLine.geometry.dispose();

        webLine.material.dispose();

        webLine = null;
    }
}


// ======================================================
// WEB SWING PHYSICS
// ======================================================

function updateSwing() {

    if (
        !swinging ||
        !webTarget
    ) {
        return;
    }

    const direction =
        new THREE.Vector3()
            .subVectors(
                webTarget,
                player.position
            );

    const distance =
        direction.length();

    direction.normalize();

    velocity.addScaledVector(
        direction,
        0.035
    );

    velocity.multiplyScalar(
        0.995
    );

    if (distance > 18) {

        velocity.addScaledVector(
            direction,
            0.04
        );
    }

    if (webLine) {

        const points = [
            player.position.clone()
                .add(
                    new THREE.Vector3(
                        0,
                        1.5,
                        0
                    )
                ),

            webTarget
        ];

        webLine.geometry.setFromPoints(
            points
        );
    }
}


// ======================================================
// MOVEMENT
// ======================================================

function updatePlayer() {

    const speed =
        keys["shift"]
            ? playerSpeed * 2
            : playerSpeed;

    const direction =
        new THREE.Vector3();

    if (keys["w"]) {
        direction.z -= 1;
    }

    if (keys["s"]) {
        direction.z += 1;
    }

    if (keys["a"]) {
        direction.x -= 1;
    }

    if (keys["d"]) {
        direction.x += 1;
    }

    if (direction.length() > 0) {

        direction.normalize();

        player.position.x +=
            direction.x * speed;

        player.position.z +=
            direction.z * speed;

        player.rotation.y =
            Math.atan2(
                direction.x,
                direction.z
            );
    }


    // Gravity
    velocity.y -= gravity;


    if (swinging) {
        updateSwing();
    }


    player.position.add(
        velocity
    );


    // Ground
    if (
        player.position.y <= 0
    ) {

        player.position.y = 0;

        velocity.y = 0;

        onGround = true;
    }
}


// ======================================================
// THIRD-PERSON CAMERA
// ======================================================

function updateCamera() {

    const desiredPosition =
        new THREE.Vector3(
            player.position.x,
            player.position.y + 5,
            player.position.z + 10
        );

    camera.position.lerp(
        desiredPosition,
        0.08
    );

    camera.lookAt(
        player.position.x,
        player.position.y + 1,
        player.position.z
    );
}


// ======================================================
// RESIZE
// ======================================================

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


// ======================================================
// GAME LOOP
// ======================================================

function gameLoop() {

    requestAnimationFrame(
        gameLoop
    );

    updatePlayer();

    updateCamera();

    renderer.render(
        scene,
        camera
    );
}


gameLoop();
