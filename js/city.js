import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export function createCity(scene) {

    // ==============================
    // CITY GROUND
    // ==============================

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(300, 300),
        new THREE.MeshStandardMaterial({
            color: 0x555555
        })
    );

    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // ==============================
    // ROADS
    // ==============================

    const roadMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222
    });

    const road1 = new THREE.Mesh(
        new THREE.BoxGeometry(20, 0.05, 300),
        roadMaterial
    );

    road1.position.y = 0.03;
    scene.add(road1);

    const road2 = new THREE.Mesh(
        new THREE.BoxGeometry(300, 0.05, 20),
        roadMaterial
    );

    road2.position.y = 0.04;
    scene.add(road2);

    // ==============================
    // BUILDINGS
    // ==============================

    for (let x = -80; x <= 80; x += 25) {

        for (let z = -80; z <= 80; z += 25) {

            // Keep roads clear

            if (
                Math.abs(x) < 15 ||
                Math.abs(z) < 15
            ) {
                continue;
            }

            const height =
                10 + Math.random() * 30;

            const width =
                12 + Math.random() * 6;

            const building =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        width,
                        height,
                        width
                    ),

                    new THREE.MeshStandardMaterial({
                        color:
                            0x777777 +
                            Math.floor(
                                Math.random() * 0x333333
                            )
                    })
                );

            building.position.set(
                x,
                height / 2,
                z
            );

            scene.add(building);
        }
    }

    // ==============================
    // PARK
    // ==============================

    const park =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                35,
                0.1,
                35
            ),

            new THREE.MeshStandardMaterial({
                color: 0x228b22
            })
        );

    park.position.set(
        45,
        0.08,
        45
    );

    scene.add(park);

    // ==============================
    // CITY LIGHTS
    // ==============================

    const cityLight =
        new THREE.PointLight(
            0xffffff,
            2,
            50
        );

    cityLight.position.set(
        0,
        10,
        0
    );

    scene.add(cityLight);
}
