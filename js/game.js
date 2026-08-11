import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
    75,
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

const light = new THREE.DirectionalLight(
    0xffffff,
    2
);

light.position.set(10, 20, 10);

scene.add(light);

scene.add(
    new THREE.AmbientLight(
        0xffffff,
        0.5
    )
);


// GROUND

const ground = new THREE.Mesh(
    new THREE.BoxGeometry(50, 1, 50),
    new THREE.MeshStandardMaterial({
        color: 0x444444
    })
);

ground.position.y = -0.5;

scene.add(ground);


// LOGAN

const logan = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshStandardMaterial({
        color: 0x2266ff
    })
);

logan.position.y = 1;

scene.add(logan);


// CITY BUILDING

const building = new THREE.Mesh(
    new THREE.BoxGeometry(5, 8, 5),
    new THREE.MeshStandardMaterial({
        color: 0x888888
    })
);

building.position.set(
    0,
    4,
    -10
);

scene.add(building);


// ANIMATION

function animate() {

    requestAnimationFrame(animate);

    camera.lookAt(logan.position);

    renderer.render(
        scene,
        camera
    );
}

animate();


// RESIZE

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
