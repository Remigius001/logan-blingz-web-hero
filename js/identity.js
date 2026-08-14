export class IdentitySystem {

    constructor(player) {

        this.player = player;

        this.normalIdentity = {
            name: "Logan",
            role: "Student"
        };

        this.heroIdentity = {
            name: "Logan Blingz",
            role: "Hero"
        };

        this.isHero = false;

        this.secretIdentitySafe = true;
    }

    getCurrentIdentity() {

        if (this.isHero) {
            return this.heroIdentity;
        }

        return this.normalIdentity;
    }

    transformToHero() {

        if (this.isHero) {
            return;
        }

        this.isHero = true;

        console.log(
            "Logan changed into his hero identity."
        );
    }

    transformToNormal() {

        if (!this.isHero) {
            return;
        }

        this.isHero = false;

        console.log(
            "Logan returned to his normal identity."
        );
    }

    toggleIdentity() {

        if (this.isHero) {
            this.transformToNormal();
        } else {
            this.transformToHero();
        }
    }

    getName() {

        return this.getCurrentIdentity().name;
    }

    getRole() {

        return this.getCurrentIdentity().role;
    }

    isSecretIdentitySafe() {

        return this.secretIdentitySafe;
    }
}
