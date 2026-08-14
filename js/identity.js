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

        // Base state
        this.inBase = false;
    }

    // ======================================
    // BASE
    // ======================================

    enterBase() {

        this.inBase = true;

        console.log(
            "Logan entered his base."
        );
    }

    leaveBase() {

        this.inBase = false;

        console.log(
            "Logan left his base."
        );
    }

    canTransform() {

        return this.inBase;
    }

    // ======================================
    // CURRENT IDENTITY
    // ======================================

    getCurrentIdentity() {

        return this.isHero
            ? this.heroIdentity
            : this.normalIdentity;
    }

    // ======================================
    // TRANSFORM
    // ======================================

    transformToHero() {

        if (!this.inBase) {

            console.log(
                "Logan must be inside his base to put on the hero suit."
            );

            return false;
        }

        this.isHero = true;

        console.log(
            "Logan put on his hero suit."
        );

        return true;
    }

    transformToNormal() {

        if (!this.inBase) {

            console.log(
                "Logan must return to his base to change back."
            );

            return false;
        }

        this.isHero = false;

        console.log(
            "Logan changed back to his normal clothes."
        );

        return true;
    }

    toggleIdentity() {

        if (!this.inBase) {

            console.log(
                "Go to Logan's base to change suits."
            );

            return false;
        }

        if (this.isHero) {

            return this.transformToNormal();

        } else {

            return this.transformToHero();
        }
    }

    // ======================================
    // INFORMATION
    // ======================================

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
