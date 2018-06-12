import MapAreaInfo from "../MapAreaInfo";
import MapInfo from "../MapInfo";
import MapRefs from "../MapRefs";
import MapToMapAreaInfo from "../MapToMapAreaInfo";

const maps = [
    new MapInfo("TheCitadel", "a1/the-sunless-citadel", "totyp-01-02.jpg", "52fdd2ad-0587-4753-b621-2fc3d670fd44", [
        new MapAreaInfo("1Ledge", "227,38,237,48"),
        new MapAreaInfo("2SwitchbackStairs", "92,124,102,134"),
        new MapAreaInfo("3CrumbledCourtyard", "276,499,286,509"),
        new MapAreaInfo("4TowerShell", "238,515,248,525"),
        new MapAreaInfo("5SecretPocket", "243,552,253,562"),
        new MapAreaInfo("6OldApproach", "217,551,227,561"),
        new MapAreaInfo("7GalleryofForlornNotes", "186,552,196,562"),
        new MapAreaInfo("8PressurePlate", "156,564,166,574"),
        new MapAreaInfo("9DragonRiddle", "135,573,145,583"),
        new MapAreaInfo("10HonorGuard", "99,542,109,552"),
        new MapAreaInfo("11SecretRoom", "107,574,117,584"),
        new MapAreaInfo("12TombofaFailedDragonpriest", "54,522,64,532"),
        new MapAreaInfo("13EmptyRoom", "135,504,145,514"),
        new MapAreaInfo("13EmptyRoom", "113,504,123,514"),
        new MapAreaInfo("13EmptyRoom", "189,482,199,492"),
        new MapAreaInfo("13EmptyRoom", "113,429,123,439"),
        new MapAreaInfo("14EnchantedWaterCache", "195,521,205,531"),
        new MapAreaInfo("15DragonCell", "167,470,177,480"),
        new MapAreaInfo("16KoboldGuardroom", "140,467,150,477"),
        new MapAreaInfo("16KoboldGuardroom", "85,510,95,520"),
        new MapAreaInfo("16KoboldGuardroom", "74,478,84,488"),
        new MapAreaInfo("17DragonChow", "156,527,166,537"),
        new MapAreaInfo("18Prison", "116,470,126,480"),
        new MapAreaInfo("19HallofDragons", "97,451,107,461"),
        new MapAreaInfo("20KoboldColony", "171,431,181,441"),
        new MapAreaInfo("21DragonThrone", "54,450,64,460"),
        new MapAreaInfo("22Larder", "93,425,103,435"),
        new MapAreaInfo("23UnderdarkAccess", "54,424,64,434"),
        new MapAreaInfo("24TrappedAccess", "138,424,148,434"),
        new MapAreaInfo("25EmptyChamber", "219,423,229,433"),
        new MapAreaInfo("25EmptyChamber", "254,476,264,486"),
        new MapAreaInfo("26DryFountain", "244,449,254,459"),
        new MapAreaInfo("27Sanctuary", "222,450,232,460"),
        new MapAreaInfo("28InfestedCells", "243,410,253,420"),
        new MapAreaInfo("29DisabledTraps", "264,352,274,362"),
        new MapAreaInfo("30MamaRat", "212,348,222,358"),
        new MapAreaInfo("31CaltropHall", "221,396,231,406"),
        new MapAreaInfo("32GoblinGate", "220,374,230,384"),
        new MapAreaInfo("33PracticeRange", "188,392,198,402"),
        new MapAreaInfo("34GoblinStockade", "162,393,172,403"),
        new MapAreaInfo("35TrappedCorridor", "176,358,186,368"),
        new MapAreaInfo("36GoblinBandits", "170,327,180,337"),
        new MapAreaInfo("36GoblinBandits", "98,402,108,412"),
        new MapAreaInfo("36GoblinBandits", "21,411,31,421"),
        new MapAreaInfo("37TrophyRoom", "138,333,148,343"),
        new MapAreaInfo("38GoblinPantry", "164,374,174,384"),
        new MapAreaInfo("39DragonHaze", "129,375,139,385"),
        new MapAreaInfo("40Goblinville", "73,363,83,373"),
        new MapAreaInfo("41HalloftheGoblinChief", "46,321,56,331"),
        new MapAreaInfo().rho(198, 50, 208, 60).content("546b9176-02de-48de-a621-158a0a55b3af", "dcbbff31-d817-41f7-8da4-fb26c64dd23c"), // 1 - Investigating
        new MapAreaInfo().rho(266, 521, 276, 531).content("d351ea8a-8e57-4668-8be0-d29308c9f8c8", "8b412499-c5ec-4f6c-81b2-5184d51723f9"), // 3 - Hidden Pit
        new MapAreaInfo().rho(245, 535, 255, 545).content("ed09d3be-579b-4ea0-9a27-58c841a1af71", "50b4f92c-848f-46bf-97b3-9f6509b3b5e8"), // 4 - secret/trap
        new MapAreaInfo().rho(124, 545, 134, 555).content("2678dada-b78a-4e23-a0ec-2667efd3138a", "cc3fa305-6cf3-4b58-8835-006ee9ba9ab7"), // 9 - secret
        new MapAreaInfo().rho(76, 548, 86, 558).content("dd0eacc0-5c14-4529-8f54-dbbfc78ee5d5"), // 10 - pit
        new MapAreaInfo().rho(94, 563, 104, 573).content("73b14988-bbd1-43e5-972f-d7bbdcc099d0"), // 10 - secret
        new MapAreaInfo().rho(129, 430, 139, 440).content("0d1e8606-b9a1-4b7a-a0bd-51d04d277f76", "091e3a00-75bc-4fbd-9810-c40836160651"), // 24 - trap
        new MapAreaInfo().rho(236, 360, 246, 370).content("04445aa2-03f5-4e17-884a-f5ae8477fbdf"), // 29 - disabled traps
        new MapAreaInfo().rho(243, 343, 253, 353).content("39ac5f19-1e22-46e7-ba79-cacab03fdb4f", "b66be4a9-99e5-4ed6-bcc5-6ee94d3c57fe"), // 29 - fountain trap
        new MapAreaInfo().rho(31, 335, 41, 345).content("e59ec522-6e9a-4ec0-b6ee-8078469fcc07", "8e5005b5-9fc5-4ceb-ac24-f92722a95334"), // 41 - chest
        new MapToMapAreaInfo("totyp-01-08.jpg", "44,350,5")
    ], ["#LocationsontheFortressLevel"]),
    new MapInfo("TheCitadel", "a1/the-sunless-citadel", "totyp-01-08.jpg", "dd3e180d-827e-4a14-ab11-5e1d8cacdd45", [
        new MapAreaInfo("42CentralGarden", "124,420,139,435"),
        new MapAreaInfo("43TheGreatHuntersAbode", "88,257,103,272"),
        new MapAreaInfo("44Rift", "139,494,154,509"),
        new MapAreaInfo("45RiftNode", "110,644,125,659"),
        new MapAreaInfo("46OldShrine", "219,629,234,644"),
        new MapAreaInfo("47BelaksLaboratory", "228,283,243,298"),
        new MapAreaInfo("48GardenGalleries", "358,274,373,289"),
        new MapAreaInfo("48GardenGalleries", "358,385,373,400"),
        new MapAreaInfo("49Arboretums", "401,279,416,294"),
        new MapAreaInfo("49Arboretums", "400,384,415,399"),
        new MapAreaInfo("49Arboretums", "375,463,390,478"),
        new MapAreaInfo("49Arboretums", "332,110,347,125"),
        new MapAreaInfo("50AshardalonsShrine", "231,248,246,263"),
        new MapAreaInfo("51DragonLibrary", "251,204,266,219"),
        new MapAreaInfo("52Underpass", "251,170,266,185"),
        new MapAreaInfo("52Underpass", "410,144,425,159"),
        new MapAreaInfo("53BelaksStudy", "479,265,494,280"),
        new MapAreaInfo("54GroveGate", "532,334,547,349"),
        new MapAreaInfo("55TwilightGrove", "528,428,543,443"),
        new MapAreaInfo("56TheGulthiasTree", "430,670,445,685"),
        new MapAreaInfo().rho(142, 320, 156, 334).content("aef168de-69e1-4c6a-b41b-6aac150f7c29"), // 42 - development
        new MapAreaInfo().rho(132, 206, 146, 220).content("a540f481-20e0-4df0-baaa-5d00680d133b"), // 43 - underdark access
        new MapAreaInfo().rho(167, 230, 181, 244).content("e2925af0-90b5-42a2-9e45-83138942a340"), // 43 - treasure
        new MapAreaInfo().rho(111, 616, 125, 630).content("4d953ecb-90fb-4fd5-8c5d-fc66ad58f2a4"), // 45 - treasure
        new MapAreaInfo().rho(194, 594, 208, 608).content("dec1379d-f16a-4f49-971f-b0cebbf11cb1"), // 46 - door
        new MapAreaInfo().rho(271, 343, 285, 357).content("9920e48a-7255-442a-b1a9-24556bffc223", "2e21e7ac-58aa-4b2a-a003-4b74bb5d2c16"), // 47 - main tables
        new MapAreaInfo().rho(210, 308, 224, 322).content("2e21e7ac-58aa-4b2a-a003-4b74bb5d2c16"), // 47 - Northwest Chamber
        new MapAreaInfo().rho(211, 378, 225, 392).content("80227fcd-b375-4c97-89fd-ac13120fed26"), // 47 - Southwest Chamber
        new MapAreaInfo().rho(245, 307, 259, 321).content("263c8a5e-32c0-4baa-b6ee-0462d4330c19"), // 47 - North Central Chamber
        new MapAreaInfo().rho(245, 377, 259, 391).content("334ae082-171d-449f-b515-7dac319562cc", "7efa5462-1e66-4686-926f-5d4d2aeb081c"), // 47 - South Central Chamber
        new MapAreaInfo().rho(280, 307, 294, 321).content("7efa5462-1e66-4686-926f-5d4d2aeb081c"), // 47 - Northeast Chamber
        new MapAreaInfo().rho(280, 378, 294, 392).content("0c3c66c7-6ebc-44a7-9206-b74bea2bfc63"), // 47 - Southeast Chamber
        new MapAreaInfo().rho(332, 465, 346, 479).content("6f954b4b-2742-4fb8-ad13-a0cd6a830c16"), // 49 - Southern Arboretum
        new MapAreaInfo().rho(402, 341, 416, 355).content("41763337-ee7c-4719-b499-ab5dd626bb24"), // 49 - Southeast Arboretum
        new MapAreaInfo().rho(400, 239, 414, 253).content("52ec325c-3fac-4b5d-8f14-4a8348475ebf", "6d23fae1-5e33-4a56-ad3d-dc39b900d5a8"), // 49 - Northeast Arboretum
        new MapAreaInfo().rho(331, 153, 345, 167).content("6d23fae1-5e33-4a56-ad3d-dc39b900d5a8"), // 49 - Southern Arboretum
        new MapAreaInfo().rho(262, 248, 276, 262).content("19f1114f-78b6-477e-af7e-c454abe931d6"), // 50 - statue
        new MapAreaInfo().rho(247, 248, 261, 262).content("93a46f0d-1ce7-4bf9-b07b-4a77dc0889e9"), // 50 - treasure
        new MapAreaInfo().rho(287, 199, 301, 213).content("398cbd27-d9fb-423c-b054-2b6c566da8a2"), // 51 - treasure
        new MapAreaInfo().rho(483, 309, 497, 323).content("fb348952-91bb-4aed-95b9-48dc3d7aa74d"), // 53 - door
        new MapAreaInfo().rho(453, 295, 467, 309).content("fb348952-91bb-4aed-95b9-48dc3d7aa74d"), // 53 - door
        new MapAreaInfo().rho(502, 292, 516, 306).content("c00a3088-8916-48e4-a5d1-6d4df21db7ce", "bd5b4384-c2dd-48a2-ad14-72920994be78"), // 53 - Investigating
        new MapAreaInfo().rho(478, 291, 492, 305).content("947f6619-50c5-4eb5-b8f7-28777b7b0c93"), // 53 - treasure
        new MapAreaInfo().rho(490, 355, 504, 369).content("821d89a6-9f97-474f-a365-2f80ce5c6d99"), // 54 - Investigating
        new MapAreaInfo().rho(491, 398, 505, 412).content("2c66b60a-1083-4eac-8f3c-70244bb18c68", "6e0747de-1026-482d-9c34-60df7a71a4a4"), // 55 - Briars
        new MapAreaInfo().rho(372, 567, 386, 581).content("a5104b39-29cc-4430-86b8-d524ac854426"), // 56 - walls
        new MapAreaInfo().rho(384, 638, 398, 652).content("4fb3e2bc-7ecb-4f42-9e9c-ae7ccbd33903", "ea132a78-8f13-441f-a0c6-b9ca96313d35"), // 56 - tree
        new MapToMapAreaInfo("totyp-01-02.jpg", "102,398,10")
    ], ["#LocationsontheGroveLevel"]),
    new MapInfo("ApproachingKhundrukar", "a2/the-forge-of-fury", "totyp-02-02.png", "88c15f8d-0ef0-484f-a998-b6448ed3989f", [
        new MapAreaInfo().rect(325, 487, 350, 512).content("d954ae5d-de1b-4fb6-a176-7a9305f6f05e"),
        new MapAreaInfo().rect(355, 509, 380, 534).content("c9f667e0-c3aa-4e91-9c27-d0f0657ffcb9", "de7caf93-f168-4bdb-804d-4b024259c7d9"),
        new MapAreaInfo().rect(389, 388, 414, 413).content("de7caf93-f168-4bdb-804d-4b024259c7d9", "4916a9be-e2c3-4881-848c-e6e31d63d27e"),
        new MapAreaInfo().rect(300, 409, 325, 434).content("4916a9be-e2c3-4881-848c-e6e31d63d27e"),
        new MapAreaInfo().rect(475, 430, 500, 455).content("88ff4c2c-4b5b-4374-a623-b61c5e61cf9e", "2895b554-6213-45b8-b3d9-a39c485ad140"),
        new MapToMapAreaInfo("totyp-02-03.png", "308,499,12"),
        new MapToMapAreaInfo("totyp-02-03.png", "367,550,12"),
        new MapToMapAreaInfo("totyp-02-07.png", "401,371,12"),
        new MapToMapAreaInfo("totyp-02-13.png", "516,442,12")
    ], ["#TheStoneTooth"]),
    new MapInfo("TheMountainDoor", "a2/the-forge-of-fury", "totyp-02-03.png", "0b6d4b16-d131-4a7b-bfb1-4c1ab3dc76b0", [
        new MapAreaInfo("1EndoftheTrail", "153,171,173,191"),
        new MapAreaInfo("2TheDwarfDoor", "251,231,271,251"),
        new MapAreaInfo("3TheRiftHall", "309,320,329,340"),
        new MapAreaInfo("4and4aArchersStations", "217,152,237,172"),
        new MapAreaInfo("4and4aArchersStations", "227,317,247,337"),
        new MapAreaInfo("5OrcCave", "455,228,475,248"),
        new MapAreaInfo("6PrisonerCave", "505,318,525,338"),
        new MapAreaInfo("7FireintheHole", "616,318,636,338"),
        new MapAreaInfo("8OrcCommons", "582,157,602,177"),
        new MapAreaInfo("9ShamansLair", "749,336,769,356"),
        new MapAreaInfo("10TheGrandStair", "701,210,721,230"),
        new MapAreaInfo("11OrcQuarters", "661,110,681,130"),
        new MapAreaInfo("12GreatUlfe", "394,202,414,222"),
        new MapAreaInfo("13DwarvenStatue", "413,91,433,111"),
        new MapAreaInfo("14BunkRoom", "300,135,320,155"),
        new MapAreaInfo().rho(191, 141, 205, 155).content("d1b73ea8-aef4-41cc-a378-3affbeec92aa"), // 1 - Arrow Slits
        new MapAreaInfo().rho(326, 256, 340, 270).content("fbcdf5dc-216a-4821-b451-dad0ff9a7289"), // 3 - Rope Bridge
        new MapAreaInfo().rho(288, 221, 302, 235).content("d106b777-85f7-45ff-b37c-577e76a1f919"), // 3 - Secret Doors
        new MapAreaInfo().rho(288, 287, 302, 301).content("d106b777-85f7-45ff-b37c-577e76a1f919"), // 3 - Secret Doors
        new MapAreaInfo().rho(213, 82, 227, 96).content("14e2884c-49dc-42c4-adcf-a60bf2daab9d"), // 4 - Secret Door
        new MapAreaInfo().rho(502, 287, 516, 301).content("91e556ff-99d1-4fee-9a86-6dba3d2890fb"), // 5 - Cage Door
        new MapAreaInfo().rho(500, 232, 514, 246).content("5b0dc500-1355-44ba-9d06-b074ea9c6e60"), // 5 - treasure
        new MapAreaInfo().rho(590, 327, 604, 341).content("2ca63bc8-e75c-4a30-abc0-77ddb2e2e48f", "08a20cbb-745f-4cd8-89c4-e83c07c57e98"), // 7 - chimney
        new MapAreaInfo().rho(716, 159, 730, 173).content("b2b431b3-1506-4eb5-88da-dd2c15ae4be2"), // 8 - barricade
        new MapAreaInfo().rho(665, 176, 679, 190).content("64fce9bd-1e27-4f12-8a2e-80412438681c"), // 8 - Iron Gate
        new MapAreaInfo("8OrcCommons").rho(640, 292, 654, 306).content("253be6a8-e721-4e31-b998-64613e056080", "a04eb9ad-3a36-45d8-9365-b45a8d6caa7e"), // 8 - Secret Doors
        new MapAreaInfo("8OrcCommons").rho(707, 315, 721, 329).content("a04eb9ad-3a36-45d8-9365-b45a8d6caa7e", "b48ba010-463d-4f85-b31e-18fba8146cc9"), // 8 - Secret Doors
        new MapAreaInfo().rho(604, 179, 618, 193).content("b48ba010-463d-4f85-b31e-18fba8146cc9", "b3c9d21f-3872-4d6f-88a8-f2ec3b3c4dd1"), // 8 - treasure
        new MapAreaInfo("9ShamansLair").rho(722, 315, 736, 329).content("fb14bf55-0222-4903-b28e-556d0e3ba9ff"), // 9 - Secret Exit
        new MapAreaInfo("9ShamansLair").rho(655, 292, 669, 306).content("fb14bf55-0222-4903-b28e-556d0e3ba9ff"), // 9 - Secret Exit
        new MapAreaInfo("9ShamansLair").rho(750, 293, 764, 307).content("5a7507a0-ee38-4673-bbe1-e22e90a23871", "5ae9e400-e3fa-4bdf-837d-d74c4f580f9c"), // 9 - door
        new MapAreaInfo().rho(731, 304, 745, 318).content("cf1f5503-25f3-40b6-aae4-bbcbe80ba772"), // 9 - treasure
        new MapAreaInfo("10TheGrandStair").rho(750, 277, 764, 291).content("b142adf4-f538-4f8b-a41d-4b5b875437c7", "73b368c5-3520-4212-a9b3-ddbb1d50f453"), // 10 - door to 9
        new MapAreaInfo().rho(749, 105, 763, 119).content("73b368c5-3520-4212-a9b3-ddbb1d50f453", "d24704ca-ee2d-49f7-894d-6049f04d2ad8"), // 10 - trap
        new MapAreaInfo().rho(759, 89, 773, 103).content("d24704ca-ee2d-49f7-894d-6049f04d2ad8", "d8d66012-fbb1-4fad-845c-5204d6e51629"), // 10 - behind the trap door
        new MapAreaInfo().rho(635, 108, 649, 122).content("aea2af09-68ee-4bf0-bed9-5bbb915190f8", "6ca07f50-45cc-4f05-8185-3a5ada43c103"), // 11 - treasure
        new MapAreaInfo().rho(417, 150, 431, 164).content("817324ad-496a-4500-b989-07a8038f8933"), // 12 - door
        new MapAreaInfo().rho(435, 204, 449, 218).content("7c4e70b4-cc57-449f-9955-a9fa92b95ca8"), // 12 - treasure
        new MapAreaInfo().rho(394, 95, 408, 109).content("59169584-61e9-41d3-bfa9-6ba87bce332c", "37fe2634-4412-4ba5-a09c-709347a9ab9f"), // 13 - trap
        new MapAreaInfo("14BunkRoom").rho(254, 82, 268, 96).content("50237236-d54d-4fef-90c6-c5a6b835bb1a", "7621e1f4-83e7-420c-8c55-644a627673b9"), // 14 - secret
        new MapAreaInfo().rho(319, 123, 333, 137).content("d6395f38-965b-47a6-8b61-c9ab6da9da33"), // 14 - treasure
        new MapToMapAreaInfo("totyp-02-02.png", "96,328,10"),
        new MapToMapAreaInfo("totyp-02-02.png", "578,337,10"),
        new MapToMapAreaInfo("totyp-02-07.png", "754,256,10")
    ], []).tocHId("TheForgeofFury"),
    new MapInfo("TheGlitterhame", "a2/the-forge-of-fury", "totyp-02-07.png", "cd39e344-5e06-4d5d-8ad3-42cff9244e24", [
        new MapAreaInfo("15TheColdStream", "132,93,152,113"),
        new MapAreaInfo("15aStirgeColony", "231,137,256,157"),
        new MapAreaInfo("16HighCavern", "175,232,195,252"),
        new MapAreaInfo("17TroglodyteCavern", "159,337,179,357"),
        new MapAreaInfo("18TroglodyteWarren", "178,538,198,558"),
        new MapAreaInfo("19ChieftainsCave", "57,376,77,396"),
        new MapAreaInfo("20ScalyLair", "254,612,274,632"),
        new MapAreaInfo("21OrcTunnel", "422,206,442,226"),
        new MapAreaInfo("22FungusCavern", "455,301,475,321"),
        new MapAreaInfo("23DwarvenSepulchers", "289,350,309,370"),
        new MapAreaInfo("24TheGlitterhame", "507,376,527,396"),
        new MapAreaInfo("25LongCavern", "404,662,424,682"),
        new MapAreaInfo("26GrickLair", "629,308,649,328"),
        new MapAreaInfo("27IronDoor", "740,489,760,509"),
        new MapAreaInfo().rho(193, 94, 207, 108).content("b24647b5-8aa5-4845-9cf8-95f98ae53c7b"), // 15 - stream
        new MapAreaInfo().rho(249, 121, 263, 135).content("600d659c-a5c7-4e45-bed9-c711f7c563ec"), // 15a - treasure
        new MapAreaInfo().rho(244, 256, 258, 270).content("beed4550-e90e-4881-a7a3-8b4bdda08b5f", "224e948a-863d-4875-ab4c-cc116fe1509c"), // 16 - passage to 17
        new MapAreaInfo().rho(152, 430, 166, 444).content("a63b5b68-1376-4a6c-b044-c5324894cfa8"), // 17 - passage to 18
        new MapAreaInfo().rho(264, 482, 278, 496).content("79cec324-b027-48c8-9da8-fdca4ce50116"), // 17 - pool
        new MapAreaInfo().rho(296, 470, 310, 484).content("a9848537-5575-4a8e-a8be-a10199898b1b"), // 17 - passage to 23
        new MapAreaInfo().rho(88, 489, 102, 503).content("0b03483d-852d-44ac-9b7e-ad3eef83c978"), // 18 - Northwest Chamber
        new MapAreaInfo().rho(108, 596, 122, 610).content("a54cc14d-f6df-48a1-a284-20ea776c7c6c", "11ebadce-8f6d-4449-b2e1-fbd72d4a05e7"), // 18 - Southwest Chamber
        new MapAreaInfo().rho(190, 649, 204, 663).content("11ebadce-8f6d-4449-b2e1-fbd72d4a05e7"), // 18 - Southeast Chamber
        new MapAreaInfo().rho(101, 437, 115, 451).content("acf4bb85-9ea6-48e8-9cff-797548143c77"), // 19 - door
        new MapAreaInfo().rho(91, 365, 105, 379).content("787d9dec-4464-46b2-b069-d228220aa165"), // 19 - treasure
        new MapAreaInfo().rho(278, 609, 292, 623).content("dc0406cf-1160-4559-91df-2d7a4279a17e"), // 20 - treasure
        new MapAreaInfo().rho(485, 127, 499, 141).content("03f7d3d2-f5b6-481f-b0d6-2a4856e4c43f", "22003791-04cf-4f88-91e4-1323a6347db0"), // 21 - Bear Pen
        new MapAreaInfo().rho(449, 273, 463, 287).content("2308b9d5-740a-4e17-9229-2811f55fdb30", "a9319e35-cbb7-474c-8d82-126fe76cc6ee"), // 22 - hazard - treasure
        new MapAreaInfo().rho(487, 300, 501, 314).content("2308b9d5-740a-4e17-9229-2811f55fdb30", "a9319e35-cbb7-474c-8d82-126fe76cc6ee"), // 22 - hazard - treasure
        new MapAreaInfo().rho(318, 395, 332, 409).content("d07a78be-7b3a-4f60-9879-d16570b77818", "6bb9f24b-49ef-4d72-8410-b272aa946a2b"), // 23 - treasure
        new MapAreaInfo().rho(631, 461, 645, 475).content("5bfa15d4-b2ca-44b8-878c-c916fbba02ba"), // 24 - slope to 26
        new MapAreaInfo().rho(413, 629, 427, 643).content("3f11811e-6054-4098-9ef6-a08583bbc367", "6cbd36fa-6731-44ac-a345-59873c8f8fc1"), // 25 - Slippery Slope
        new MapAreaInfo().rho(502, 678, 516, 692).content("6cbd36fa-6731-44ac-a345-59873c8f8fc1"), // 25 - waterfall
        new MapAreaInfo().rho(659, 354, 673, 368).content("a9cdb0ac-fab2-4950-b63f-6b9a232faa54"), // 26 - treasure
        new MapAreaInfo().rho(729, 511, 743, 525).content("fbace9a8-68f2-4d98-a94d-3b9ebbdcb5f9", "3b83ea9e-dbbb-49e6-abed-ba5ed0fa8861"), // 27 - Iron Door
        new MapToMapAreaInfo("totyp-02-02.png", "413,98,10"),
        new MapToMapAreaInfo("totyp-02-03.png", "57,93,10"),
        new MapToMapAreaInfo("totyp-02-08.png", "536,667,10"),
        new MapToMapAreaInfo("totyp-02-08.png", "587,649,10"),
        new MapToMapAreaInfo("totyp-02-11.png", "774,371,10")
    ], []).tocHId("TheForgeofFury"),
    new MapInfo("TheSinkhole", "a2/the-forge-of-fury", "totyp-02-08.png", "1780dd4c-c571-45e2-8315-9d438c153d34", [
        new MapAreaInfo("28WaterfallCavern", "149,180,169,200"),
        new MapAreaInfo("29RiverCavern", "307,316,327,336"),
        new MapAreaInfo("30OldStoreroom", "387,41,407,61"),
        new MapAreaInfo("31EmptyStoreroom", "359,196,379,216"),
        new MapAreaInfo("32FloodedStoreroom", "428,294,448,314"),
        new MapAreaInfo("33RopersCavern", "593,245,613,265"),
        new MapAreaInfo("34Prison", "681,104,701,124"),
        new MapAreaInfo().rho(186, 134, 200, 148).content("4eaf6bc4-82b9-4434-a1d9-126452483018"), // 28 - river
        new MapAreaInfo().rho(174, 264, 188, 278).content("dfab7456-494d-4799-8950-1f054fa0ad0d", "5d60b64d-f628-4f9c-9aed-7749eac1ed0c"), // 29 - river
        new MapAreaInfo().rho(332, 94, 346, 108).content("156883a0-75d1-4dd3-9a2b-3fbd4bd85ef9"), // 30 - door
        new MapAreaInfo().rho(332, 153, 346, 167).content("3cd43449-e2a0-4dc4-9df9-1b0e23c3921a"), // 31 - door
        new MapAreaInfo().rho(433, 335, 447, 349).content("2136f0ce-c1d6-4467-b8a8-0a9e8cde963a", "f092ed43-1f98-4bb6-9ff0-59e7931e97cb"), // 32 - water
        new MapAreaInfo().rho(564, 354, 578, 368).content("f092ed43-1f98-4bb6-9ff0-59e7931e97cb"), // 32 - treasure
        new MapAreaInfo().rho(188, 286, 202, 300).content("d6017122-5789-4804-af95-4ee859eb5267", "76eff8db-a773-4f34-bfe8-d2ce48e6fac8"), // 28-33 - fast-flowing water
        new MapAreaInfo().rho(643, 64, 657, 78).content("78f13b51-c8f0-4e21-b6e7-0198e7c990e5"), // 34 - locked door
        new MapAreaInfo().rho(622, 62, 636, 76).content("81b09134-6e01-4f8f-8b07-8c98c5bffd8d"), // 34 - treasure
        new MapToMapAreaInfo("totyp-02-07.png", "135,80,10"),
        new MapToMapAreaInfo("totyp-02-07.png", "293,51,10")
    ], []).tocHId("TheForgeofFury"),
    new MapInfo("TheFoundry", "a2/the-forge-of-fury", "totyp-02-11.png", "272c833b-8549-4956-866a-a3be417ea042", [
        new MapAreaInfo("35ChamberofStatues", "136,252,156,272"),
        new MapAreaInfo("36TheGreatHall", "296,292,316,312"),
        new MapAreaInfo("37TheBladeworks", "474,323,494,343"),
        new MapAreaInfo("38TheChasm", "551,418,571,438"),
        new MapAreaInfo("38aChainLadder", "714,291,739,311"),
        new MapAreaInfo("39CouncilChamber", "504,264,524,284"),
        new MapAreaInfo("40DurgeddinsQuarters", "642,233,662,253"),
        new MapAreaInfo("41Kitchens", "165,352,185,372"),
        new MapAreaInfo("42DesecratedShrine", "106,100,126,120"),
        new MapAreaInfo("43EntrancetotheDwarfHalls", "397,52,417,72"),
        new MapAreaInfo("44LootedRooms", "371,145,391,165"),
        new MapAreaInfo("44LootedRooms", "288,30,308,50"),
        new MapAreaInfo("44LootedRooms", "334,30,354,50"),
        new MapAreaInfo("44LootedRooms", "461,30,481,50"),
        new MapAreaInfo("44LootedRooms", "508,30,528,50"),
        new MapAreaInfo("44LootedRooms", "559,30,579,50"),
        new MapAreaInfo("44LootedRooms", "611,30,631,50"),
        new MapAreaInfo("44LootedRooms", "797,50,817,70"),
        new MapAreaInfo("44LootedRooms", "797,118,817,138"),
        new MapAreaInfo("45SkeletonRoom", "256,147,276,167"),
        new MapAreaInfo("46CommonArea", "687,30,707,50"),
        new MapAreaInfo("47ArundilsChambers", "427,145,447,165"),
        new MapAreaInfo("48LootedArmory", "669,139,689,159"),
        new MapAreaInfo("49IdallasDen", "703,214,723,234"),
        new MapAreaInfo().rect(798, 175, 823, 195).content("c01dd06c-d14e-49ca-89af-567d1789b063"), // 49a
        new MapAreaInfo().rho(104, 249, 118, 263).content("2f44a7b5-7af7-4d4a-b70d-6333b5a6444b"), // 35 - sound, track
        new MapAreaInfo().rho(80, 201, 94, 215).content("8f51ad60-8506-4ee9-87ab-96cb7e7e51e5", "f73340c1-f604-48a9-9e3e-b0c9e855ddfa"), // 35 - trap
        new MapAreaInfo().rho(127, 199, 141, 213).content("8f51ad60-8506-4ee9-87ab-96cb7e7e51e5", "f73340c1-f604-48a9-9e3e-b0c9e855ddfa"), // 35 - trap
        new MapAreaInfo().rho(141, 226, 155, 240).content("f73340c1-f604-48a9-9e3e-b0c9e855ddfa"), // 35 - secret
        new MapAreaInfo().rho(166, 226, 180, 240).content("5a1583ea-b625-40b8-af10-3d046b0c5646"), // 35 - alarm
        new MapAreaInfo().rho(315, 332, 329, 346).content("a5791f20-550d-4fdc-80e3-e9b3a8aad2a7"), // 37 - treasure
        new MapAreaInfo().rho(627, 361, 641, 375).content("ddcd56d5-beb0-4178-bcdb-d7be71b7342f"), // 38 - chasm
        new MapAreaInfo().rho(637, 205, 651, 219).content("b49d23b5-e5c0-439f-abce-5b9fae1857b3"), // 40 - secret
        new MapAreaInfo().rho(227, 138, 241, 152).content("5e267dca-0b22-43b1-a7d0-1467b75283e1"), // 42 - door
        new MapAreaInfo().rho(139, 128, 153, 142).content("78a4bcda-f30e-4555-9c32-43a3fc959916"), // 42 - treasure
        new MapAreaInfo().rho(284, 145, 298, 159).content("3c4d7bd3-eab1-4e71-b0b1-853faa80fd56"), // 45 - treasure
        new MapAreaInfo().rho(451, 181, 465, 195).content("8bd92cc6-d758-4227-9306-3cb5a5dffa89"), // 47 - treasure
        new MapAreaInfo().rho(624, 114, 638, 128).content("60d6819e-723c-4b71-8e29-537648b179c7"), // 48 - door
        new MapAreaInfo().rho(792, 200, 806, 214).content("7c69e0e9-702a-47e9-9435-f50e408baa49"), // 49a - treasure
        new MapToMapAreaInfo("totyp-02-07.png", "111,322,10"),
        new MapToMapAreaInfo("totyp-02-13.png", "699,374,10")
    ], []).tocHId("TheForgeofFury"),
    new MapInfo("TheBlackLake", "a2/the-forge-of-fury", "totyp-02-13.png", "ae1225ca-d399-4930-8cf7-15e71e2f8945", [
        new MapAreaInfo("50TheCascade", "210,238,230,258"),
        new MapAreaInfo("51DwarvenBridges", "333,67,353,87"),
        new MapAreaInfo("52NightscalesLair", "436,227,456,247"),
        new MapAreaInfo("53NightscalesHoard", "559,217,579,237"),
        new MapAreaInfo("54TheDragonsPassage", "671,105,691,125"),
        new MapAreaInfo().rho(269, 198, 283, 212).content("81de67cf-17dc-4e8f-b2d3-7ca2570cb0fe"), // 50 - tracks
        new MapAreaInfo().rho(378, 133, 392, 147).content("40dddcfd-2426-41e6-b29d-beeb71aa5763", "d3c696e4-95c7-4d78-8d30-983037a33db9"), // 51 - bridge
        new MapAreaInfo().rho(231, 124, 245, 138).content("d6017122-5789-4804-af95-4ee859eb5267", "76eff8db-a773-4f34-bfe8-d2ce48e6fac8"), // 51 - fast-flowing water
        new MapAreaInfo().rho(524, 261, 538, 275).content("b735ee79-5ca1-40d3-a003-634e8b49acc6"), // 53 - stealth
        new MapAreaInfo().rho(596, 193, 610, 207).content("d93a4243-a01b-4379-8c18-7b9a3c6b9a63"), // 53 - treasure
        new MapToMapAreaInfo("totyp-02-11.png", "252,237,10"),
        new MapToMapAreaInfo("totyp-02-11.png", "292,166,10"),
        new MapToMapAreaInfo("totyp-02-02.png", "777,107,10")
    ], []).tocHId("TheForgeofFury"),
    new MapInfo("TheHiddenShrineofTamoachan", "a3/the-hidden-shrine-of-tamoachan", "hs01.png", "cd0f8252-bbf2-4f97-a811-7d841807fca4", [
        new MapAreaInfo("1TheVaultofChicomoztoc", "795,372,805,382"),
        new MapAreaInfo("2TheHallofThrashingCanes", "773,326,783,336"),
        new MapAreaInfo("3RoostoftheConch", "713,317,723,327"),
        new MapAreaInfo("4MudFilledDoorway", "685,326,695,336"),
        new MapAreaInfo("5TombStoneandWetLime", "713,281,723,291"),
        new MapAreaInfo("6RubbleFilledStaircase", "684,263,694,273"),
        new MapAreaInfo("7TheSepulcherofTloquesPopolocas", "768,271,778,281"),
        new MapAreaInfo("8CoursesoftheGods", "713,404,723,414"),
        new MapAreaInfo("9StoneStatue", "697,430,707,440"),
        new MapAreaInfo("10SecretPassage", "677,389,687,399"),
        new MapAreaInfo("11TheCourtofCemanahuac", "641,436,651,446"),
        new MapAreaInfo("11TheCourtofCemanahuac", "666,427,676,437").content("18e03364-0b29-4587-9877-d34e18d7d9d0", "6b3f3771-cdd5-4dee-894e-9353d074715e"), // 11a - Eastern Alcove
        new MapAreaInfo("11TheCourtofCemanahuac", "666,444,676,454").content("6b3f3771-cdd5-4dee-894e-9353d074715e"), // 11a - Western Alcove
        new MapAreaInfo("12TheTombofHurakan", "609,399,619,409"),
        new MapAreaInfo("12a", "586,399,596,409"),
        new MapAreaInfo("12BTombSouthEntrance", "642,354,652,364"),
        new MapAreaInfo("13ChildofZotzilaha", "636,326,646,336"),
        new MapAreaInfo("14FloodedHall", "636,263,646,273"),
        new MapAreaInfo("15TheGreatHall", "582,299,592,309"),
        new MapAreaInfo("16SecretDoor", "562,318,572,328"),
        new MapAreaInfo("17HalloftheGreatSpirits", "527,317,537,327"),
        new MapAreaInfo("18HallwayoftheAncestors", "494,290,504,300"),
        new MapAreaInfo("19SilverCoffer", "526,390,536,400"),
        new MapAreaInfo("20SpiritGuardofAyocuan", "408,427,418,437"),
        new MapAreaInfo("20a", "462,371,472,381"),
        new MapAreaInfo("21StoneBlock", "367,371,377,381"),
        new MapAreaInfo("22ChamberoftheNacehual", "449,295,459,305"),
        new MapAreaInfo("23LightAhead", "559,263,569,273"),
        new MapAreaInfo("23ATriangularStone", "499,226,509,236"),
        new MapAreaInfo("24Sandbox", "432,226,442,236"),
        new MapAreaInfo("25TheNestoftheWarriors", "394,254,404,264"),
        new MapAreaInfo("26Ramp", "267,372,277,382"),
        new MapAreaInfo("27Stairs", "288,243,298,253"),
        new MapAreaInfo("28TheArcofNanahuatcin", "258,290,268,300"),
        new MapAreaInfo("29TheTombofPelota", "221,399,231,409"),
        new MapAreaInfo("30TheGuardianBeast", "112,354,122,364"),
        new MapAreaInfo("31CalendarStone", "84,377,94,387"),
        new MapAreaInfo("32ThePortaltoDeath", "76,395,86,405"),
        new MapAreaInfo("33TheTombofTlacaelel", "71,413,81,423"),
        new MapAreaInfo("33ASacrificetotheSun", "48,417,58,427"),
        new MapAreaInfo("34GuardiansBartheWay", "80,363,90,373"),
        new MapAreaInfo("35XipesAudienceChamber", "47,363,57,373"),
        new MapAreaInfo("36ApartmentoftheDustofAges", "194,358,204,368"),
        new MapAreaInfo("37BedofXilonen", "94,264,104,274"),
        new MapAreaInfo("38BarredPit", "138,342,148,352"),
        new MapAreaInfo("39ChamberoftheSecondSun", "176,263,186,273"),
        new MapAreaInfo("40DragonBreath", "230,318,240,328"),
        new MapAreaInfo("40DragonBreath", "380,120,390,130"),
        new MapAreaInfo("41FreeGold", "345,199,355,209"),
        new MapAreaInfo("42TheChapelofKukulkan", "376,206,386,216"),
        new MapAreaInfo("43TheSmokingMirrors", "312,189,322,199"),
        new MapAreaInfo("44SunofMotion", "315,164,325,174"),
        new MapAreaInfo("45Mictlan", "344,126,354,136"),
        new MapAreaInfo("46Tlazoteotl", "349,92,359,102"),
        new MapAreaInfo("47SpiderinHiding", "290,109,300,119"),
        new MapAreaInfo("48HoundoftheBat", "269,124,279,134"),
        new MapAreaInfo("49SacredChitzaAtlan", "258,147,268,157"),
        new MapAreaInfo("50JadeWall", "265,166,275,176"),
        new MapAreaInfo("51WindTunnel", "239,194,249,204"),
        new MapAreaInfo("52TheHiddenRoomofNahual", "252,175,262,185"),
        new MapAreaInfo("53TheValve", "199,162,209,172"),
        new MapAreaInfo("54TempleRuin", "61,149,71,159")
    ], ["#RunningtheAdventure", "#TheRuinsoftheShrine", "#TheRuinsGeneralFeatures", "#RandomEncounters",
            "#LocationsintheLowerChambers", "#LocationsontheFirstTier", "#LocationsontheSecondTier",
            "#LocationsontheThirdTier", "#TempleGrounds"]).chMap()
    // new MapInfo("DungeonGeneralFeatures", "a4/white-plume-mountain", "wpm01.png", "d97e4076-3f77-419e-89ce-73de60e31c2c", [
    // ], []).tocHId("LocationsintheDungeon"),
    // new MapInfo("Map42WhitePlumeMountain", "a4/white-plume-mountain", "wpm02.png", "ce06b1b6-1bca-476d-8414-52747a5856bd", [
    // ], []).tocHId("LocationsintheDungeon"),
    // new MapInfo("Map43GeysersandChains", "a4/white-plume-mountain", "wpm03.png", "50d37f17-0eb8-4306-bf56-96194c157470", [
    // ], []).tocHId("LocationsintheDungeon"),
    // new MapInfo("Map44BoilingLake", "a4/white-plume-mountain", "wpm04.png", "40ff75a6-3be8-49e1-a80a-e530514420aa", [
    // ], []).tocHId("LocationsintheDungeon"),
    // new MapInfo("Map45AquariumandPrison", "a4/white-plume-mountain", "wpm05.png", "f100978f-ff39-42b8-ae75-92349483ef95", [
    // ], []).tocHId("LocationsintheDungeon"),
];

const path = "adventures/tftyp/";

MapRefs.processMaps(maps, [], path);

class MapsTftYP extends MapRefs {
    static get path() {
        return path;
    }

    static get maps() {
        return maps;
    }

    static get extraMapLinks() {
        return [];
    }
}

export default MapsTftYP;