import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x10182b);

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


// LIGHT

const sunlight = new THREE.DirectionalLight(
    0xffffff,
    2
);

sunlight.position.set(20, 30, 20);

scene.add(sunlight);

scene.add(
    new THREE.AmbientLight(
        0xffffff,
        0.6
    )
);


// GROUND

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),

    new THREE.MeshStandardMaterial({
        color: 0x333333
    })
);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);


// PLAYER

const player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),

    new THREE.MeshStandardMaterial({
        color: 0x2878ff
    })
);

player.position.y = 1;

scene.add(player);


// KEYBOARD

const keys = {};

window.addEventListener(
    "keydown",
    (event) => {

        keys[event.key.toLowerCase()] = true;

        if (event.code === "Space") {
            player.position.y += 2;
        }

        if (event.key.toLowerCase() === "b") {

            if (player.material.color.getHex() === 0x2878ff) {

                player.material.color.set(0xc62828);

                document.getElementById(
                    "mode"
                ).textContent =
                    "SECRET HERO MODE";

            } else {

                player.material.color.set(0x2878ff);

                document.getElementById(
                    "mode"
                ).textContent =
                    "CIVILIAN";
            }
        }
    }
);


window.addEventListener(
    "keyup",
    (event) => {

        keys[event.key.toLowerCase()] = false;
    }
);


// GAME LOOP

function animate() {

    requestAnimationFrame(animate);

    const speed = keys.shift
        ? 0.25
        : 0.12;

    if (keys.w)
        player.position.z -= speed;

    if (keys.s)
        player.position.z += speed;

    if (keys.a)
        player.position.x -= speed;

    if (keys.d)
        player.position.x += speed;


    // Camera follows Logan

    camera.position.x =
        player.position.x;

    camera.position.z =
        player.position.z + 10;

    camera.lookAt(
        player.position
    );


    renderer.render(
        scene,
        camera
    );
}

animate();


// SCREEN RESIZE

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
