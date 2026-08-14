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
    },
    {
        name: "Metro City",
        centerX: 700,
        centerZ: 0
    },
    {
        name: "Ocean City",
        centerX: 1050,
        centerZ: 0
    },
    {
        name: "Liberty City",
        centerX: 0,
        centerZ: 350
    },
    {
        name: "Neon City",
        centerX: 350,
        centerZ: 350
    },
    {
        name: "Mountain City",
        centerX: 700,
        centerZ: 350
    }
];

export function createCity(scene) {

    // ======================================
    // WORLD GROUND
    // ======================================

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(
            1500,
            850
        ),
        new THREE.MeshStandardMaterial({
            color: 0x555555
        })
    );

    ground.rotation.x =
        -Math.PI / 2;

    scene.add(ground);

    // ======================================
    // CREATE ALL CITIES
    // ======================================

    for (const city of cities) {

        createCityRoads(
            scene,
            city.centerX,
            city.centerZ
        );

        createCityParks(
            scene,
            city.centerX,
            city.centerZ
        );

        createCityLandmarks(
            scene,
            city.centerX,
            city.centerZ
        );
    }

    // ======================================
    // HIGHWAYS BETWEEN CITIES
    // ======================================

    createHighway(
        scene,
        175,
        0,
        320,
        18
    );

    createHighway(
        scene,
        525,
        0,
        320,
        18
    );

    createHighway(
        scene,
        875,
        0,
        320,
        18
    );

    createHighway(
        scene,
        0,
        175,
        18,
        320
    );

    createHighway(
        scene,
        350,
        175,
        18,
        320
    );

    createHighway(
        scene,
        700,
        175,
        18,
        320
    );

    // ======================================
    // DIAGONAL CONNECTIONS
    // ======================================

    createHighway(
        scene,
        175,
        175,
        320,
        12
    );

    createHighway(
        scene,
        525,
        175,
        320,
        12
    );

    // ======================================
    // BUILDINGS
    // ======================================

    createBuildings(scene);
}

// ==========================================
// CITY ROADS
// ==========================================

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

    for (
        const offset of roadOffsets
    ) {

        // Vertical road

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

        scene.add(
            verticalRoad
        );

        // Horizontal road

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

        scene.add(
            horizontalRoad
        );
    }
}

// ==========================================
// HIGHWAY
// ==========================================

function createHighway(
    scene,
    x,
    z,
    width,
    depth
) {

    const highway =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                0.08,
                depth
            ),
            new THREE.MeshStandardMaterial({
                color: 0x202020
            })
        );

    highway.position.set(
        x,
        0.04,
        z
    );

    scene.add(
        highway
    );

    // Road divider

    const divider =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                0.12,
                0.5
            ),
            new THREE.MeshStandardMaterial({
                color: 0xdddddd
            })
        );

    divider.position.set(
        x,
        0.12,
        z
    );

    scene.add(
        divider
    );
}

// ==========================================
// PARKS
// ==========================================

function createCityParks(
    scene,
    centerX,
    centerZ
) {

    const parkMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x2f8f3a
        });

    const parkPositions = [
        [-110, -110],
        [110, 110],
        [-110, 110],
        [110, -110]
    ];

    for (
        const [x, z]
        of parkPositions
    ) {

        const park =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    35,
                    0.15,
                    35
                ),
                parkMaterial
            );

        park.position.set(
            centerX + x,
            0.1,
            centerZ + z
        );

        scene.add(
            park
        );
    }
}

// ==========================================
// CITY LANDMARKS
// ==========================================

function createCityLandmarks(
    scene,
    centerX,
    centerZ
) {

    // Central tower

    const tower =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                8,
                40,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x777777
            })
        );

    tower.position.set(
        centerX,
        20,
        centerZ
    );

    scene.add(
        tower
    );

    // Landmark top

    const roof =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                12,
                2,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x333333
            })
        );

    roof.position.set(
        centerX,
        41,
        centerZ
    );

    scene.add(
        roof
    );
}
