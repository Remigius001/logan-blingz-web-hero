export function attack(attacker, defender) {

    if (!attacker || !defender) {
        return;
    }

    if (
        attacker.defeated ||
        defender.defeated
    ) {
        return;
    }

    attacker.attack(defender);
}

export function recoverCharacter(character) {

    if (!character) {
        return;
    }

    character.recover(5);
}

export function isDefeated(character) {

    return character.defeated === true;
}
