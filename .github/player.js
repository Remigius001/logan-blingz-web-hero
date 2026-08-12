// Logan player system

export class Player {

    constructor(scene) {
        this.scene = scene;

        this.group = new THREE.Group();

        this.speed = 0.12;
        this.jumpPower = 0.35;
        this.velocityY = 0;
        this.isGrounded = true;

        scene.add(this.group);
    }

}
