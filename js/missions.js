export const missionTypes = [
    "villain",
    "hero_rescue",
    "hero_battle",
    "protect",
    "rescue",
    "search",
    "chase",
    "emergency",
    "team_up"
];

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

const locations = [
    "Downtown",
    "School",
    "Hospital",
    "Police Station",
    "Park",
    "Highway",
    "Bank",
    "Train Station",
    "Harbor",
    "Warehouse",
    "Logan Base"
];

let missionNumber = 0;

function randomItem(array) {
    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];
}

export function createRandomMission() {

    missionNumber++;

    const type = randomItem(missionTypes);
    const city = randomItem(cities);
    const location = randomItem(locations);
    const villain = randomItem(villainNames);
    const hero = randomItem(heroNames);

    const reward =
        300 +
        Math.floor(Math.random() * 1700);

    const mission = {
        id: missionNumber,
        type,
        city,
        location,
        villain: null,
        hero: null,
        objective: "",
        reward,
        title: ""
    };

    switch (type) {

        case "villain":

            mission.villain = villain;

            mission.title =
                `${villain} Attack`;

            mission.objective =
                `Stop ${villain} in ${city}.`;

            break;

        case "hero_rescue":

            mission.hero = hero;
            mission.villain = villain;

            mission.title =
                `Rescue ${hero}`;

            mission.objective =
                `Rescue ${hero} from ${villain} at ${location}.`;

            break;

        case "hero_battle":

            mission.hero = hero;
            mission.villain = villain;

            mission.title =
                `${hero} Needs Backup`;

            mission.objective =
                `Help ${hero} fight ${villain}.`;

            break;

        case "protect":

            mission.title =
                `Protect ${location}`;

            mission.objective =
                `Protect civilians at the ${location}.`;

            break;

        case "rescue":

            mission.title =
                `Rescue Operation`;

            mission.objective =
                `Rescue civilians near the ${location}.`;

            break;

        case "search":

            mission.title =
                `Search ${location}`;

            mission.objective =
                `Search the ${location} and find the target.`;

            break;

        case "chase":

            mission.title =
                `City Chase`;

            mission.objective =
                `Chase the target through ${city}.`;

            break;

        case "emergency":

            mission.title =
                `Emergency Response`;

            mission.objective =
                `Respond to the emergency at the ${location}.`;

            break;

        case "team_up":

            mission.hero = hero;
            mission.villain = villain;

            mission.title =
                `${hero} Team-Up`;

            mission.objective =
                `Team up with ${hero} and stop ${villain}.`;

            break;

        default:

            mission.title =
                "City Patrol";

            mission.objective =
                `Patrol ${city}.`;
    }

    return mission;
}

export function getMissionNumber() {
    return missionNumber;
}
