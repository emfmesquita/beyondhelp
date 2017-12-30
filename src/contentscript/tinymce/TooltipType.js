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
const hcollectionmonster = "hcollectionmonster";
const hcollectionspell = "hcollectionspell";
const hcollectionitem = "hcollectionitem";

const hListTypes = [hmonster, hspell, hmitem];
const hCollectionTypes = [hcollectionmonster, hcollectionspell, hcollectionitem];
const hTypes = hListTypes.concat(hCollectionTypes);
const allTypes = [monster, spell, equip, mitem, action, condition, sense, skill, wprop, hmonster, hspell, hmitem, hcollectionmonster, hcollectionspell, hcollectionitem];
const searchableTypes = [monster, spell, equip, mitem].concat(hTypes);

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
    static get HomebrewCollectionMonster(): string {
        return hcollectionmonster;
    }
    static get HomebrewCollectionSpell(): string {
        return hcollectionspell;
    }
    static get HomebrewCollectionMagicItem(): string {
        return hcollectionitem;
    }

    static allTypes(): string[] {
        return allTypes.map(type => type);
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

    static isHomebrewCollection(type: string): boolean {
        return hCollectionTypes.some(hType => hType === type);
    }

    static isSearchable(type: string): boolean {
        return searchableTypes.some(hType => hType === type);
    }

    static getHomebrewClassName(type: string): string {
        switch (type) {
            case TooltipType.HomebrewMagicItem:
            case TooltipType.HomebrewCollectionMagicItem:
                return "magic-item-tooltip";
            case TooltipType.HomebrewMonster:
            case TooltipType.HomebrewCollectionMonster:
                return "monster-tooltip";
            case TooltipType.HomebrewSpell:
            case TooltipType.HomebrewCollectionSpell:
                return "spell-tooltip";
            default:
                return "";
        }
    }
}

export default TooltipType;