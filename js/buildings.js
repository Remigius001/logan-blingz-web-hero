import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export function createBuildings(scene) {

    const buildingMaterials = [
        new THREE.MeshStandardMaterial({ color: 0x777777 }),
        new THREE.MeshStandardMaterial({ color: 0x555555 }),
        new THREE.MeshStandardMaterial({ color: 0x888888 }),
        new THREE.MeshStandardMaterial({ color: 0x666666 })
    ];

    for (let x = -80; x <= 80; x += 25) {

        for (let z = -80; z <= 80; z += 25) {

            // Leave the main roads open

            if (
                Math.abs(x) < 15 ||
                Math.abs(z) < 15
            ) {
                continue;
            }

            const height =
                10 + Math.random() * 30;

            const width =
                10 + Math.random() * 6;

            const material =
                buildingMaterials[
                    Math.floor(
                        Math.random() *
                        buildingMaterials.length
                    )
                ];

            const building =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        width,
                        height,
                        width
                    ),
                    material
                );

            building.position.set(
                x,
                height / 2,
                z
            );

            scene.add(building);
        }
    }
}
