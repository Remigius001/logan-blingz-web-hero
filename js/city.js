import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { createBuildings } from "./buildings.js";

export function createCity(scene) {

    // ==================================
    // GROUND
    // ==================================

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(300, 300),
        new THREE.MeshStandardMaterial({
            color: 0x555555
        })
    );

    ground.rotation.x = -Math.PI / 2;

    scene.add(ground);

    // ==================================
    // ROADS
    // ==================================

    const roadMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x222222
        });

    const road1 = new THREE.Mesh(
        new THREE.BoxGeometry(
            20,
            0.05,
            300
        ),
        roadMaterial
    );

    road1.position.y = 0.03;

    scene.add(road1);

    const road2 = new THREE.Mesh(
        new THREE.BoxGeometry(
            300,
            0.05,
            20
        ),
        roadMaterial
    );

    road2.position.y = 0.04;

    scene.add(road2);

    // ==================================
    // BUILDINGS
    // ==================================

    createBuildings(scene);

    // ==================================
    // PARK
    // ==================================

    const park = new THREE.Mesh(
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
}
