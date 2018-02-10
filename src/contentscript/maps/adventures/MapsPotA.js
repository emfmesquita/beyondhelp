import MapAreaInfo from "../MapAreaInfo";
import MapInfo from "../MapInfo";
import MapRefs from "../MapRefs";
import MapLinksInfo from "../MapLinksInfo";

const maps = [
    new MapInfo("pota/the-dessarin-valley", "02-02.jpg", "e29f8904-2e95-4794-b7a3-e70ef71ce0b2", [
        new MapAreaInfo("1AllfaithsShrine", "339,244,364,269"),
        new MapAreaInfo("2TheSwingingSword", "311,193,336,218"),
        new MapAreaInfo("3TheHelmatHighsun", "533,148,558,173"),
        new MapAreaInfo("4MotherYalanthas", "527,233,552,258"),
        new MapAreaInfo("5ThelornsSafeJourneys", "468,160,493,185"),
        new MapAreaInfo("6ChansyrlFineHarness", "269,161,294,186"),
        new MapAreaInfo("7HelvurTarnlarClothier", "483,239,508,264"),
        new MapAreaInfo("8LorrensBakery", "321,134,346,159"),
        new MapAreaInfo("9TanturSmithy", "632,231,657,256"),
        new MapAreaInfo("10DrouthFinePoultry", "317,304,342,329"),
        new MapAreaInfo("11JalessaOrnraButcher", "355,337,380,362"),
        new MapAreaInfo("12DornenFinestone", "360,388,385,413"),
        new MapAreaInfo("13IronheadArms", "474,389,499,414"),
        new MapAreaInfo("14MhandyvversPoultry", "352,439,377,464"),
        new MapAreaInfo("15Haeleeyas", "355,113,380,138"),
        new MapAreaInfo("16WaelvursWagonworks", "501,336,526,361"),
        new MapAreaInfo("17Gaelkurs", "570,159,595,184"),
        new MapAreaInfo("18MellikhoStoneworks", "353,33,378,58"),
        new MapAreaInfo("19LuruthsTannery", "368,470,393,495"),
        new MapAreaInfo("20BethendursStorage", "482,452,507,477"),
        new MapAreaInfo("21TheMarket", "609,475,634,500"),
        new MapAreaInfo("22VallivoesSundries", "524,511,549,536")
    ], ["#RedLarch", "#ImportantRedLarchers", "#TheBelievers", "#AdventureinRedLarch",
            "#RumorsofEvil", "#RedLarchLocations", "#ScandalandRebuilding"]),
    new MapInfo("pota/the-dessarin-valley", "02-01.jpg", "fe5bf95b-c3b5-4881-9866-ba6bb7b8bc68", [
        new MapAreaInfo("Amphail", "130,991,148,1009"),
        new MapAreaInfo("Amphail", "147,979,208,1002"),
        new MapAreaInfo("BargewrightInn", "349,867,367,885"),
        new MapAreaInfo("BargewrightInn", "271,854,352,885"),
        new MapAreaInfo("Beliard", "487,529,505,547"),
        new MapAreaInfo("Beliard", "503,541,552,556"),
        new MapAreaInfo("CultEncampments", "559,413,577,431"),
        new MapAreaInfo("CultEncampments", "504,391,565,427"),
        new MapAreaInfo("CultEncampments", "340,807,358,825"),
        new MapAreaInfo("CultEncampments", "336,774,393,806"),
        new MapAreaInfo("Goldenfields", "323,995,341,1013"),
        new MapAreaInfo("Goldenfields", "256,979,340,995"),
        new MapAreaInfo("HallsoftheHuntingAxe", "547,610,565,628"),
        new MapAreaInfo("HallsoftheHuntingAxe", "524,575,609,610"),
        new MapAreaInfo("FeathergaleSpire", "318,660,336,678"),
        new MapAreaInfo("FeathergaleSpire", "293,680,360,695"),
        new MapAreaInfo("FeathergaleSpire", "311,694,342,709"),
        new MapAreaInfo("SacredStoneMonastery", "393,680,411,698"),
        new MapAreaInfo("SacredStoneMonastery", "379,700,453,729"),
        new MapAreaInfo("ScarletMoonHall", "377,639,395,657"),
        new MapAreaInfo("ScarletMoonHall", "311,630,373,654"),
        new MapAreaInfo("RivergardKeep", "425,643,443,661"),
        new MapAreaInfo("RivergardKeep", "425,662,482,692"),
        new MapAreaInfo("HelvenbladeHouse", "238,359,256,377"),
        new MapAreaInfo("HelvenbladeHouse", "173,339,256,369"),
        new MapAreaInfo("HighForest", "706,613,817,693"),
        new MapAreaInfo("KryptgardenForest", "45,384,199,457"),
        new MapAreaInfo("LanceRock", "200,696,218,714"),
        new MapAreaInfo("LanceRock", "160,700,200,731"),
        new MapAreaInfo("RundrethManor", "175,935,193,953"),
        new MapAreaInfo("RundrethManor", "187,918,250,949"),
        new MapAreaInfo("StoneBridge", "446,514,464,532"),
        new MapAreaInfo("StoneBridge", "450,487,514,520"),
        new MapAreaInfo("SumberHills", "295,490,384,552"),
        new MapAreaInfo("SummitHall", "520,682,538,700"),
        new MapAreaInfo("SummitHall", "532,666,585,696"),
        new MapAreaInfo("Triboar", "292,163,310,181"),
        new MapAreaInfo("Triboar", "306,150,354,163"),
        new MapAreaInfo("ValeofDancingWaters", "423,618,441,636"),
        new MapAreaInfo("ValeofDancingWaters", "377,590,425,630"),
        new MapAreaInfo("Westbridge", "264,403,282,421"),
        new MapAreaInfo("Westbridge", "279,394,352,411"),
        new MapAreaInfo("Westwood", "39,774,156,855"),
        new MapAreaInfo("Womford", "376,885,394,903"),
        new MapAreaInfo("Womford", "366,900,427,914"),
        new MapAreaInfo("Yartar", "493,156,511,174"),
        new MapAreaInfo("Yartar", "487,139,529,153"),
        new MapAreaInfo("RedLarch", "242,667,260,685"),
        new MapAreaInfo("RedLarch", "184,653,249,667"),
        new MapAreaInfo("Homesteads", "599,475,617,493"),
        new MapAreaInfo("Homesteads", "588,495,675,510"),
        new MapAreaInfo("Homesteads", "687,452,705,470"),
        new MapAreaInfo("Homesteads", "664,433,768,448"),
        new MapAreaInfo("Homesteads", "334,364,352,382"),
        new MapAreaInfo("Homesteads", "343,347,407,378"),
        new MapAreaInfo("ShallowGraves", "353,703,371,721", "pota/secret-of-the-sumber-hills"),
        new MapAreaInfo("ShallowGraves", "324,722,370,748", "pota/secret-of-the-sumber-hills"),
        new MapAreaInfo("TheDessarinRoad", "462,580,480,598", "pota/secret-of-the-sumber-hills"),
        new MapAreaInfo("TheDessarinRoad", "427,550,490,578", "pota/secret-of-the-sumber-hills")
    ], ["#ExploringtheValley", "#Travel", "#RandomEncounters", "#EarlyTravels", "#RiverTravels", "#LaterTravels",
            "#ValleySites", "#HauntedKeeps", "#Neverwinter", "#Waterdeep"]),
    new MapInfo("pota/secret-of-the-sumber-hills", "03-01.jpg", "99af7c86-1f99-41cd-aaba-ae245ff09ba1", [
        new MapAreaInfo("S1StableLevel", "130,655,155,670"),
        new MapAreaInfo("S2FrontHall", "105,493,130,508"),
        new MapAreaInfo("S3WeaponsLocker", "116,520,141,535"),
        new MapAreaInfo("S4CentralStairs", "175,480,200,495"),
        new MapAreaInfo("S5InitiateDormitory", "144,528,169,543"),
        new MapAreaInfo("S6Kitchen", "131,464,156,479"),
        new MapAreaInfo("S7Solarium", "174,507,199,522"),
        new MapAreaInfo("S8GreatHall", "165,338,190,353"),
        new MapAreaInfo("S9KnightsCells", "129,329,154,344"),
        new MapAreaInfo("S9KnightsCells", "105,352,130,367"),
        new MapAreaInfo("S9KnightsCells", "106,382,131,397"),
        new MapAreaInfo("S9KnightsCells", "129,405,154,420"),
        new MapAreaInfo("S9KnightsCells", "130,227,155,242"),
        new MapAreaInfo("S9KnightsCells", "129,280,154,295"),
        new MapAreaInfo("S9KnightsCells", "159,279,184,294"),
        new MapAreaInfo("S10MerosskasApartment", "171,242,196,257"),
        new MapAreaInfo("S11Pinnacle", "144,171,169,186")
    ], ["#FeathergaleSpire", "#SpireApproach", "#SpireFeatures", "#FeathergaleMoat", "#AreasoftheSpire"]),
    new MapInfo("pota/secret-of-the-sumber-hills", "03-02.jpg", "779112a6-be6a-43ab-ae98-42e48789bd77", [
        new MapAreaInfo("V1FeathergaleSpire", "173,131,208,156"),
        new MapAreaInfo("V1FeathergaleSpire", "79,199,185,247"),
        new MapAreaInfo("V2DeadRocks", "307,141,342,166"),
        new MapAreaInfo("V2DeadRocks", "226,216,279,256"),
        new MapAreaInfo("V3KnifepointGully", "452,162,487,187"),
        new MapAreaInfo("V3KnifepointGully", "451,229,547,276"),
        new MapAreaInfo("V4TheLostRiver", "99,425,134,450"),
        new MapAreaInfo("V4TheLostRiver", "128,378,211,432"),
        new MapAreaInfo("V5HowlingPlateau", "238,447,273,472"),
        new MapAreaInfo("V5HowlingPlateau", "316,360,394,402"),
        new MapAreaInfo("V6TheLostRiver", "371,491,406,516"),
        new MapAreaInfo("V6TheLostRiver", "390,438,462,498"),
        new MapAreaInfo("V7GriffonRoost", "64,577,99,602"),
        new MapAreaInfo("V7GriffonRoost", "135,535,201,577"),
        new MapAreaInfo("V8AarakocraCamp", "250,614,285,639"),
        new MapAreaInfo("V9ManticoreLair", "399,633,434,658"),
        new MapAreaInfo("V9ManticoreLair", "362,660,456,703")
    ], ["#SighingValley", "#Features", "#AreasoftheValley"]),
    new MapInfo("pota/secret-of-the-sumber-hills", "03-03.jpg", "1e392996-5a6b-47ed-9bc8-7e1b640cc254", [
        new MapAreaInfo("K1FrontGate", "291,396,321,416"),
        new MapAreaInfo("K2Gatehouse", "340,466,370,486"),
        new MapAreaInfo("K3GatehouseUpperFloor", "100,346,130,366"),
        new MapAreaInfo("K4CastleYard", "400,385,430,405"),
        new MapAreaInfo("K5RuinedStable", "449,385,479,405"),
        new MapAreaInfo("K6Armory", "430,315,460,335"),
        new MapAreaInfo("K7Bathhouse", "429,276,459,296"),
        new MapAreaInfo("K8Barracks", "479,305,509,325"),
        new MapAreaInfo("K9WaterTower", "620,465,650,485"),
        new MapAreaInfo("K10Landing", "577,365,612,385"),
        new MapAreaInfo("K11WaterGate", "658,385,693,405"),
        new MapAreaInfo("K12MooredKeelboat", "698,305,733,325"),
        new MapAreaInfo("K13DarkStream", "618,275,653,295"),
        new MapAreaInfo("K14NorthTower", "657,126,692,146"),
        new MapAreaInfo("K15Chapel", "557,166,592,186"),
        new MapAreaInfo("K16GreatHall", "427,133,462,153"),
        new MapAreaInfo("K16GreatHall", "377,162,392,177", null, "e47a1a99-ed3d-4f78-875f-e3147cf67bd9"),
        new MapAreaInfo("K17ServantsQuarters", "316,181,351,201"),
        new MapAreaInfo("K18Kitchens", "318,128,353,148"),
        new MapAreaInfo("K19OldLibrary", "111,87,141,107"),
        new MapAreaInfo("K19OldLibrary", "96,83,111,98", null, "c67bf4b3-2754-434b-a90d-fa44263a6c53"),
        new MapAreaInfo("K20KeepGuardroom", "110,136,140,156"),
        new MapAreaInfo("K21LordsChambers", "68,114,98,134"),
        new MapAreaInfo("K22SecretLanding", "107,466,142,486")
    ], ["#RivergardKeep", "#InvestigatingRivergard", "#KeepFeatures", "#RaisingtheAlarm", "#AreasoftheKeep"])
];

const extraMapLinks = [
    new MapLinksInfo("pota/secret-of-the-sumber-hills", "pota/the-dessarin-valley", "fe5bf95b-c3b5-4881-9866-ba6bb7b8bc68", [
        "#ShallowGraves"
    ])
];

class MapsPotA extends MapRefs {
    static get path() {
        return "pota/";
    }

    static get maps() {
        return maps;
    }

    static get extraMapLinks() {
        return extraMapLinks;
    }
}

export default MapsPotA;