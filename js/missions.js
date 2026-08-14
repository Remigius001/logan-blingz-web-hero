const villainNames = [
    "Shadow King",
    "Iron Fang",
    "Volt Viper",
    "Night Crusher",
    "Frost Warden"
];

const heroNames = [
    "Skyblade",
    "Storm Knight",
    "Nightflare",
    "Titan Nova"
];

const cities = [
    "Blingz City",
    "Central City"
];

const missionTemplates = [
    {
        type: "villain",
        title: "Villain Attack",
        objective: villain => `Stop ${villain}.`
    },
    {
        type: "hero_rescue",
        title: "Hero Rescue",
        objective: hero => `Rescue ${hero} from the enemy.`
    },
    {
        type: "hero_battle",
        title: "Hero Battle",
        objective: hero => `Help ${hero} fight the villain.`
    },
    {
        type: "protect",
        title: "Protect the City",
        objective: () => "Protect civilians and keep the area safe."
    },
    {
        type: "rescue",
        title: "Civilian Rescue",
        objective: () => "Rescue civilians and guide them to safety."
    },
    {
        type: "search",
        title: "Search Mission",
        objective: () => "Search the area and find the target."
    },
    {
        type: "chase",
        title: "City Chase",
        objective: () => "Chase the target across the city."
    },
    {
        type: "emergency",
        title: "Emergency Response",
        objective: () => "Respond to the emergency and secure the area."
    },
    {
        type: "team",
        title: "Hero Team-Up",
        objective: hero => `Team up with ${hero} and stop the threat.`
    }
];

let generatedMissionNumber = 0;

export function createRandomMission() {

    generatedMissionNumber++;

    const template =
        missionTemplates[
            Math.floor(
                Math.random() *
                missionTemplates.length
            )
        ];

    const city =
        cities[
            Math.floor(
                Math.random() *
                cities.length
            )
        ];

    const villain =
        villainNames[
            Math.floor(
                Math.random() *
                villainNames.length
            )
        ];

    const hero =
        heroNames[
            Math.floor(
                Math.random() *
                heroNames.length
            )
        ];

    let objective =
        template.objective();

    let mission = {

        id: generatedMissionNumber,

        title: template.title,

        type: template.type,

        city: city,

        objective: objective,

        reward:
            300 +
            Math.floor(
                Math.random() * 1200
            ),

        villain: null,

        hero: null,

        timestamp: Date.now()
    };

    // ==================================
    // VILLAIN MISSION
    // ==================================

    if (
        template.type === "villain"
    ) {

        mission.villain =
            villain;

        mission.objective =
            template.objective(
                villain
            );
    }

    // ==================================
    // HERO RESCUE
    // ==================================

    if (
        template.type === "hero_rescue"
    ) {

        mission.hero =
            hero;

        mission.villain =
            villain;

        mission.objective =
            template.objective(
                hero
            );
    }

    // ==================================
    // HERO BATTLE
    // ==================================

    if (
        template.type === "hero_battle"
    ) {

        mission.hero =
            hero;

        mission.villain =
            villain;

        mission.objective =
            template.objective(
                hero
            );
    }

    // ==================================
    // TEAM MISSION
    // ==================================

    if (
        template.type === "team"
    ) {

        mission.hero =
            hero;

        mission.villain =
            villain;

        mission.objective =
            template.objective(
                hero
            );
    }

    return mission;
}

export function getMissionNumber() {

    return generatedMissionNumber;
}
