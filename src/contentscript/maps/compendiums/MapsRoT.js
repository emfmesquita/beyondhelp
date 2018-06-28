import MapAreaInfo from "../MapAreaInfo";
import MapInfo from "../MapInfo";
import MapRefs from "../MapRefs";
import MapToMapAreaInfo from "../MapToMapAreaInfo";

const maps = [
    new MapInfo("IceCaves", "the-sea-of-moving-ice", "rot-02-03.jpg", "e3fea37a-8d3e-4a7c-9a51-a780b8bf643e", [
        new MapAreaInfo("1EntrancefromHut", "444,190,474,220"),
        new MapAreaInfo("2EntrancefromtheVillageHall", "275,258,305,288"),
        new MapAreaInfo("3Larder", "300,323,330,353"),
        new MapAreaInfo("4KoboldsDen", "398,294,428,324"),
        new MapAreaInfo("5JunkRoom", "326,246,356,276"),
        new MapAreaInfo("6TheChute", "370,363,400,393"),
        new MapAreaInfo("7HallofGiants", "339,142,369,172"),
        new MapAreaInfo("8TrophyHall", "456,411,486,441"),
        new MapAreaInfo("9UnusedChamber", "222,407,252,437"),
        new MapAreaInfo("10MaccaththeCrimson", "87,343,117,373"),
        new MapAreaInfo("11Scriptorium", "88,290,118,320"),
        new MapAreaInfo("12IceTrolls", "139,235,169,265"),
        new MapAreaInfo("13IceToadWorkplace", "189,194,219,224"),
        new MapAreaInfo("14IceToadLair", "154,157,184,187"),
        new MapAreaInfo("15ScragsLair", "475,540,505,570"),
        new MapAreaInfo("16IcePillars", "410,695,440,725"),
        new MapAreaInfo("17TheIcewolfsSpine", "336,635,366,665"),
        new MapAreaInfo("18aTheGullet", "278,619,308,649"),
        new MapAreaInfo("18bTheThroat", "316,679,346,709"),
        new MapAreaInfo("19ThePerch", "209,550,239,580"),
        new MapAreaInfo("20ArauthatorsAbyss", "98,665,128,695")
    ], ["#GeneralFeatures", "#AreasoftheCaves", "#RandomEncounters[data-content-chunk-id='34c6bfea-0aee-4252-b97c-6f110a1a193b']",
            "#ArauthatorsLair", "#GeneralFeatures[data-content-chunk-id='efc979a9-3dd3-4074-9a82-5e9d6c8ed4d8']",
            "#AreasoftheLair", "#Developments", "#LeavingOyaviggaton", "#ArauthatorsTreasure", "#Conclusion"]),
    new MapInfo("TombofDiderius", "death-to-the-wyrmspeakers", "rot-03-02.jpg", "d50b8095-dbcb-47ea-91d2-2611447ee518", [
        new MapAreaInfo("1EntrancePlaza", "217,160,247,190"),
        new MapAreaInfo("2Antechamber", "277,159,307,189"),
        new MapAreaInfo("3WatchfulStatues", "375,161,405,191"),
        new MapAreaInfo("4MosaicChamber", "483,167,513,197"),
        new MapAreaInfo("5WellChamber", "473,77,503,107"),
        new MapAreaInfo("6Hallway", "449,224,479,254"),
        new MapAreaInfo("7ThroneRoomAntechamber", "356,328,386,358"),
        new MapAreaInfo("8ThroneRoom", "465,363,495,393"),
        new MapAreaInfo("9StudyandLibrary", "355,401,385,431"),
        new MapAreaInfo("10DiningHall", "516,253,546,283"),
        new MapAreaInfo("11TreasureVault", "354,235,384,265"),
        new MapAreaInfo("12DivinationPool", "602,151,632,181"),
        new MapAreaInfo("13CryptofDiderius", "664,150,694,180"),
        new MapAreaInfo("14Entryway", "781,142,811,172"),
        new MapAreaInfo("15Bridge", "770,263,800,293"),
        new MapAreaInfo("16MeditationChamber", "763,464,793,494"),
        new MapAreaInfo("17YuantiQuarters", "641,412,671,442"),
        new MapAreaInfo("18LongHallway", "691,362,721,392"),
        new MapAreaInfo("19Hatchery", "662,242,692,272"),
        new MapAreaInfo("20LizardfolkDen", "572,325,602,355"),
        new MapAreaInfo("21Prison", "623,512,653,542"),
        new MapAreaInfo("22Temple", "493,476,523,506"),
        new MapAreaInfo().rho(442, 258, 462, 278).content("ddae9317-6ced-4619-a8ed-7729e2cdf8b1"), // 6 - secret
        new MapAreaInfo().rho(726, 146, 746, 166).content("79478adc-b8de-4a36-8435-315bec5615f5"), // 13 - secret
        new MapAreaInfo().rho(666, 518, 686, 538).content("78172d78-fbbd-45ee-9fa6-40357e193782"), // 17 - secret
        new MapAreaInfo().rho(458, 527, 478, 547).content("2890818c-083b-4cc5-90ae-1c4af7467337"), // 22 - secret
        new MapAreaInfo().rho(559, 435, 579, 455).content("2890818c-083b-4cc5-90ae-1c4af7467337") // 22 - secret
    ], ["#AreasoftheTomb", "#GeneralFeatures[data-content-chunk-id='45aaacdd-3ffa-4b73-bd1a-b00a4ff2819e']", "#Sstckal",
            "#GeneralFeatures[data-content-chunk-id='00e1e9f9-9e4f-4e2f-88e9-9c8190ac1097']", "#AreasoftheCavern",
            "#Conclusion[data-content-chunk-id='bb9b7258-1523-4dd3-b7bf-7ebe94fe1cdb']"]),
    new MapInfo("NeronvainsStronghold", "death-to-the-wyrmspeakers", "rot-03-05.jpg", "0b02d7d7-9d5c-4700-a8a2-e12ba1dd5f91", [
        new MapAreaInfo("1Pool", "63,53,93,83"),
        new MapAreaInfo("2IslandChamber", "309,296,339,326"),
        new MapAreaInfo("3EttinLair", "120,323,150,353"),
        new MapAreaInfo("4ElfQuarters", "256,459,286,489"),
        new MapAreaInfo("5CultistCommonRoom", "446,161,476,191"),
        new MapAreaInfo("6CultistQuarters", "352,147,382,177"),
        new MapAreaInfo("7Storeroom", "609,81,639,111"),
        new MapAreaInfo("8NeronvainsChambers", "556,241,586,271"),
        new MapAreaInfo("9SecretPassage", "606,308,636,338"),
        new MapAreaInfo("10ChuthsLair", "677,445,707,475"),
        new MapAreaInfo().rho(160, 227, 190, 257).content("849a5c01-7756-480b-8e40-f2014efc1e22"), // 2 - secret
        new MapAreaInfo().rho(641, 338, 671, 368).content("849a5c01-7756-480b-8e40-f2014efc1e22"), // 9 - secret
        new MapAreaInfo().rho(584, 278, 614, 308).content("fa753c7c-aaad-4cda-b38d-7eabf7c3a670") // 8 - secret
    ], ["#AreasoftheStronghold", "#GeneralFeatures[data-content-chunk-id='42b421c6-c9fa-4ac4-a44e-ae0b221aeffe']",
            "#Conclusion[data-content-chunk-id='6b340ee5-bb5b-488c-925d-268005a1c662']"]),
    new MapInfo("Episode7XonthalsTower", "xonthals-tower", "rot-06-02.jpg", "a7c8ecd1-3af5-49ca-b5ce-da5944d824cd", [
        new MapAreaInfo("1TheSundial", "128,69,153,94"),
        new MapAreaInfo("2ChuulPool", "185,183,210,208"),
        new MapAreaInfo("3CyclopesPasture", "438,185,463,210"),
        new MapAreaInfo("4CarnivorousGarden", "384,385,409,410"),
        new MapAreaInfo("5Pagoda", "37,416,62,441"),
        new MapAreaInfo("6StatueGallery", "70,265,95,290"),
        new MapAreaInfo("7GorgonMaze", "193,351,218,376"),
        new MapAreaInfo("8AudienceChamber", "247,494,272,519"),
        new MapAreaInfo("9ClosedChambers", "80,465,105,490"),
        new MapAreaInfo("10Shrine", "78,593,103,618"),
        new MapAreaInfo("11Lounge", "196,620,221,645"),
        new MapAreaInfo("12Observatory", "199,752,224,777"),
        new MapAreaInfo("13Bedroom", "82,740,107,765"),
        new MapAreaInfo("14DungeonTeleporter", "324,734,349,759"),
        new MapAreaInfo("15ElementalCheckpoint", "422,733,447,758"),
        new MapAreaInfo("16Laboratory", "341,663,366,688"),
        new MapAreaInfo("17CosmicHallway", "401,585,426,610"),
        new MapAreaInfo("18Study", "444,598,469,623"),
        new MapAreaInfo("19ObservationRoom", "500,638,525,663"),
        new MapAreaInfo("20SpellbookStudy", "506,539,531,564"),
        new MapAreaInfo("21StorageCloset", "408,455,433,480"),
        new MapAreaInfo("22TaraztheFair", "488,473,513,498"),
        new MapAreaInfo("23TimeChamber", "340,508,365,533"),
        new MapAreaInfo().rho(223, 544, 238, 559).content("718bd34b-a401-452a-b234-138d595351b1", "96c9d478-d055-46e1-b5d0-a2e678d3fb12"),// 8 - Teleport Circles
        new MapAreaInfo().rho(84, 503, 99, 518).content("718bd34b-a401-452a-b234-138d595351b1", "96c9d478-d055-46e1-b5d0-a2e678d3fb12"), // 9 - Teleport Circles
        new MapAreaInfo().rho(85, 662, 100, 677).content("718bd34b-a401-452a-b234-138d595351b1", "96c9d478-d055-46e1-b5d0-a2e678d3fb12"),// 10 - Teleport Circles
        new MapAreaInfo().rho(264, 626, 279, 641).content("718bd34b-a401-452a-b234-138d595351b1", "96c9d478-d055-46e1-b5d0-a2e678d3fb12"),// 11 - Teleport Circles
        new MapAreaInfo().rho(257, 739, 272, 754).content("718bd34b-a401-452a-b234-138d595351b1", "96c9d478-d055-46e1-b5d0-a2e678d3fb12"),// 12 - Teleport Circles
        new MapAreaInfo().rho(86, 770, 101, 787).content("718bd34b-a401-452a-b234-138d595351b1", "96c9d478-d055-46e1-b5d0-a2e678d3fb12"),// 13 - Teleport Circles
        new MapAreaInfo().rho(326, 761, 346, 781).content("718bd34b-a401-452a-b234-138d595351b1", "96c9d478-d055-46e1-b5d0-a2e678d3fb12"),// 14 - Teleport Circles
        new MapAreaInfo().rho(474, 576, 494, 596).content("baa4e830-b0b4-4861-ada2-25cfe767fb0c", "0ba29448-039a-4dd5-87d8-101c71b44424"), // 18 - secret
        new MapAreaInfo().rho(480, 617, 500, 637).content("baa4e830-b0b4-4861-ada2-25cfe767fb0c", "0ba29448-039a-4dd5-87d8-101c71b44424") // 18 - secret
    ], ["#TheMaze", "#GeneralFeatures[data-content-chunk-id='0df472e1-8e5c-4467-83f4-d88c520480ce']", "#RescueMission",
            "#TheTower", "#GeneralFeatures[data-content-chunk-id='48f3bf14-d9ff-42b2-9784-c824fd5b3657']",
            "#Dungeon", "#GeneralFeatures[data-content-chunk-id='54e1f60d-a25b-4728-88fe-b2f87f955e0a']",
            "#ExitingXonthalsTower", "#Conclusion"]).chMap(),
    new MapInfo("TheWellofDragons", "tiamats-return", "rot-08-02.jpg", "52a8065e-eaa7-4758-b0d0-b87395d35d3b", [
        new MapAreaInfo("1A1B1CNorthEntrances", "63,99,83,119"),
        new MapAreaInfo("1A1B1CNorthEntrances", "371,89,391,109"),
        new MapAreaInfo("1A1B1CNorthEntrances", "459,168,479,188"),
        new MapAreaInfo("2A2B2CEastEntrances", "509,243,529,263"),
        new MapAreaInfo("2A2B2CEastEntrances", "527,407,547,427"),
        new MapAreaInfo("2A2B2CEastEntrances", "485,743,505,763"),
        new MapAreaInfo("3ForgottenEntrance", "213,702,233,722"),
        new MapAreaInfo("4NaergothBladelordsChamber", "219,156,239,176"),
        new MapAreaInfo("5UnusedChamber", "260,123,280,143"),
        new MapAreaInfo("6MainTreasureChamber", "115,245,135,265"),
        new MapAreaInfo("7SecondaryTreasureChamber", "72,362,92,382"),
        new MapAreaInfo("8TheDraakhorn", "66,459,86,479"),
        new MapAreaInfo("9PlanningRoom", "320,211,340,231"),
        new MapAreaInfo("10LeadersQuarters", "379,219,399,239"),
        new MapAreaInfo("11SeverinsQuarters", "387,260,407,280"),
        new MapAreaInfo("1213HighRankingCultistsChambers", "482,445,502,465"),
        new MapAreaInfo("1213HighRankingCultistsChambers", "463,487,483,507"),
        new MapAreaInfo("14PrisonersEffects", "439,594,459,614"),
        new MapAreaInfo("15LowRankingCultistsChamber", "409,648,429,668"),
        new MapAreaInfo("161718PrisonerPens", "403,581,423,601"),
        new MapAreaInfo("161718PrisonerPens", "356,541,376,561"),
        new MapAreaInfo("161718PrisonerPens", "311,501,331,521"),
        new MapAreaInfo("19DrakePens", "359,640,379,660"),
        new MapAreaInfo("2021RedWizardsQuarters", "270,664,290,684"),
        new MapAreaInfo("2021RedWizardsQuarters", "279,599,299,619"),
        new MapAreaInfo("22Sinkhole", "242,534,262,554"),
        new MapAreaInfo("23NorthernExits", "255,254,275,274"),
        new MapAreaInfo("23NorthernExits", "353,267,373,287"),
        new MapAreaInfo("24TempleExit", "261,424,281,444"),
        new MapToMapAreaInfo("rot-08-04.jpg", "307,386,20")
    ], ["#LavaTubesandWarrens", "#GeneralFeatures[data-content-chunk-id='cf80f0a2-889c-46d5-9962-daf34a2d8e9c']", "#WithintheWellofDragons"]),
    new MapInfo("TiamatsTemple", "tiamats-return", "rot-08-04.jpg", "23ce74de-a7f5-42ce-ba6a-aa676dd240c6", [
        new MapAreaInfo("KeytoTiamatsTemple", "336,90,356,110"),
        new MapAreaInfo("KeytoTiamatsTemple", "295,275,315,295"),
        new MapAreaInfo("KeytoTiamatsTemple", "431,187,451,207"),
        new MapAreaInfo("KeytoTiamatsTemple", "444,419,464,439"),
        new MapAreaInfo("KeytoTiamatsTemple", "150,392,170,412"),
        new MapAreaInfo("KeytoTiamatsTemple", "129,180,149,200"),
        new MapAreaInfo("KeytoTiamatsTemple", "204,635,224,655"),
        new MapAreaInfo("KeytoTiamatsTemple", "216,555,236,575"),
        new MapAreaInfo("KeytoTiamatsTemple", "285,583,305,603"),
        new MapAreaInfo("KeytoTiamatsTemple", "311,700,331,720"),
        new MapAreaInfo("KeytoTiamatsTemple", "122,698,142,718"),
        new MapAreaInfo("KeytoTiamatsTemple", "119,627,139,647"),
        new MapAreaInfo("KeytoTiamatsTemple", "463,567,483,587"),
        new MapToMapAreaInfo("rot-08-02.jpg", "233,379,10"),
        new MapToMapAreaInfo("rot-08-02.jpg", "296,68,10")
    ], ["#TheTempleofTiamat", "#TempleLayout", "#PerformingtheRitual"])
];

class MapsRoT extends MapRefs {
    static get path() {
        return "adventures/rot/";
    }

    static get maps() {
        return maps;
    }

    static get extraMapLinks() {
        return [];
    }
}

export default MapsRoT;