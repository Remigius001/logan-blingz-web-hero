// ======================================
// NPC MOVEMENT
// ======================================

function updateNPCs() {

    for (const npc of npcs) {

        if (npc.state === "working") {
            continue;
        }

        // Move NPC
        npc.object.position.x +=
            Math.cos(npc.direction) *
            npc.speed;

        npc.object.position.z +=
            Math.sin(npc.direction) *
            npc.speed;

        // Turn toward walking direction
        const targetRotation =
            Math.atan2(
                Math.cos(npc.direction),
                Math.sin(npc.direction)
            );

        npc.object.rotation.y =
            THREE.MathUtils.lerp(
                npc.object.rotation.y,
                targetRotation,
                0.12
            );

        // Randomly change direction
        if (Math.random() < 0.003) {

            npc.direction =
                Math.random() *
                Math.PI *
                2;
        }

        // Keep NPCs inside the expanded 7-city world
        npc.object.position.x =
            THREE.MathUtils.clamp(
                npc.object.position.x,
                -245,
                1195
            );

        npc.object.position.z =
            THREE.MathUtils.clamp(
                npc.object.position.z,
                -245,
                595
            );
    }
}
