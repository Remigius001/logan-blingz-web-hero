import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { createBuildings } from "./buildings.js";

export const cities = [
    {
        name: "Blingz City",
        centerX: 0,
        centerZ: 0
    },
    {
        name: "Central City",
        centerX: 350,
        centerZ: 0
    }
];

export function createCity(scene) {

    // =====================================
    // HUGE WORLD GROUND
    // =====================================

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(
            900,
            500
        ),
        new THREE.MeshStandardMaterial({
            color: 0x555555
        })
    );

    ground.rotation.x =
        -Math.PI / 2;

    scene.add(ground);

    // =====================================
    // BLINGZ CITY ROADS
    // =====================================

    createCityRoads(
        scene,
        0,
        0
    );

    // =====================================
    // CENTRAL CITY ROADS
    // =====================================

    createCityRoads(
        scene,
        350,
        0
    );

    // =====================================
    // HIGHWAY BETWEEN CITIES
    // =====================================

    const highway = new THREE.Mesh(
        new THREE.BoxGeometry(
            320,
            0.08,
            18
        ),
        new THREE.MeshStandardMaterial({
            color: 0x202020
        })
    );

    highway.position.set(
        175,
        0.04,
        0
    );

    scene.add(highway);

    // =====================================
    // CENTRAL DIVIDER
    // =====================================

    const divider = new THREE.Mesh(
        new THREE.BoxGeometry(
            320,
            0.12,
            0.5
        ),
        new THREE.MeshStandardMaterial({
            color: 0xdddddd
        })
    );

    divider.position.set(
        175,
        0.12,
        0
    );

    scene.add(divider);

    // =====================================
    // CITY PARKS
    // =====================================

    createPark(
        scene,
        -110,
        -110
    );

    createPark(
        scene,
        110,
        110
    );

    createPark(
        scene,
        240,
        -110
    );

    createPark(
        scene,
        460,
        110
    );

    // =====================================
    // BUILDINGS
    // =====================================

    createBuildings(scene);
}


// =========================================
// CREATE CITY ROADS
// =========================================

function createCityRoads(
    scene,
    centerX,
    centerZ
) {

    const roadMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x252525
        });

    const roadOffsets = [
        -100,
        -50,
        0,
        50,
        100
    ];

    for (const offset of roadOffsets) {

        const verticalRoad =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    14,
                    0.05,
                    240
                ),
                roadMaterial
            );

        verticalRoad.position.set(
            centerX + offset,
            0.03,
            centerZ
        );

        scene.add(verticalRoad);

        const horizontalRoad =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    240,
                    0.05,
                    14
                ),
                roadMaterial
            );

        horizontalRoad.position.set(
            centerX,
            0.04,
            centerZ + offset
        );

        scene.add(horizontalRoad);
    }
}


// =========================================
// PARK
// =========================================

function createPark(
    scene,
    x,
    z
) {

    const park =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                35,
                0.15,
                35
            ),
            new THREE.MeshStandardMaterial({
                color: 0x2f8f3a
            })
        );

    park.position.set(
        x,
        0.1,
        z
    );

    scene.add(park);
}
