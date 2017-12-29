import TooltipType from "./TooltipType";

const option = (value: string) => { return { label: value, value }; };
const options = (values: string[]) => values.map(option);

const actions = ["Attack", "Cast a Spell", "Dash", "Disengage", "Dodge", "Help", "Hide", "Ready", "Search", "Use an Object"];
const conditions = [
    "Blinded",
    "Charmed",
    "Deafened",
    "Exhaustion",
    "Frightened",
    "Grappled",
    "Incapacitated",
    "Invisible",
    "Paralyzed",
    "Petrified",
    "Poisoned",
    "Prone",
    "Restrained",
    "Stunned",
    "Unconscious"
];
const senses = ["Blindsight", "Darkvision", "Tremorsense", "Truesight"];
const skills = [
    "Acrobatics",
    "Animal Handling",
    "Arcana",
    "Athletics",
    "Deception",
    "History",
    "Insight",
    "Intimidation",
    "Investigation",
    "Medicine",
    "Nature",
    "Perception",
    "Performance",
    "Persuasion",
    "Religion",
    "Sleight of Hand",
    "Stealth",
    "Survival"
];
const wprop = [
    "Ammunition",
    "Ammunition (Firearms)",
    "Burst Fire",
    "Finesse",
    "Heavy",
    "Light",
    "Loading",
    "Range",
    "Reach",
    "Reload",
    "Special",
    "Thrown",
    "Two-Handed",
    "Versatile"
];

class TooltipOptions {
    static getOptions(tooltipType: string) {
        switch (tooltipType) {
            case TooltipType.Action:
                return options(actions);
            case TooltipType.Condition:
                return options(conditions);
            case TooltipType.Sense:
                return options(senses);
            case TooltipType.Skill:
                return options(skills);
            case TooltipType.WeaponProperty:
                return options(wprop);
            default:
                return [];
        }
    }
}

export default TooltipOptions;