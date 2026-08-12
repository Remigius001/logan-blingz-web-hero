import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Vehicle {

    constructor(scene, type = "car", x = 0, z = 0) {

        this.scene = scene;
        this.type = type;

        this.group = new THREE.Group();

        this.speed = 0;
        this.maxSpeed = 0.35;

        this.isOccupied = false;

        this.createVehicle();

        this.group.position.set(
            x,
            0,
            z
        );

        scene.add(this.group);
    }


    createVehicle() {

        if (this.type === "car") {
            this.createCar();
        }

        else if (this.type === "bike") {
            this.createBike();
        }

        else if (this.type === "jet") {
            this.createJet();
        }
    }


    // ======================================
    // CAR
    // ======================================

    createCar() {

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(
                2.5,
                0.7,
                4.2
            ),
            new THREE.MeshStandardMaterial({
                color: 0xd72626
            })
        );

        body.position.y = 0.8;

        this.group.add(body);


        const roof = new THREE.Mesh(
            new THREE.BoxGeometry(
                1.7,
                0.7,
                2.0
            ),
            new THREE.MeshStandardMaterial({
                color: 0x202020
            })
        );

        roof.position.y = 1.35;

        this.group.add(roof);


        const wheelMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x111111
            });


        const wheelPositions = [

            [-1.15, 0.4, -1.35],
            [ 1.15, 0.4, -1.35],

            [-1.15, 0.4,  1.35],
            [ 1.15, 0.4,  1.35]

        ];


        for (const position of wheelPositions) {

            const wheel = new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.43,
                    0.43,
                    0.32,
                    24
                ),
                wheelMaterial
            );

            wheel.rotation.z =
                Math.PI / 2;

            wheel.position.set(
                position[0],
                position[1],
                position[2]
            );

            this.group.add(wheel);
        }
    }


    // ======================================
    // BIKE
    // ======================================

    createBike() {

        const wheelMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x111111
            });


        const frameMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x2266ff
            });


        // Rear wheel

        const rearWheel = new THREE.Mesh(
            new THREE.TorusGeometry(
                0.45,
                0.09,
                12,
                24
            ),
            wheelMaterial
        );

        rearWheel.rotation.y =
            Math.PI / 2;

        rearWheel.position.set(
            0,
            0.55,
            0.9
        );

        this.group.add(rearWheel);


        // Front wheel

        const frontWheel =
            rearWheel.clone();

        frontWheel.position.z =
            -0.9;

        this.group.add(frontWheel);


        // Main frame

        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.18,
                0.65,
                1.5
            ),
            frameMaterial
        );

        frame.position.y =
            0.95;

        this.group.add(frame);


        // Lower frame

        const lowerFrame = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.14,
                0.3,
                1.1
            ),
            frameMaterial
        );

        lowerFrame.position.set(
            0,
            0.7,
            0
        );

        lowerFrame.rotation.x =
            Math.PI / 6;

        this.group.add(lowerFrame);


        // Seat

        const seat = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.42,
                0.12,
                0.55
            ),
            new THREE.MeshStandardMaterial({
                color: 0x111111
            })
        );

        seat.position.set(
            0,
            1.35,
            0.45
        );

        this.group.add(seat);


        // Handlebars

        const handlebars = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.8,
                0.12,
                0.12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x333333
            })
        );

        handlebars.position.set(
            0,
            1.45,
            -0.85
        );

        this.group.add(handlebars);


        // Handlebar stem

        const stem = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.12,
                0.5,
                0.12
            ),
            frameMaterial
        );

        stem.position.set(
            0,
            1.2,
            -0.85
        );

        stem.rotation.x =
            -0.25;

        this.group.add(stem);


        // Headlight

        const headlight = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.12,
                16,
                16
            ),
            new THREE.MeshStandardMaterial({
                color: 0xffffaa
            })
        );

        headlight.position.set(
            0,
            1.3,
            -1.0
        );

        this.group.add(headlight);
    }


    // ======================================
    // JET
    // ======================================

    createJet() {

        this.group.position.y =
            12;


        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.7,
                0.9,
                5,
                24
            ),
            new THREE.MeshStandardMaterial({
                color: 0xd8d8d8
            })
        );

        body.rotation.x =
            Math.PI / 2;

        this.group.add(body);


        // Main wings

        const wings = new THREE.Mesh(
            new THREE.BoxGeometry(
                7,
                0.15,
                1.4
            ),
            new THREE.MeshStandardMaterial({
                color: 0x333333
            })
        );

        this.group.add(wings);


        // Tail fin

        const tail = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.2,
                1.4,
                0.8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x333333
            })
        );

        tail.position.y = 0.7;
        tail.position.z = 1.8;

        this.group.add(tail);


        // Cockpit

        const cockpit = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.55,
                20,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x2266aa,
                transparent: true,
                opacity: 0.8
            })
        );

        cockpit.scale.set(
            1,
            0.6,
            1.3
        );

        cockpit.position.z =
            -0.8;

        this.group.add(cockpit);


        // Engines

        const engineMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x444444
            });


        const engine1 = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.25,
                0.25,
                1.2,
                16
            ),
            engineMaterial
        );

        engine1.rotation.x =
            Math.PI / 2;

        engine1.position.set(
            -1,
            0,
            1.8
        );

        this.group.add(engine1);


        const engine2 =
            engine1.clone();

        engine2.position.x =
            1;

        this.group.add(engine2);
    }


    // ======================================
    // ENTER
    // ======================================

    enter() {

        this.isOccupied = true;
    }


    // ======================================
    // EXIT
    // ======================================

    exit() {

        this.isOccupied = false;

        this.speed = 0;
    }


    // ======================================
    // VEHICLE MOVEMENT
    // ======================================

    update(keys) {

        if (!this.isOccupied) {
            return;
        }


        let acceleration = 0.01;

        let maximumSpeed =
            this.maxSpeed;


        if (this.type === "bike") {

            acceleration = 0.015;

            maximumSpeed = 0.45;
        }


        if (this.type === "jet") {

            acceleration = 0.02;

            maximumSpeed = 0.8;
        }


        // Accelerate

        if (keys["w"]) {

            this.speed +=
                acceleration;
        }


        // Reverse

        if (keys["s"]) {

            this.speed -=
                acceleration;
        }


        this.speed =
            THREE.MathUtils.clamp(
                this.speed,
                -maximumSpeed / 2,
                maximumSpeed
            );


        // Steering

        if (keys["a"]) {

            this.group.rotation.y +=
                0.03;
        }


        if (keys["d"]) {

            this.group.rotation.y -=
                0.03;
        }


        // Move forward

        const direction =
            new THREE.Vector3(
                0,
                0,
                -1
            );


        direction.applyQuaternion(
            this.group.quaternion
        );


        this.group.position.addScaledVector(
            direction,
            this.speed
        );


        // Jet vertical controls

        if (
            this.type === "jet"
        ) {

            if (keys[" "]) {

                this.group.position.y +=
                    0.15;
            }

            if (keys["control"]) {

                this.group.position.y -=
                    0.15;
            }
        }
    }
}
