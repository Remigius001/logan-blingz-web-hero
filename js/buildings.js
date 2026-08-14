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

    let id = 0;

    for (let x = -180; x <= 180; x += 30) {

        for (let z = -180; z <= 180; z += 30) {

            // Large streets stay clear
            if (
                Math.abs(x) < 18 ||
                Math.abs(z) < 18
            ) {
                continue;
            }

            const width = 18;
            const depth = 18;
            const height = 12 + Math.random() * 35;

            const color =
                materials[
                    Math.floor(
                        Math.random() * materials.length
                    )
                ];

            const wallMaterial =
                new THREE.MeshStandardMaterial({
                    color
                });

            const floorMaterial =
                new THREE.MeshStandardMaterial({
                    color: 0x505050
                });

            const building =
                new THREE.Group();

            building.position.set(
                x,
                0,
                z
            );

            // =================================
            // FLOOR / INTERIOR
            // =================================

            const floor = new THREE.Mesh(
                new THREE.BoxGeometry(
                    width,
                    0.3,
                    depth
                ),
                floorMaterial
            );

            floor.position.y = 0.15;

            building.add(floor);

            // =================================
            // BACK WALL
            // =================================

            const backWall = new THREE.Mesh(
                new THREE.BoxGeometry(
                    width,
                    height,
                    0.8
                ),
                wallMaterial
            );

            backWall.position.set(
                0,
                height / 2,
                depth / 2
            );

            building.add(backWall);

            // =================================
            // LEFT WALL
            // =================================

            const leftWall = new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.8,
                    height,
                    depth
                ),
                wallMaterial
            );

            leftWall.position.set(
                -width / 2,
                height / 2,
                0
            );

            building.add(leftWall);

            // =================================
            // RIGHT WALL
            // =================================

            const rightWall = new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.8,
                    height,
                    depth
                ),
                wallMaterial
            );

            rightWall.position.set(
                width / 2,
                height / 2,
                0
            );

            building.add(rightWall);

            // =================================
            // FRONT WALL WITH DOOR GAP
            // =================================

            const frontSideWidth =
                (width - 4) / 2;

            const frontLeft = new THREE.Mesh(
                new THREE.BoxGeometry(
                    frontSideWidth,
                    height,
                    0.8
                ),
                wallMaterial
            );

            frontLeft.position.set(
                -(width - 4) / 4,
                height / 2,
                -depth / 2
            );

            building.add(frontLeft);

            const frontRight = frontLeft.clone();

            frontRight.position.x =
                (width - 4) / 4;

            building.add(frontRight);

            // =================================
            // DOOR
            // =================================

            const door = new THREE.Mesh(
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

            // =================================
            // INTERIOR LIGHT
            // =================================

            const light = new THREE.PointLight(
                0xffffcc,
                1.5,
                35
            );

            light.position.set(
                0,
                Math.min(height - 2, 10),
                0
            );

            building.add(light);

            // =================================
            // NAME / DATA
            // =================================

            building.userData = {
                id,
                name: `Building ${id + 1}`,
                x,
                z,
                width,
                depth,
                height
            };

            buildingList.push(
                building.userData
            );

            scene.add(building);

            id++;
        }
    }
}
