function updateNPCs() {

    for (const npc of npcs) {

        // ===============================
        // INSIDE BUILDING
        // ===============================

        if (npc.state === "inside") {

            npc.insideTimer -= 1;

            if (npc.insideTimer <= 0) {

                npc.state = "walking";

                npc.object.visible = true;

                npc.object.position.y = 0;

                npc.direction =
                    Math.random() *
                    Math.PI *
                    2;
            }

            continue;
        }

        // ===============================
        // ACCIDENT REACTION
        // ===============================

        if (npc.state === "reacting") {

            npc.reactionTimer -= 1;

            if (npc.reactionTimer <= 0) {

                npc.state = "walking";

                npc.direction =
                    Math.random() *
                    Math.PI *
                    2;
            }

            continue;
        }

        // ===============================
        // NORMAL WALKING
        // ===============================

        if (npc.state === "walking") {

            npc.object.position.x +=
                Math.cos(
                    npc.direction
                ) *
                npc.speed;

            npc.object.position.z +=
                Math.sin(
                    npc.direction
                ) *
                npc.speed;

            // Occasionally visit a building
            if (
                Math.random() < 0.001 &&
                npc.targetBuilding
            ) {

                const bx =
                    npc.targetBuilding.x;

                const bz =
                    npc.targetBuilding.z;

                const dx =
                    bx - npc.object.position.x;

                const dz =
                    bz - npc.object.position.z;

                npc.direction =
                    Math.atan2(dz, dx);
            }

            // Change direction
            if (
                Math.random() < 0.003
            ) {

                npc.direction =
                    Math.random() *
                    Math.PI *
                    2;
            }
        }

        // ===============================
        // BUILDING ENTRY
        // ===============================

        if (
            npc.targetBuilding &&
            npc.state === "walking"
        ) {

            const dx =
                npc.object.position.x -
                npc.targetBuilding.x;

            const dz =
                npc.object.position.z -
                (
                    npc.targetBuilding.z -
                    npc.targetBuilding.depth / 2
                );

            const distance =
                Math.sqrt(
                    dx * dx +
                    dz * dz
                );

            if (distance < 3) {

                npc.state = "inside";

                npc.insideTimer =
                    500 +
                    Math.random() * 800;

                npc.object.visible = false;
            }
        }

        // Keep NPCs in the city
        npc.object.position.x =
            THREE.MathUtils.clamp(
                npc.object.position.x,
                -245,
                245
            );

        npc.object.position.z =
            THREE.MathUtils.clamp(
                npc.object.position.z,
                -245,
                245
            );
    }
}
