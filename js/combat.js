export function attack(attacker, defender, damage = 20) {

    if (!attacker || !defender) {
        return false;
    }

    if (
        attacker.defeated ||
        defender.defeated
    ) {
        return false;
    }

    if (
        typeof attacker.attack === "function"
    ) {

        return attacker.attack(
            defender,
            damage
        );
    }

    defender.takeDamage(damage);

    return true;
}


export function recoverCharacter(
    character,
    amount = 5
) {

    if (!character) {
        return;
    }

    if (
        typeof character.recover === "function"
    ) {

        character.recover(amount);
    }
}


export function isDefeated(character) {

    if (!character) {
        return true;
    }

    return character.defeated === true;
}
