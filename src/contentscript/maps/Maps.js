import MapInfo from "./MapInfo";
import MapInfoEntry from "./MapInfoEntry";

const LMoP = [
    new MapInfo("lmop/introduction", "lmop01.jpg", [
        new MapInfoEntry("Part1GoblinArrows", "113,381,184,422", "lmop/goblin-arrows"),
        new MapInfoEntry("CragmawHideout", "243,547,292,593", "lmop/goblin-arrows"),
        new MapInfoEntry("Part2Phandalin", "301,626,360,660", "lmop/phandalin"),
        new MapInfoEntry("TriboarTrail", "363,497,405,532", "lmop/the-spiders-web"),
        new MapInfoEntry("ConyberryandAgathasLair", "429,401,557,459", "lmop/the-spiders-web"),
        new MapInfoEntry("OldOwlWell", "503,476,559,509", "lmop/the-spiders-web"),
        new MapInfoEntry("RuinsofThundertree", "230,375,300,402", "lmop/the-spiders-web"),
        new MapInfoEntry("WyvernTor", "507,532,565,566", "lmop/the-spiders-web"),
        new MapInfoEntry("CragmawCastle", "277,467,344,506", "lmop/the-spiders-web"),
        new MapInfoEntry("Part4WaveEchoCave", "364,598,414,637", "lmop/wave-echo-cave")
    ]),
    new MapInfo("lmop/goblin-arrows", "lmop02.jpg", [
        new MapInfoEntry("1CaveMouth", "226,451,256,481"),
        new MapInfoEntry("2GoblinBlind", "395,423,425,453"),
        new MapInfoEntry("3Kennel", "423,309,453,339"),
        new MapInfoEntry("4SteepPassage", "343,159,373,189"),
        new MapInfoEntry("5Overpass", "434,77,464,107"),
        new MapInfoEntry("6GoblinDen", "112,167,142,197"),
        new MapInfoEntry("7TwinPoolsCave", "650,225,680,255"),
        new MapInfoEntry("8KlargsCave", "706,366,736,396")
    ]),
    new MapInfo("lmop/phandalin", "lmop03.jpg", [
        new MapInfoEntry("StonehillInn", "368,217,403,250"),
        new MapInfoEntry("BarthensProvisions", "420,147,464,195"),
        new MapInfoEntry("EdermathOrchard", "209,161,240,193"),
        new MapInfoEntry("LionshieldCoster", "270,288,314,329"),
        new MapInfoEntry("PhandalinMinersExchange", "263,379,294,409"),
        new MapInfoEntry("AlderleafFarm", "511,357,610,436"),
        new MapInfoEntry("ShrineofLuck", "316,224,341,247"),
        new MapInfoEntry("TheSleepingGiant", "510,232,537,256"),
        new MapInfoEntry("TownmastersHall", "345,288,385,316"),
        new MapInfoEntry("TresendarManor", "717,212,765,245"),
        new MapInfoEntry("ImportantNPCs", "294,203,323,220"),
        new MapInfoEntry("ImportantNPCs", "461,190,481,207"),
        new MapInfoEntry("ImportantNPCs", "217,295,245,316"),
        new MapInfoEntry("ImportantNPCs", "313,430,341,445"),
        new MapInfoEntry("ImportantNPCs", "439,321,467,340")
    ]),
    new MapInfo("lmop/phandalin", "lmop04.jpg", [
        new MapInfoEntry("1Cellar", "678,452,708,482"),
        new MapInfoEntry("2Barracks", "481,394,511,424"),
        new MapInfoEntry("3TrappedHall", "735,310,765,340"),
        new MapInfoEntry("4TresendarCrypts", "509,253,539,283"),
        new MapInfoEntry("5SlavePens", "594,168,624,198"),
        new MapInfoEntry("6Armory", "495,111,525,141"),
        new MapInfoEntry("7StoreroomandWorkArea", "340,111,370,141"),
        new MapInfoEntry("8Crevasse", "256,338,286,368"),
        new MapInfoEntry("9GuardBarracks", "114,479,144,509"),
        new MapInfoEntry("10CommonRoom", "113,282,143,312"),
        new MapInfoEntry("11WizardsWorkshop", "114,140,144,170"),
        new MapInfoEntry("12GlasstaffsQuarters", "199,111,229,141")
    ]),
    new MapInfo("lmop/the-spiders-web", "lmop05.jpg", [
        new MapInfoEntry("1WesternmostCottage", "85,168,115,198"),
        new MapInfoEntry("2BlightedCottages", "197,253,227,273"),
        new MapInfoEntry("3TheBrownHorse", "254,55,284,85"),
        new MapInfoEntry("4DruidsWatch", "197,394,227,424"),
        new MapInfoEntry("5BlightedFarmhouse", "311,480,341,510"),
        new MapInfoEntry("6RuinedStore", "452,367,482,397"),
        new MapInfoEntry("7DragonsTower", "424,55,454,85"),
        new MapInfoEntry("8OldSmithy", "508,450,538,480"),
        new MapInfoEntry("9HerbalistsShop", "592,367,622,397"),
        new MapInfoEntry("10TownSquare", "621,168,651,198"),
        new MapInfoEntry("11OldGarrison", "706,83,736,113"),
        new MapInfoEntry("12WeaversCottage", "649,253,679,283"),
        new MapInfoEntry("13DragonCultists", "733,450,763,480")
    ]),
    new MapInfo("lmop/the-spiders-web", "lmop06.jpg", [
        new MapInfoEntry("1CastleEntrance", "99,309,129,339"),
        new MapInfoEntry("2TrappedHall", "206,254,236,284"),
        new MapInfoEntry("3ArcherPost", "153,390,183,420"),
        new MapInfoEntry("3ArcherPost", "126,200,156,230"),
        new MapInfoEntry("4RuinedBarracks", "180,417,210,447"),
        new MapInfoEntry("5Storeroom", "207,146,237,176"),
        new MapInfoEntry("6HobgoblinBarracks", "126,146,156,176"),
        new MapInfoEntry("7BanquetHall", "315,335,345,365"),
        new MapInfoEntry("8DarkHall", "342,227,372,257"),
        new MapInfoEntry("9GoblinShrine", "342,119,372,149"),
        new MapInfoEntry("10PosternGate", "315,471,345,501"),
        new MapInfoEntry("11RuinedTower", "450,146,480,176"),
        new MapInfoEntry("12GuardBarracks", "558,309,588,339"),
        new MapInfoEntry("13OwlbearTower", "531,417,561,447"),
        new MapInfoEntry("14KingsQuarters", "639,146,669,176")
    ]),
    new MapInfo("lmop/wave-echo-cave", "lmop07.jpg", [
        new MapInfoEntry("1CaveEntrance", "130,613,150,633"),
        new MapInfoEntry("2MineTunnels", "146,484,166,504"),
        new MapInfoEntry("3OldEntrance", "291,613,311,633"),
        new MapInfoEntry("4OldGuardroom", "243,677,263,697"),
        new MapInfoEntry("5AssayersOffice", "355,661,375,681"),
        new MapInfoEntry("6SouthBarracks", "291,500,311,520"),
        new MapInfoEntry("7RuinedStoreroom", "372,500,392,520"),
        new MapInfoEntry("8FungiCavern", "436,548,456,568"),
        new MapInfoEntry("9GreatCavern", "307,403,327,423"),
        new MapInfoEntry("10DarkPool", "82,242,102,262"),
        new MapInfoEntry("11NorthBarracks", "195,242,215,262"),
        new MapInfoEntry("12SmelterCavern", "372,275,392,295"),
        new MapInfoEntry("13StarryCavern", "484,403,504,423"),
        new MapInfoEntry("14WizardsQuarters", "533,437,553,457"),
        new MapInfoEntry("15ForgeofSpells", "516,337,536,357"),
        new MapInfoEntry("16BoomingCavern", "452,146,472,166"),
        new MapInfoEntry("17OldStreambed", "285,73,305,93"),
        new MapInfoEntry("18CollapsedCavern", "210,162,230,182"),
        new MapInfoEntry("19TempleofDumathoin", "66,97,86,117"),
        new MapInfoEntry("20PriestsQuarters", "130,65,150,85")
    ])
];

