import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export const buildingList = [];

export function createBuildings(scene) {

    const materials = [
        0xb8b8b8,
        0x9fa8b2,
        0xc7b89b,
        0x8fa6b8,
        0xd0d0d0,
        0xa68b72
    ];

    const cities = [
        {
            centerX: 0,
            centerZ: 0,
            name: "Blingz City"
        },
        {
            centerX: 350,
            centerZ: 0,
            name: "Central City"
        }
    ];

    let buildingId = 0;

    for (const city of cities) {

        for (
            let x = -100;
            x <= 100;
            x += 50
        ) {

            for (
                let z = -100;
                z <= 100;
                z += 50
            ) {

                const worldX =
                    city.centerX + x;

                const worldZ =
                    city.centerZ + z;

                // Keep the highway and major roads open
                if (
                    Math.abs(x) < 18 ||
                    Math.abs(z) < 18
                ) {
                    continue;
                }

                const width = 18;
                const depth = 18;
                const height =
                    12 +
                    Math.random() * 35;

                const material =
                    new THREE.MeshStandardMaterial({
                        color:
                            materials[
                                Math.floor(
                                    Math.random() *
                                    materials.length
                                )
                            ]
                    });

                const building =
                    new THREE.Group();

                building.position.set(
                    worldX,
                    0,
                    worldZ
                );

                // FLOOR
                const floor = new THREE.Mesh(
                    new THREE.BoxGeometry(
                        width,
                        0.3,
                        depth
                    ),
                    new THREE.MeshStandardMaterial({
                        color: 0x555555
                    })
                );

                floor.position.y = 0.15;
                building.add(floor);

                // BACK
                const back = new THREE.Mesh(
                    new THREE.BoxGeometry(
                        width,
                        height,
                        0.8
                    ),
                    material
                );

                back.position.set(
                    0,
                    height / 2,
                    depth / 2
                );

                building.add(back);

                // LEFT
                const left = new THREE.Mesh(
                    new THREE.BoxGeometry(
                        0.8,
                        height,
                        depth
                    ),
                    material
                );

                left.position.set(
                    -width / 2,
                    height / 2,
                    0
                );

                building.add(left);

                // RIGHT
                const right = left.clone();

                right.position.x =
                    width / 2;

                building.add(right);

                // FRONT LEFT
                const frontLeft =
                    new THREE.Mesh(
                        new THREE.BoxGeometry(
                            (width - 4) / 2,
                            height,
                            0.8
                        ),
                        material
                    );

                frontLeft.position.set(
                    -5,
                    height / 2,
                    -depth / 2
                );

                building.add(frontLeft);

                // FRONT RIGHT
                const frontRight =
                    frontLeft.clone();

                frontRight.position.x = 5;

                building.add(frontRight);

                // DOOR
                const door =
                    new THREE.Mesh(
                        new THREE.BoxGeometry(
                            4,
                            5,
                            0.25
                        ),
                        new THREE.MeshStandardMaterial({
                            color: 0x4b2e1f
                        })
                    );

                door.position.set(
                    0,
                    2.5,
                    -depth / 2 - 0.1
                );

                building.add(door);

                // WORKPLACE TYPE
                const jobTypes = [
                    "Teacher",
                    "Doctor",
                    "Police Officer",
                    "Shop Worker",
                    "Mechanic",
                    "Engineer",
                    "Taxi Driver"
                ];

                const workplace =
                    jobTypes[
                        buildingId %
                        jobTypes.length
                    ];

                building.userData = {

                    id: buildingId,

                    city: city.name,

                    x: worldX,

                    z: worldZ,

                    width,

                    depth,

                    height,

                    workplace
                };

                buildingList.push(
                    building.userData
                );

                scene.add(building);

                buildingId++;
            }
        }
    }
}
