import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { createBuildings } from "./buildings.js";

export function createCity(scene) {

    // =================================
    // HUGE GROUND
    // =================================

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(
            500,
            500
        ),
        new THREE.MeshStandardMaterial({
            color: 0x555555
        })
    );

    ground.rotation.x =
        -Math.PI / 2;

    scene.add(ground);

    // =================================
    // MAIN ROADS
    // =================================

    const roadMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x252525
        });

    const roadPositions = [
        -150,
        -100,
        -50,
        0,
        50,
        100,
        150
    ];

    for (const x of roadPositions) {

        const road = new THREE.Mesh(
            new THREE.BoxGeometry(
                14,
                0.05,
                500
            ),
            roadMaterial
        );

        road.position.set(
            x,
            0.03,
            0
        );

        scene.add(road);
    }

    for (const z of roadPositions) {

        const road = new THREE.Mesh(
            new THREE.BoxGeometry(
                500,
                0.05,
                14
            ),
            roadMaterial
        );

        road.position.set(
            0,
            0.04,
            z
        );

        scene.add(road);
    }

    // =================================
    // SIDEWALK GRID
    // =================================

    const sidewalkMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x888888
        });

    for (let x = -225; x <= 225; x += 25) {

        const sidewalk = new THREE.Mesh(
            new THREE.BoxGeometry(
                6,
                0.12,
                450
            ),
            sidewalkMaterial
        );

        sidewalk.position.set(
            x,
            0.08,
            0
        );

        scene.add(sidewalk);
    }

    // =================================
    // PARKS
    // =================================

    const parkMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x2f8f3a
        });

    const parkPositions = [
        [-125, -125],
        [125, -125],
        [-125, 125],
        [125, 125]
    ];

    for (const [x, z] of parkPositions) {

        const park = new THREE.Mesh(
            new THREE.BoxGeometry(
                35,
                0.15,
                35
            ),
            parkMaterial
        );

        park.position.set(
            x,
            0.1,
            z
        );

        scene.add(park);
    }

    // =================================
    // BUILDINGS
    // =================================

    createBuildings(scene);
}