const HotDQ = [
    new MapInfo("hotdq/dragon-hatchery", "episode-3-dragon-hatchery.jpg", [
        new MapInfoEntry("1CaveEntrance", "108,305,138,335"),
        new MapInfoEntry("2ConcealedPassage", "258,444,288,474"),
        new MapInfoEntry("3FungusGarden", "388,350,418,380"),
        new MapInfoEntry("4StirgeLair", "584,243,614,273"),
        new MapInfoEntry("5TroglodyteIncursion", "646,112,676,142"),
        new MapInfoEntry("6MeatLocker", "723,300,753,330"),
        new MapInfoEntry("7DrakeNursery", "473,162,503,192"),
        new MapInfoEntry("8KoboldBarracks", "271,169,301,199"),
        new MapInfoEntry("9DragonShrine", "502,412,532,442"),
        new MapInfoEntry("10DragonHatchery", "693,410,723,440"),
        new MapInfoEntry("10ABlackDragonEggs", "694,496,724,526"),
        new MapInfoEntry("10BKoboldsinHiding", "790,442,820,472"),
        new MapInfoEntry("11FrulamMondathsChamber", "322,529,352,559"),
        new MapInfoEntry("12GuardBarracks", "161,540,191,570"),
        new MapInfoEntry("13TreasureStorage", "89,443,119,473")
    ])
];

const allMaps = [].concat(LMoP).concat(HotDQ);

class Maps {
    static get maps() {
        return allMaps;
    }
}

export default Maps;