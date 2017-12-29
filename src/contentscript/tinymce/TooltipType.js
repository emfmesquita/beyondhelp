const monster = "monster";
const spell = "spell";
const equip = "equip";
const mitem = "mitem";
const action = "action";
const condition = "condition";
const sense = "sense";
const skill = "skill";
const wprop = "wprop";
const hmonster = "hmonster";
const hspell = "hspell";
const hmitem = "hmitem";
const hcreation = "hcreation";

const hTypes = [hmonster, hspell, hmitem, hcreation];

class TooltipType {
    static get Monster(): string {
        return monster;
    }
    static get Spell(): string {
        return spell;
    }
    static get Equipment(): string {
        return equip;
    }
    static get MagicItem(): string {
        return mitem;
    }
    static get Action(): string {
        return action;
    }
    static get Condition(): string {
        return condition;
    }
    static get Sense(): string {
        return sense;
    }
    static get Skill(): string {
        return skill;
    }
    static get WeaponProperty(): string {
        return wprop;
    }
    static get HomebrewMonster(): string {
        return hmonster;
    }
    static get HomebrewSpell(): string {
        return hspell;
    }
    static get HomebrewMagicItem(): string {
        return hmitem;
    }
    static get HomebrewCreation(): string {
        return hcreation;
    }

    static getTag(type: string): string {
        switch (type) {
            case TooltipType.Action:
                return "action";
            case TooltipType.Condition:
                return "condition";
            case TooltipType.Equipment:
                return "item";
            case TooltipType.MagicItem:
                return "magicItem";
            case TooltipType.Monster:
                return "monster";
            case TooltipType.Sense:
                return "sense";
            case TooltipType.Skill:
                return "skill";
            case TooltipType.Spell:
                return "spell";
            case TooltipType.WeaponProperty:
                return "wprop";
            default:
                return "";
        }
    }

    static isHomebrew(type: string): boolean {
        return hTypes.some(hType => hType === type);
    }

    static getHomebrewClassName(type: string): string {
        switch (type) {
            case TooltipType.HomebrewMagicItem:
                return "magic-item-tooltip";
            case TooltipType.HomebrewMonster:
                return "monster-tooltip";
            case TooltipType.HomebrewSpell:
                return "spell-tooltip";
            default:
                return "";
        }
    }
}

export default TooltipType;