import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export function createBuildings(scene) {

    const buildingMaterials = [
        new THREE.MeshStandardMaterial({ color: 0xb0b0b0 }),
        new THREE.MeshStandardMaterial({ color: 0xcccccc }),
        new THREE.MeshStandardMaterial({ color: 0x999999 }),
        new THREE.MeshStandardMaterial({ color: 0xd0c0a0 }),
        new THREE.MeshStandardMaterial({ color: 0x8fb3c9 })
    ];

    for (let x = -80; x <= 80; x += 25) {

        for (let z = -80; z <= 80; z += 25) {

            // Keep the roads clear

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

            // ==========================
            // WINDOWS
            // ==========================

            const windowMaterial =
                new THREE.MeshBasicMaterial({
                    color: 0xffff99
                });

            for (
                let y = 4;
                y < height - 2;
                y += 4
            ) {

                for (
                    let side = -1;
                    side <= 1;
                    side += 2
                ) {

                    const window = new THREE.Mesh(
                        new THREE.BoxGeometry(
                            1.2,
                            1.5,
                            0.1
                        ),
                        windowMaterial
                    );

                    window.position.set(
                        x + side * (width / 2 + 0.06),
                        y,
                        z
                    );

                    scene.add(window);
                }
            }
        }
    }
}
