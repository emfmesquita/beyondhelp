import MapAreaInfo from "../MapAreaInfo";
import MapInfo from "../MapInfo";
import MapRefs from "../MapRefs";
import MapToMapAreaInfo from "../MapToMapAreaInfo";

const maps = [
    new MapInfo("Velkynvelve", "oota/prisoners-of-the-drow", "01-04.jpg", "f8534d91-4379-4e00-a779-9fc4ca970376", [
        new MapAreaInfo("1SouthernWatchPost", "124,489,144,509"),
        new MapAreaInfo("2Barracks", "222,510,242,530"),
        new MapAreaInfo("3MainHall", "296,407,316,427"),
        new MapAreaInfo("4EliteBarracks", "219,383,239,403"),
        new MapAreaInfo("4EliteBarracks", "173,423,193,443"),
        new MapAreaInfo("5Lift", "195,366,215,386"),
        new MapAreaInfo("6ShrinetoLolth", "256,318,276,338"),
        new MapAreaInfo("7IlvarasQuarters", "268,342,288,362"),
        new MapAreaInfo("8ShoorsQuarters", "279,318,299,338"),
        new MapAreaInfo("9Waterfall", "356,315,376,335"),
        new MapAreaInfo("10GuardTower", "347,258,367,278"),
        new MapAreaInfo("11SlavePen", "474,290,494,310"),
        new MapAreaInfo("12QuaggothDen", "498,184,518,204"),
        new MapAreaInfo("13NorthernWatchPost", "459,156,479,176"),
        new MapAreaInfo("14Pool", "386,189,406,209"),
        new MapAreaInfo("1SouthernWatchPost", "558,738,578,758"),
        new MapAreaInfo("2Barracks", "471,647,491,667"),
        new MapAreaInfo("4EliteBarracks", "512,701,532,721"),
        new MapAreaInfo("4EliteBarracks", "420,696,440,716"),
        new MapAreaInfo("5Lift", "448,770,468,790"),
        new MapAreaInfo("6ShrinetoLolth", "313,643,333,663"),
        new MapAreaInfo("7IlvarasQuarters", "314,680,334,700"),
        new MapAreaInfo("8ShoorsQuarters", "316,717,336,737"),
        new MapAreaInfo("9Waterfall", "264,717,284,737"),
        new MapAreaInfo("10GuardTower", "148,664,168,684"),
        new MapAreaInfo("11SlavePen", "102,670,122,690"),
        new MapAreaInfo("12QuaggothDen", "28,703,48,723"),
        new MapAreaInfo("13NorthernWatchPost", "28,776,48,796"),
        new MapAreaInfo("NorthPassage", "551,19,571,39"),
        new MapAreaInfo("WestPassage", "147,101,167,121"),
        new MapAreaInfo("SouthPassage", "60,552,80,572")
    ], ["#AreasofVelkynvelve", "#MeansofEscape", "#Acquisitions", "#JorlansGambit", "#AFlightofDemons",
            "#LeavingVelkynvelve", "#NorthPassage", "#WestPassage", "#SouthPassage", "#XPAwards"]),

    new MapInfo("UnderdarkTravel", "oota/into-darkness", "02-05.jpg", "760081cf-d4f8-483d-9c37-21f3ddfc5df3", [
        new MapToMapAreaInfo("01-04.jpg", "636,273,10"),
        new MapToMapAreaInfo("03-01.jpg", "590,242,10"),
        new MapToMapAreaInfo("04-01.jpg", "446,301,10"),
        new MapToMapAreaInfo("05-01.jpg", "406,235,10")
    ], []),
    new MapInfo("HookHorrorHunt", "oota/into-darkness", "02-06.jpg", "2b3dbc4a-424c-4866-919e-1cba67e36fd3", [
        new MapAreaInfo("1HookHorrors", "716,258,746,288"),
        new MapAreaInfo("2AGnollHunters", "664,201,694,231"),
        new MapAreaInfo("2BGnollHunters", "361,257,391,287"),
        new MapAreaInfo("3Cornered", "688,555,718,585"),
        new MapAreaInfo("4HookHorrorNest", "743,610,773,640"),
        new MapAreaInfo("5GnollCamp", "334,474,364,504"),
        new MapAreaInfo("HookHorrorHunt", "704,231,719,246", null, "d6aa7f38-4ec7-4667-8c1c-617010c5d017"),
        new MapAreaInfo("HookHorrorHunt", "711,305,726,320", null, "d6aa7f38-4ec7-4667-8c1c-617010c5d017"),
        new MapAreaInfo("HookHorrorHunt", "664,531,679,546", null, "d6aa7f38-4ec7-4667-8c1c-617010c5d017"),
        new MapAreaInfo("HookHorrorHunt", "575,237,590,252", null, "d6aa7f38-4ec7-4667-8c1c-617010c5d017"),
        new MapAreaInfo("HookHorrorHunt", "544,238,559,253", null, "d6aa7f38-4ec7-4667-8c1c-617010c5d017"),
        new MapAreaInfo("HookHorrorHunt", "523,452,538,467", null, "d6aa7f38-4ec7-4667-8c1c-617010c5d017"),
        new MapAreaInfo("HookHorrorHunt", "497,460,512,475", null, "d6aa7f38-4ec7-4667-8c1c-617010c5d017"),
        new MapAreaInfo("HookHorrorHunt", "371,172,386,187", null, "d6aa7f38-4ec7-4667-8c1c-617010c5d017"),
        new MapAreaInfo("HookHorrorHunt", "366,210,381,225", null, "d6aa7f38-4ec7-4667-8c1c-617010c5d017"),
        new MapAreaInfo("3Cornered", "717,587,734,604", null, "c3072947-7867-4f19-aa85-6d822634eaf7")
    ], []),
    new MapInfo("TheOozingTemple", "oota/into-darkness", "02-07.jpg", "5ca5abee-b6e6-4e07-b76c-8f6fc1e02df3", [
        new MapAreaInfo("1BoxedIn", "307,622,332,647"),
        new MapAreaInfo("2DrippingDeath", "166,473,191,498"),
        new MapAreaInfo("2DrippingDeath", "89,67,114,92"),
        new MapAreaInfo("2DrippingDeath", "426,310,451,335"),
        new MapAreaInfo("3Glabbagool", "141,391,166,416"),
        new MapAreaInfo("4PuddingPits", "360,175,385,200"),
        new MapAreaInfo("4PuddingPits", "334,146,359,171"),
        new MapAreaInfo("4PuddingPits", "361,119,386,144"),
        new MapAreaInfo("4PuddingPits", "332,90,357,115"),
        new MapAreaInfo("5FountainofMadness", "263,336,288,361"),
        new MapAreaInfo("6WaterChamber", "564,257,589,282")
    ], []),
    new MapInfo("LostTombofKhaem", "oota/into-darkness", "02-08.jpg", "ab500804-4ea4-4959-bbcb-464db9c7b748", [
        new MapAreaInfo("1EntranceRoom", "107,132,132,157"),
        new MapAreaInfo("2Shrine", "432,296,457,321"),
        new MapAreaInfo("3ServantsSarcophagi", "596,320,621,345"),
        new MapAreaInfo("4FalseTomb", "433,507,458,532"),
        new MapAreaInfo("5TrueTomb", "736,506,761,531")
    ], []),
    new MapInfo("Sloobludop", "oota/the-darklake", "03-01.jpg", "7b389063-80db-4e10-ae3b-2bb1e836c511", [
        new MapAreaInfo("1Gate", "18,325,48,355"),
        new MapAreaInfo("1Gate", "814,342,844,372"),
        new MapAreaInfo("2Docks", "572,171,602,201"),
        new MapAreaInfo("2Docks", "168,170,198,200"),
        new MapAreaInfo("3ShrineoftheSeaMother", "475,396,505,426"),
        new MapAreaInfo("4AltaroftheDeepFather", "389,285,419,315")
    ], ["#SlouchingTowardSloobludop", "#NotableKuotoainSloobludop", "#TheDaysCatch", "#TheOffering", "#TheRitual", "#DemogorgonRises", "#XPAwards"]),
    new MapInfo("Gracklstugh", "oota/gracklstugh", "04-01.jpg", "719b0f54-fecb-4fa6-b645-dfb7e331ecdd", [
        new MapAreaInfo("CityGates", "53,151,73,171"),
        new MapAreaInfo("CityGates", "209,539,229,559"),
        new MapAreaInfo("CityGates", "241,589,261,609"),
        new MapAreaInfo("CityGates", "309,605,329,625"),
        new MapAreaInfo("CityGates", "735,549,755,569"),
        new MapAreaInfo("CityGates", "704,371,724,391"),
        new MapAreaInfo("CityGates", "731,273,751,293"),
        new MapAreaInfo("CityGates", "728,175,748,195"),
        new MapAreaInfo("CityGates", "727,118,747,138"),
        new MapAreaInfo(null, "385,135,451,155", null, "31e45e23-afbc-4fa8-b945-c3301592b9a6"),
        new MapAreaInfo(null, "451,135,517,155", null, "957ae86b-8de3-4aaa-9901-3aa92efd7f1a"),
        new MapAreaInfo("DarklakeDistrict", "366,205,528,248"),
        new MapAreaInfo("BladeBazaar", "501,177,557,201"),
        new MapAreaInfo("DarklakeBrewery", "641,91,718,118"),
        new MapAreaInfo("OverlakeHold", "588,178,663,205"),
        new MapAreaInfo("TheShatteredSpire", "202,126,290,161"),
        new MapAreaInfo("TheGhohlbrornsLair", "531,233,598,254"),
        new MapAreaInfo("LaduguersFurrow", "303,343,529,389"),
        new MapAreaInfo("WestCleftandEastCleftDistricts", "59,281,156,334"),
        new MapAreaInfo("WestCleftandEastCleftDistricts", "688,415,781,470"),
        new MapAreaInfo("HallsofSacredSpells", "58,231,177,270"),
        new MapAreaInfo("CairngormCavern", "100,448,265,464"),
        new MapAreaInfo("ThemberchaudsLair", "512,565,654,629"),
        new MapAreaInfo("HoldoftheDeepking", "522,425,602,464"),
        new MapAreaInfo("GreatGates", "167,301,187,351"),
        new MapAreaInfo("GreatGates", "619,394,639,444"),
        new MapAreaInfo("AbandonedGuardhouses", "190,312,230,337"),
        new MapAreaInfo("AccesstotheWhorlstoneTunnels", "39,276,49,286"),
        new MapToMapAreaInfo("04-03.jpg", "44,268,5")
    ], ["#WelcometotheCityofBlades", "#RampagingGiant", "#GuestsoftheStoneGuard", "#DarklakeDocks[data-content-chunk-id='31e45e23-afbc-4fa8-b945-c3301592b9a6']",
            "#DarklakeDocks[data-content-chunk-id='957ae86b-8de3-4aaa-9901-3aa92efd7f1a']", "#EnteringDerroTerritory",
            "#AudiencewiththeStonespeaker", "#AgentsoftheWyrmsmith", "#LeavingGracklstugh", "#AudiencewiththeDeepking"]),
    new MapInfo("WhorlstoneTunnels", "oota/gracklstugh", "04-03.jpg", "340e1c98-a857-4950-b50e-dcf6c3e55c0a", [
        new MapAreaInfo("1Entrance", "88,351,108,371"),
        new MapAreaInfo("1aPoolBypass", "110,322,130,342"),
        new MapAreaInfo("1bBuppidosLair", "155,382,175,402"),
        new MapAreaInfo("2DiseasedPool", "184,348,204,368"),
        new MapAreaInfo("3ParadeofFools", "250,356,270,376"),
        new MapAreaInfo("4FungiThicket", "317,347,337,367"),
        new MapAreaInfo("5RaucousMesa", "399,310,419,330"),
        new MapAreaInfo("6DireDen", "479,209,499,229"),
        new MapAreaInfo("7GrayGhostGarden", "424,250,444,270"),
        new MapAreaInfo("8GrayAlchemist", "411,204,431,224"),
        new MapAreaInfo("9FountainofEvil", "378,154,398,174"),
        new MapAreaInfo("10CultistPens", "264,154,284,174"),
        new MapAreaInfo("11QuasitPlayground", "223,184,243,204"),
        new MapAreaInfo("12CultistHideout", "176,229,196,249"),
        new MapAreaInfo("13DumpingPit", "265,76,285,96"),
        new MapAreaInfo("14Obelisk", "458,47,478,67"),
        new MapAreaInfo("14aFungiCoveredDoors", "392,11,422,31"),
        new MapAreaInfo("6DireDen", "290,615,310,635"),
        new MapAreaInfo("7GrayGhostGarden", "537,562,557,582"),
        new MapAreaInfo("8GrayAlchemist", "417,501,437,521"),
        new MapAreaInfo("10CultistPens", "133,753,153,773"),
        new MapAreaInfo("12CultistHideout", "509,712,529,732"),
        new MapAreaInfo("14Obelisk", "163,495,183,515"),
        new MapAreaInfo("FungiPit", "535,588,572,618"),
        new MapAreaInfo("SprinklerTank", "519,575,534,595"),
        new MapAreaInfo("Crates", "534,547,559,558"),
        new MapAreaInfo("SpiralPath", "37,741,119,795"),
        new MapAreaInfo("Trap", "267,750,324,776"),
        new MapAreaInfo("FungiPatches", "354,722,415,737"),
        new MapAreaInfo("Platform", "466,759,525,818"),
        new MapAreaInfo("Obelisk", "79,526,104,551"),
        new MapAreaInfo("RedDragonEgg", "209,508,224,523"),
        new MapToMapAreaInfo("04-01.jpg", "14,377,10")
    ], ["#AreasoftheTunnels"]),
    new MapInfo("NeverlightGrove", "oota/neverlight-grove", "05-01.jpg", "c1a16556-369d-4598-af7a-dd06230f1040", [
        new MapAreaInfo("1FungalWilds", "339,480,369,510"),
        new MapAreaInfo("2NorthernTerraces", "260,198,290,228"),
        new MapAreaInfo("3CentralBasin", "374,361,404,391"),
        new MapAreaInfo("4SouthernTerraces", "490,516,520,546"),
        new MapAreaInfo("5GardenofWelcome", "504,338,534,368"),
        new MapAreaInfo("Yggmorgus", "594,93,777,145")
    ], ["#WeddingRehearsal", "#GiantMushroomTower", "#LeavingNeverlightGrove"])
];

const extraMapLinks = [];

MapRefs.processMapToMapRefs(maps);

class MapsOotA extends MapRefs {
    static get path() {
        return "oota/";
    }

    static get maps() {
        return maps;
    }

    static get extraMapLinks() {
        return extraMapLinks;
    }
}

export default MapsOotA;