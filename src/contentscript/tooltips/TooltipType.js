// common
const monster = "monster";
const spell = "spell";
const equip = "equip";
const mitem = "mitem";
const action = "action";
const condition = "condition";
const sense = "sense";
const skill = "skill";
const wprop = "wprop";
const common = [monster, spell, equip, mitem, action, condition, sense, skill, wprop];

// homebrew lists
const hmonster = "hmonster";
const hspell = "hspell";
const hmitem = "hmitem";
const hListTypes = [hmonster, hspell, hmitem];

// homebrew collections
const hcollectionmonster = "hcollectionmonster";
const hcollectionspell = "hcollectionspell";
const hcollectionitem = "hcollectionitem";
const hCollectionTypes = [hcollectionmonster, hcollectionspell, hcollectionitem];

// custom
const background = "background";
const feat = "feat";
const hbackground = "hbackground";
const hfeat = "hfeat";
const hcbackground = "hcbackground";
const hcfeat = "hcfeat";
const custom = [background, feat, hbackground, hfeat, hcbackground, hcfeat];

const hTypes = hListTypes.concat(hCollectionTypes);
const allTypes = common.concat(hTypes).concat(custom);
const searchableTypes = [monster, spell, equip, mitem].concat(hTypes).concat(custom);

class TooltipType {
    static get Action(): string {
        return action;
    }
    static get Background(): string {
        return background;
    }
    static get Condition(): string {
        return condition;
    }
    static get Equipment(): string {
        return equip;
    }
    static get Feat(): string {
        return feat;
    }
    static get MagicItem(): string {
        return mitem;
    }
    static get Monster(): string {
        return monster;
    }
    static get Sense(): string {
        return sense;
    }
    static get Skill(): string {
        return skill;
    }
    static get Spell(): string {
        return spell;
    }
    static get WeaponProperty(): string {
        return wprop;
    }
    static get HomebrewBackground(): string {
        return hbackground;
    }
    static get HomebrewFeat(): string {
        return hfeat;
    }
    static get HomebrewMagicItem(): string {
        return hmitem;
    }
    static get HomebrewMonster(): string {
        return hmonster;
    }
    static get HomebrewSpell(): string {
        return hspell;
    }
    static get HomebrewCollectionBackground(): string {
        return hcbackground;
    }
    static get HomebrewCollectionFeat(): string {
        return hcfeat;
    }
    static get HomebrewCollectionMagicItem(): string {
        return hcollectionitem;
    }
    static get HomebrewCollectionMonster(): string {
        return hcollectionmonster;
    }
    static get HomebrewCollectionSpell(): string {
        return hcollectionspell;
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

    static isCommon(type: string): boolean {
        return common.some(cType => cType === type);
    }

    static isHomebrew(type: string): boolean {
        return hTypes.some(hType => hType === type);
    }

    static isHomebrewCollection(type: string): boolean {
        return hCollectionTypes.some(hType => hType === type);
    }

    static isCustom(type: string): boolean {
        return custom.some(cType => cType === type);
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