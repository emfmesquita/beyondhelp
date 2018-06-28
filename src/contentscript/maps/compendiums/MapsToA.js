import MapAreaInfo from "../MapAreaInfo";
import MapInfo from "../MapInfo";
import MapRefs from "../MapRefs";
import MapToMapAreaInfo from "../MapToMapAreaInfo";

const maps = [
    new MapInfo("Omu", "dwellers-of-the-forbidden-city", "304.jpg", "a82c50f8-4e7a-408b-8adc-37e1ca6a726e", [
        new MapAreaInfo("1CityEntrance", "55,713,69,727"),
        new MapAreaInfo("2WalledCompound", "181,574,195,588"),
        new MapAreaInfo("3KubazansShrine", "128,565,142,579"),
        new MapAreaInfo("4ShagambisShrine", "277,576,291,590"),
        new MapAreaInfo("5GreatRift", "330,622,344,636"),
        new MapAreaInfo("6MoasShrine", "396,545,410,559"),
        new MapAreaInfo("7FallenTree", "305,474,319,488"),
        new MapAreaInfo("8UnkhsShrine", "342,458,356,472"),
        new MapAreaInfo("9AdventurersCamp", "209,440,223,454"),
        new MapAreaInfo("10IjinsShrine", "239,395,253,409"),
        new MapAreaInfo("11ChwingaWagon", "214,296,228,310"),
        new MapAreaInfo("12WongosShrine", "276,241,290,255"),
        new MapAreaInfo("13Amphitheater", "197,215,211,229"),
        new MapAreaInfo("14TomboftheNineGods", "291,177,305,191"),
        new MapAreaInfo("15RuinedBazaar", "324,224,338,238"),
        new MapAreaInfo("16PapazotlsShrine", "419,229,433,243"),
        new MapAreaInfo("17Waterfall", "457,212,471,226"),
        new MapAreaInfo("18NangnangsShrine", "523,318,537,332"),
        new MapAreaInfo("19ObolakasShrine", "482,444,496,458"),
        new MapAreaInfo("20RoyalPalace", "463,368,477,382"),
        new MapAreaInfo("20AMainEntrancetotheFane", "444,328,464,348"),
        new MapAreaInfo("20BSecretEntrancetotheFane", "442,409,462,429"),
        new MapToMapAreaInfo("305.jpg", "122,558,7"), // 3. shrine
        new MapToMapAreaInfo("305.jpg", "269,582,7"), // 4. shrine
        new MapToMapAreaInfo("305.jpg", "417,545,7"), // 6. shrine
        new MapToMapAreaInfo("305.jpg", "341,449,7"), // 8. shrine
        new MapToMapAreaInfo("305.jpg", "252,385,7"), // 10. shrine
        new MapToMapAreaInfo("305.jpg", "276,233,7"), // 12. shrine
        new MapToMapAreaInfo("305.jpg", "413,247,7"), // 16. shrine
        new MapToMapAreaInfo("305.jpg", "518,313,7"), // 18. shrine
        new MapToMapAreaInfo("305.jpg", "480,436,7"), // 19. shrine
        new MapToMapAreaInfo("402.jpg", "433,339,8"), // fane-of-the-night-serpent
        new MapToMapAreaInfo("402.jpg", "431,419,8"), // fane-of-the-night-serpent
        new MapToMapAreaInfo("505.jpg", "298,166,8") // tomb-of-the-nine-gods
    ]),
    new MapInfo("3KubazansShrine", "dwellers-of-the-forbidden-city", "305.jpg", "b41d9c6c-d7b0-456b-bd5e-2f8f76e69a8b", [
        new MapAreaInfo().rect(73, 243, 88, 258).content("57e55e02-8000-4664-8d64-a1a1fe4e2388"), // 3a
        new MapAreaInfo().rect(105, 168, 120, 183).content("4318fa1b-854c-4097-94f3-e6b3f0ada52e"), // 3b
        new MapAreaInfo().rect(95, 125, 110, 140).content("55223cd3-7a16-494e-b219-1ae7aff45a06"), // 3c
        new MapAreaInfo().rect(293, 270, 308, 285).content("8227c165-a7af-4d90-ab2d-76204d824cbb"), // 4a
        new MapAreaInfo().rect(309, 178, 324, 193).content("f1fd3584-2482-4b75-ac70-a545fd95d156"), // 4b
        new MapAreaInfo().rect(352, 179, 367, 194).content("428893cf-bd82-4341-8956-ca09e141e1fd"), // 4c
        new MapAreaInfo().rect(293, 206, 308, 221).content("c4c9bc3d-650b-43d2-b7a1-dcb00a372fdf"), // 4d
        new MapAreaInfo().rect(487, 249, 502, 264).content("5948088b-0358-4ccf-809d-c412f9c71ee8"), // 6a
        new MapAreaInfo().rect(486, 196, 501, 211).content("2ebe89a5-0ee9-4d2e-8f75-a664946fd2f6"), // 6b
        new MapAreaInfo().rect(470, 126, 485, 141).content("783bceeb-360d-430c-a493-4aefc3beda1c"), // 6c
        new MapAreaInfo().rect(449, 190, 464, 205).content("bd297af8-bd85-4878-9e37-5cb86f617eb2"), // 6d
        new MapAreaInfo().rect(524, 190, 539, 205).content("47448ed3-4365-453e-869b-a7089a18c2bc"), // 6e
        new MapAreaInfo().rect(105, 511, 120, 526).content("a66052e6-cea6-40bb-8b1b-1bc9b9792b19"), // 8a
        new MapAreaInfo().rect(68, 484, 83, 499).content("7f67ec59-604b-4eee-b735-2d2be9a367da"), // 8b
        new MapAreaInfo().rect(89, 398, 104, 413).content("3d511afe-a618-4775-9cfd-2a06d49922cf"), // 8c
        new MapAreaInfo().rect(299, 511, 314, 526).content("340d78a6-0ff8-443b-8eff-dfd41eac55ef"), // 10a
        new MapAreaInfo().rect(299, 457, 314, 472).content("8783e914-63b7-48b0-b111-1a140e1437c8"), // 10b
        new MapAreaInfo().rect(349, 400, 364, 415).content("540c05f3-ca1a-4ece-aa92-06b962facb5d"), // 10c
        new MapAreaInfo().rect(288, 350, 303, 365).content("217487cb-5f62-4f8d-942f-447f7a208524"), // 10d
        new MapAreaInfo().rect(476, 506, 491, 521).content("fb77b279-ebe4-451e-9b97-6475f8e3b743"), // 12a
        new MapAreaInfo().rect(492, 382, 507, 397).content("1141fbaa-f4f7-4cf0-8c6c-dd9a2e2ebfde"), // 12b
        new MapAreaInfo().rect(443, 442, 458, 457).content("af9f2227-c2c7-497e-bfd9-6e3d2425e927"), // 12c
        new MapAreaInfo().rect(508, 442, 523, 457).content("af9f2227-c2c7-497e-bfd9-6e3d2425e927"), // 12c
        new MapAreaInfo().rect(106, 737, 121, 752).content("c89f1e61-9a5d-44df-b968-bd072ed6b64b"), // 16a
        new MapAreaInfo().rect(106, 694, 121, 709).content("a4b37047-e746-4252-9119-c44e44fff188"), // 16b
        new MapAreaInfo().rect(106, 619, 121, 634).content("9eb9943b-4cb7-4dbe-bd41-928059f5c45d"), // 16c
        new MapAreaInfo().rect(148, 683, 163, 698).content("83b8b003-6f19-4f1c-8872-513a092a9cfa"), // 16d
        new MapAreaInfo().rect(288, 715, 303, 730).content("4d806ae6-ae0d-4b9f-9648-f24c063a9af7"), // 18a
        new MapAreaInfo().rect(288, 672, 303, 687).content("3bca57fc-67dc-4bf0-a162-0e01489006b3"), // 18b
        new MapAreaInfo().rect(298, 629, 313, 644).content("251bc9cb-bc7b-49db-9d40-6b8558f3bcc4"), // 18c
        new MapAreaInfo().rect(481, 736, 496, 751).content("ea77b7a8-ca3e-48af-8374-59e0f87df860"), // 19a
        new MapAreaInfo().rect(481, 715, 496, 730).content("5aa611bc-a46f-4df2-87f7-69d0cb9bfd27"), // 19b
        new MapAreaInfo().rect(503, 608, 518, 623).content("8f14f4d3-0ebf-4492-b565-157141b15337"), // 19c
        new MapAreaInfo().rect(459, 607, 474, 622).content("3ed8b853-fabc-4d85-af6c-7f0848da0ca0"), // 19d
        new MapAreaInfo().rect(460, 672, 475, 687).content("ac5f24c9-db88-400a-bbcd-77382945f903"), // 19e
        new MapAreaInfo().rect(427, 672, 442, 687).content("9f7dd89a-83d2-4388-b204-0d7ba81805a1"), // 19f
        new MapToMapAreaInfo("304.jpg", "107,298,10"), // omu
        new MapToMapAreaInfo("304.jpg", "301,298,10"), // omu
        new MapToMapAreaInfo("304.jpg", "493,298,10"), // omu
        new MapToMapAreaInfo("304.jpg", "113,539,10"), // omu
        new MapToMapAreaInfo("304.jpg", "306,539,10"), // omu
        new MapToMapAreaInfo("304.jpg", "484,539,10"), // omu
        new MapToMapAreaInfo("304.jpg", "113,784,10"), // omu
        new MapToMapAreaInfo("304.jpg", "295,784,10"), // omu
        new MapToMapAreaInfo("304.jpg", "488,784,10") // omu
    ], [
            "#3AFroghemothPool", "#3BLockedGate", "#3CChamberofBravery",
            "#4AShrineEntrance", "#4BArenaGallery", "#4CGladiatorCells", "#4DGladiatorialPit",
            "#6AShrineEntrance", "#6BTrappedPassage", "#6CChamberofDeception", "#6DWesternSecretRoom", "#6EEasternSecretRoom",
            "#8AShrineEntrance", "#8BRuinedWorkshop", "#8CChamberofContemplation",
            "#10AShrineEntrance", "#10BPuzzleFloor", "#10CLabyrinth", "#10DPuzzleCube",
            "#12ACrackedObelisks", "#12BTestofFriendship", "#12CViewingCorridors",
            "#16AShrineEntrance", "#16BMosaicFloor", "#16CChamberofCommand", "#16DHiddenRoom",
            "#18AShrineEntrance", "#18BChamberofGreed", "#18CPuzzleCube",
            "#19AShrineEntrance", "#19BGalleryofCarvings", "#19CSunPool", "#19DMoonPool", "#19EChamberofSacraments", "#19FSecretPassage"
        ]).extraMenuLinks([
            "4ShagambisShrine", "6MoasShrine", "8UnkhsShrine", "10IjinsShrine",
            "12WongosShrine", "16PapazotlsShrine", "18NangnangsShrine", "19ObolakasShrine"
        ]),
    new MapInfo("Chapter4FaneoftheNightSerpent", "fane-of-the-night-serpent", "402.jpg", "fba45769-7740-4298-a05b-cd72eb529bc9", [
        new MapToMapAreaInfo("304.jpg", "116,96,10"),
        new MapToMapAreaInfo("304.jpg", "250,779,7")
    ]).chMap(),
    new MapInfo("Level1RottenHalls", "tomb-of-the-nine-gods", "505.jpg", "90d02dff-fe7c-435a-ab19-33f9be558f7b", [
        new MapToMapAreaInfo("304.jpg", "397,550,10")
    ])
];

class MapsToA extends MapRefs {
    static get path() {
        return "adventures/toa/";
    }

    static get maps() {
        return maps;
    }

    static get extraMapLinks() {
        return [];
    }
}

export default MapsToA;