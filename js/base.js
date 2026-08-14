import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export function createBase(scene) {

    const base = new THREE.Group();

    // ======================================
    // BASE FLOOR
    // ======================================

    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(24, 0.3, 20),
        new THREE.MeshStandardMaterial({
            color: 0x333333
        })
    );

    floor.position.y = 0.15;
    base.add(floor);

    // ======================================
    // WALLS
    // ======================================

    const wallMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x555566
        });

    const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(24, 8, 0.5),
        wallMaterial
    );

    backWall.position.set(
        0,
        4,
        10
    );

    base.add(backWall);

    const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 8, 20),
        wallMaterial
    );

    leftWall.position.set(
        -12,
        4,
        0
    );

    base.add(leftWall);

    const rightWall = leftWall.clone();

    rightWall.position.x = 12;

    base.add(rightWall);

    // ======================================
    // ROOF LIGHTS
    // ======================================

    for (let x = -8; x <= 8; x += 4) {

        const light = new THREE.PointLight(
            0xffffff,
            1.5,
            15
        );

        light.position.set(
            x,
            7,
            0
        );

        base.add(light);
    }

    // ======================================
    // SUIT ROOM
    // ======================================

    const suitRoom = new THREE.Mesh(
        new THREE.BoxGeometry(6, 4, 4),
        new THREE.MeshStandardMaterial({
            color: 0x222233
        })
    );

    suitRoom.position.set(
        0,
        2,
        5
    );

    base.add(suitRoom);

    // Front opening visual
    const suitDoor = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3.5, 0.15),
        new THREE.MeshStandardMaterial({
            color: 0x111111
        })
    );

    suitDoor.position.set(
        0,
        1.8,
        2.9
    );

    base.add(suitDoor);

    // ======================================
    // SUIT DISPLAY
    // ======================================

    const display = new THREE.Mesh(
        new THREE.CylinderGeometry(
            1.2,
            1.2,
            0.2,
            24
        ),
        new THREE.MeshStandardMaterial({
            color: 0x888888
        })
    );

    display.position.set(
        0,
        0.3,
        5
    );

    base.add(display);

    // ======================================
    // COMPUTER
    // ======================================

    const computer = new THREE.Mesh(
        new THREE.BoxGeometry(
            2,
            1.2,
            0.7
        ),
        new THREE.MeshStandardMaterial({
            color: 0x111111
        })
    );

    computer.position.set(
        -6,
        1,
        0
    );

    base.add(computer);

    // ======================================
    // BASE POSITION
    // ======================================

    base.position.set(
        -60,
        0,
        -60
    );

    scene.add(base);

    return {
        object: base,
        suitPosition: new THREE.Vector3(
            -60,
            0,
            -55
        )
    };
}
