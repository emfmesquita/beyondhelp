import MapAreaInfo from "../MapAreaInfo";
import MapInfo from "../MapInfo";
import MapRefs from "../MapRefs";

const maps = [
    new MapInfo("TheForgottenRealms", "lmop/introduction", "lmop01.jpg", "ae56f101-0094-492f-95d7-11d9884069a0", [
        new MapAreaInfo("Part1GoblinArrows", "113,381,184,422", "lmop/goblin-arrows"),
        new MapAreaInfo("CragmawHideout", "243,547,292,593", "lmop/goblin-arrows"),
        new MapAreaInfo("Part2Phandalin", "301,626,360,660", "lmop/phandalin"),
        new MapAreaInfo("TriboarTrail", "363,497,405,532", "lmop/the-spiders-web"),
        new MapAreaInfo("ConyberryandAgathasLair", "429,401,557,459", "lmop/the-spiders-web"),
        new MapAreaInfo("OldOwlWell", "503,476,559,509", "lmop/the-spiders-web"),
        new MapAreaInfo("RuinsofThundertree", "230,375,300,402", "lmop/the-spiders-web"),
        new MapAreaInfo("WyvernTor", "507,532,565,566", "lmop/the-spiders-web"),
        new MapAreaInfo("CragmawCastle", "277,467,344,506", "lmop/the-spiders-web"),
        new MapAreaInfo("Part4WaveEchoCave", "364,598,414,637", "lmop/wave-echo-cave")
    ]),
    new MapInfo("CragmawHideout", "lmop/goblin-arrows", "lmop02.jpg", "fa674c90-e57f-415d-abf2-bbb34a9a2ec8", [
        new MapAreaInfo("1CaveMouth", "226,451,256,481"),
        new MapAreaInfo("2GoblinBlind", "395,423,425,453"),
        new MapAreaInfo("3Kennel", "423,309,453,339"),
        new MapAreaInfo("4SteepPassage", "343,159,373,189"),
        new MapAreaInfo("5Overpass", "434,77,464,107"),
        new MapAreaInfo("6GoblinDen", "112,167,142,197"),
        new MapAreaInfo("7TwinPoolsCave", "650,225,680,255"),
        new MapAreaInfo("8KlargsCave", "706,366,736,396")
    ], ["#GeneralFeatures"]),
    new MapInfo("Part2Phandalin", "lmop/phandalin", "lmop03.jpg", "94bb7a72-912e-4fcc-8c16-cd48d3d888a2", [
        new MapAreaInfo("StonehillInn", "368,217,403,250"),
        new MapAreaInfo("BarthensProvisions", "420,147,464,195"),
        new MapAreaInfo("EdermathOrchard", "209,161,240,193"),
        new MapAreaInfo("LionshieldCoster", "270,288,314,329"),
        new MapAreaInfo("PhandalinMinersExchange", "263,379,294,409"),
        new MapAreaInfo("AlderleafFarm", "511,357,610,436"),
        new MapAreaInfo("ShrineofLuck", "316,224,341,247"),
        new MapAreaInfo("TheSleepingGiant", "510,232,537,256"),
        new MapAreaInfo("TownmastersHall", "345,288,385,316"),
        new MapAreaInfo("TresendarManor", "717,212,765,245"),
        new MapAreaInfo("ImportantNPCs", "294,203,323,220"),
        new MapAreaInfo("ImportantNPCs", "461,190,481,207"),
        new MapAreaInfo("ImportantNPCs", "217,295,245,316"),
        new MapAreaInfo("ImportantNPCs", "313,430,341,445"),
        new MapAreaInfo("ImportantNPCs", "439,321,467,340"),
        new MapAreaInfo("RedbrandHideout", "733,252,748,267", null, "871feea4-42a7-4301-a560-12276fce191b", false, true)
    ], ["#EncountersinPhandalin", "#TownDescription", "#RoleplayingPhandalinNPCs", "#RedbrandRuffians", "#Confrontation"]),
    new MapInfo("RedbrandHideout", "lmop/phandalin", "lmop04.jpg", "871feea4-42a7-4301-a560-12276fce191b", [
        new MapAreaInfo("1Cellar", "678,452,708,482"),
        new MapAreaInfo("2Barracks", "481,394,511,424"),
        new MapAreaInfo("3TrappedHall", "735,310,765,340"),
        new MapAreaInfo("4TresendarCrypts", "509,253,539,283"),
        new MapAreaInfo("5SlavePens", "594,168,624,198"),
        new MapAreaInfo("6Armory", "495,111,525,141"),
        new MapAreaInfo("7StoreroomandWorkArea", "340,111,370,141"),
        new MapAreaInfo("8Crevasse", "256,338,286,368"),
        new MapAreaInfo("9GuardBarracks", "114,479,144,509"),
        new MapAreaInfo("10CommonRoom", "113,282,143,312"),
        new MapAreaInfo("11WizardsWorkshop", "114,140,144,170"),
        new MapAreaInfo("12GlasstaffsQuarters", "199,111,229,141"),
        new MapAreaInfo("GeneralFeatures", "556,512,576,532", null, "e40ed89b-ab88-495d-a155-fdff84772c99"),
        new MapAreaInfo("GeneralFeatures", "441,88,461,108", null, "e40ed89b-ab88-495d-a155-fdff84772c99"),
        new MapAreaInfo("GeneralFeatures", "302,144,322,164", null, "e40ed89b-ab88-495d-a155-fdff84772c99"),
        new MapAreaInfo("GeneralFeatures", "274,88,294,108", null, "e40ed89b-ab88-495d-a155-fdff84772c99"),
        new MapAreaInfo("Part2Phandalin", "798,422,828,452", null, "94bb7a72-912e-4fcc-8c16-cd48d3d888a2", false, true)
    ], ["#GeneralFeatures"]),
    new MapInfo("RuinsofThundertree", "lmop/the-spiders-web", "lmop05.jpg", "1aef539a-51d4-4126-9015-dba35c5a6a28", [
        new MapAreaInfo("1WesternmostCottage", "85,168,115,198"),
        new MapAreaInfo("2BlightedCottages", "197,253,227,283"),
        new MapAreaInfo("3TheBrownHorse", "254,55,284,85"),
        new MapAreaInfo("4DruidsWatch", "197,394,227,424"),
        new MapAreaInfo("5BlightedFarmhouse", "311,480,341,510"),
        new MapAreaInfo("6RuinedStore", "452,367,482,397"),
        new MapAreaInfo("7DragonsTower", "424,55,454,85"),
        new MapAreaInfo("8OldSmithy", "508,450,538,480"),
        new MapAreaInfo("9HerbalistsShop", "592,367,622,397"),
        new MapAreaInfo("10TownSquare", "621,168,651,198"),
        new MapAreaInfo("11OldGarrison", "706,83,736,113"),
        new MapAreaInfo("12WeaversCottage", "649,253,679,283"),
        new MapAreaInfo("13DragonCultists", "733,450,763,480")
    ], ["#GeneralFeatures", "#AreasoftheRuins"]),
    new MapInfo("CragmawCastle", "lmop/the-spiders-web", "lmop06.jpg", "e439ffb6-c94a-4319-b207-75a414a85f0d", [
        new MapAreaInfo("1CastleEntrance", "99,309,129,339"),
        new MapAreaInfo("2TrappedHall", "206,254,236,284"),
        new MapAreaInfo("3ArcherPost", "153,390,183,420"),
        new MapAreaInfo("3ArcherPost", "126,200,156,230"),
        new MapAreaInfo("4RuinedBarracks", "180,417,210,447"),
        new MapAreaInfo("5Storeroom", "207,146,237,176"),
        new MapAreaInfo("6HobgoblinBarracks", "126,146,156,176"),
        new MapAreaInfo("7BanquetHall", "315,335,345,365"),
        new MapAreaInfo("8DarkHall", "342,227,372,257"),
        new MapAreaInfo("9GoblinShrine", "342,119,372,149"),
        new MapAreaInfo("10PosternGate", "315,471,345,501"),
        new MapAreaInfo("11RuinedTower", "450,146,480,176"),
        new MapAreaInfo("11RuinedTower", "457,70,477,90"),
        new MapAreaInfo("12GuardBarracks", "558,309,588,339"),
        new MapAreaInfo("13OwlbearTower", "531,417,561,447"),
        new MapAreaInfo("14KingsQuarters", "639,146,669,176")
    ], ["#GeneralFeatures[data-content-chunk-id='dc4878aa-5c53-46c8-b66e-5d6f5c6b0b3b']", "#AreasoftheCastle", "#ReturningWarBand"]),
    new MapInfo("Part4WaveEchoCave", "lmop/wave-echo-cave", "lmop07.jpg", "d9a00d84-9469-4e1f-a53a-933c54bf40ef", [
        new MapAreaInfo("1CaveEntrance", "130,613,150,633"),
        new MapAreaInfo("2MineTunnels", "146,484,166,504"),
        new MapAreaInfo("3OldEntrance", "291,613,311,633"),
        new MapAreaInfo("4OldGuardroom", "243,677,263,697"),
        new MapAreaInfo("5AssayersOffice", "355,661,375,681"),
        new MapAreaInfo("6SouthBarracks", "291,500,311,520"),
        new MapAreaInfo("7RuinedStoreroom", "372,500,392,520"),
        new MapAreaInfo("8FungiCavern", "436,548,456,568"),
        new MapAreaInfo("9GreatCavern", "307,403,327,423"),
        new MapAreaInfo("10DarkPool", "82,242,102,262"),
        new MapAreaInfo("11NorthBarracks", "195,242,215,262"),
        new MapAreaInfo("12SmelterCavern", "372,275,392,295"),
        new MapAreaInfo("13StarryCavern", "484,403,504,423"),
        new MapAreaInfo("14WizardsQuarters", "533,437,553,457"),
        new MapAreaInfo("15ForgeofSpells", "516,337,536,357"),
        new MapAreaInfo("16BoomingCavern", "452,146,472,166"),
        new MapAreaInfo("17OldStreambed", "285,73,305,93"),
        new MapAreaInfo("18CollapsedCavern", "210,162,230,182"),
        new MapAreaInfo("19TempleofDumathoin", "66,97,86,117"),
        new MapAreaInfo("20PriestsQuarters", "130,65,150,85")
    ], ["#CharacterLevel", "#ExperiencePointAwards", "#KeyedEncounters", "#WanderingMonsters", "#GeneralFeatures", "#Conclusion"])
];

class MapsLMoP extends MapRefs {
    static get path() {
        return "lmop/";
    }

    static get maps() {
        return maps;
    }

    static get extraMapLinks() {
        return [];
    }
}

export default MapsLMoP;