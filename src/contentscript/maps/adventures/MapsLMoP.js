import MapAreaInfo from "../MapAreaInfo";
import MapInfo from "../MapInfo";
import MapRefs from "../MapRefs";
import MapToMapAreaInfo from "../MapToMapAreaInfo";

const maps = [
    new MapInfo("TheForgottenRealms", "lmop/introduction", "lmop01.jpg", "ae56f101-0094-492f-95d7-11d9884069a0", [
        new MapAreaInfo("Part1GoblinArrows", "124,385,144,405", "lmop/goblin-arrows"),
        new MapAreaInfo("CragmawHideout", "249,574,269,594", "lmop/goblin-arrows"),
        new MapAreaInfo("Part2Phandalin", "334,624,354,644", "lmop/phandalin"),
        new MapAreaInfo("TriboarTrail", "363,497,405,532", "lmop/the-spiders-web"),
        new MapAreaInfo("ConyberryandAgathasLair", "465,419,485,439", "lmop/the-spiders-web"),
        new MapAreaInfo("ConyberryandAgathasLair", "490,424,510,444", "lmop/the-spiders-web"),
        new MapAreaInfo("OldOwlWell", "542,490,562,510", "lmop/the-spiders-web"),
        new MapAreaInfo("RuinsofThundertree", "238,372,258,392", "lmop/the-spiders-web"),
        new MapAreaInfo("WyvernTor", "544,547,564,567", "lmop/the-spiders-web"),
        new MapAreaInfo("CragmawCastle", "323,486,343,506", "lmop/the-spiders-web"),
        new MapAreaInfo("Part4WaveEchoCave", "397,620,417,640", "lmop/wave-echo-cave"),
        new MapToMapAreaInfo("lmop02.jpg", "282,584,10"),
        new MapToMapAreaInfo("lmop03.jpg", "321,634,10"),
        new MapToMapAreaInfo("lmop05.jpg", "271,382,10"),
        new MapToMapAreaInfo("lmop06.jpg", "333,473,10"),
        new MapToMapAreaInfo("lmop07.jpg", "384,630,10")
    ]),
    new MapInfo("CragmawHideout", "lmop/goblin-arrows", "lmop02.jpg", "fa674c90-e57f-415d-abf2-bbb34a9a2ec8", [
        new MapAreaInfo("1CaveMouth", "226,451,256,481"),
        new MapAreaInfo("2GoblinBlind", "395,423,425,453"),
        new MapAreaInfo("3Kennel", "423,309,453,339"),
        new MapAreaInfo("4SteepPassage", "343,159,373,189"),
        new MapAreaInfo("5Overpass", "434,77,464,107"),
        new MapAreaInfo("6GoblinDen", "112,167,142,197"),
        new MapAreaInfo("7TwinPoolsCave", "650,225,680,255"),
        new MapAreaInfo("8KlargsCave", "706,366,736,396"),
        new MapAreaInfo().rho(307, 458, 327, 478).content("df50dcbd-c4a7-4fb5-8f76-e53e63e12d06"), // 1 - Thickets
        new MapAreaInfo().rho(350, 436, 370, 456).content("b5ceffbd-01b0-4eec-9d6c-7b52066f3398"), // 2 - Thickets
        new MapAreaInfo().rho(522, 336, 542, 356).content("f00200fd-dcfa-499a-b463-6b4dac979750"), // 3 - Fissure
        new MapAreaInfo().rho(305, 171, 325, 191).content("5b750d49-4b05-4d28-9660-9390ef730b3f"), // 4 - Western Passage
        new MapAreaInfo().rho(245, 171, 265, 191).content("5b750d49-4b05-4d28-9660-9390ef730b3f"), // 4 - Western Passage
        new MapAreaInfo().rho(277, 170, 297, 190).content("96c17cda-254b-4215-994b-758b387e5fbe"), // 4 - ledge passage
        new MapAreaInfo("Flood").rho(505, 86, 525, 106), // 5 - flood
        new MapAreaInfo().rho(694, 160, 714, 180).content("22882077-3c03-4cdb-986c-a445d10ddf02"), // 7 - Rock Dams
        new MapAreaInfo().rho(655, 372, 675, 392).content("5d6629f8-57d6-4b02-98ad-a9d32daa77bc"), // 8 - Fire Pit
        new MapAreaInfo().rho(569, 340, 589, 360).content("b3f02362-5e1f-4b88-97c6-13cc1507e91d"), // 8 - Natural Chimney
        new MapAreaInfo().rho(712, 453, 732, 473).content("24335813-1db6-4622-a7b0-5656f06d7f34", "529c6c0d-fa15-4234-95c2-8152b1682d6f") // 8 - Supplies
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
        new MapToMapAreaInfo("lmop04.jpg", "741,260,7")
    ], ["#EncountersinPhandalin", "#TownDescription", "#RoleplayingPhandalinNPCs", "#RedbrandRuffians",
            "#Confrontation"]).chMap(),
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
        new MapAreaInfo().rho(556, 512, 576, 532).content("e40ed89b-ab88-495d-a155-fdff84772c99", "44476fb5-737a-479e-89aa-ee0f7826e20e"), // Secret Doors
        new MapAreaInfo().rho(441, 88, 461, 108).content("e40ed89b-ab88-495d-a155-fdff84772c99", "44476fb5-737a-479e-89aa-ee0f7826e20e"), // Secret Doors
        new MapAreaInfo().rho(302, 144, 322, 164).content("e40ed89b-ab88-495d-a155-fdff84772c99", "44476fb5-737a-479e-89aa-ee0f7826e20e"), // Secret Doors
        new MapAreaInfo().rho(274, 88, 294, 108).content("e40ed89b-ab88-495d-a155-fdff84772c99", "44476fb5-737a-479e-89aa-ee0f7826e20e"), // Secret Doors
        new MapAreaInfo().rho(603, 441, 623, 461).content("d57a8aa1-db0c-4e34-b63b-10f31eb0dbc2", "6b7d7f66-1471-4cfa-965f-dfd51428ebde"), // 1 - Cistern
        new MapAreaInfo().rho(580, 441, 600, 461).content("afce0248-ab07-478a-a7d3-07d3861b8e78"), // 1 - trasure
        new MapAreaInfo().rho(599, 371, 619, 391).content("aa095db6-1bc2-4246-b739-b0c62937ccf3"), // 1 - barrels
        new MapAreaInfo().rho(465, 451, 485, 471).content("67254793-b21b-461f-8d31-833f807ecf36"), // 2 - barrels
        new MapAreaInfo().rho(642, 301, 662, 321).content("deea64ab-0976-4ee3-b432-04f49336c955", "cbdbd5ed-df8b-4317-b602-d3a41999f93a"), // 3 - pit trap
        new MapAreaInfo().rho(457, 222, 477, 242).content("da0ed011-fe70-42de-b850-c2023313ba2b"), // 4 - stone lid
        new MapAreaInfo().rho(457, 280, 477, 300).content("71bcaec9-673f-442f-9d7a-8a31a0634b5d"), // 4 - treasure
        new MapAreaInfo().rho(600, 216, 620, 236).content("325017e6-93a0-48d1-bfd0-5b41c85e3a2e"), // 5 - Cell Doors
        new MapAreaInfo().rho(599, 131, 619, 151).content("325017e6-93a0-48d1-bfd0-5b41c85e3a2e"), // 5 - Cell Doors
        new MapAreaInfo().rho(472, 89, 492, 109).content("5a0325a6-8017-460a-8fb4-7815dd8e4200", "e40ed89b-ab88-495d-a155-fdff84772c99"), // 6 - locked door
        new MapAreaInfo().rho(523, 143, 543, 163).content("c1e6ac96-3f14-49f3-8994-d41a485a91ba"), // 6 - weapons
        new MapAreaInfo().rho(323, 87, 343, 107).content("b23c2aae-c142-4831-8592-79646439c314"), // 7 - treasure
        new MapAreaInfo().rho(312, 256, 332, 276).content("9b1440f9-f400-48f9-8b8d-47fea1435585"), // 8- Bridges
        new MapAreaInfo().rho(312, 427, 332, 447).content("9b1440f9-f400-48f9-8b8d-47fea1435585"), // 8- Bridges
        new MapAreaInfo().rho(314, 345, 334, 365).content("3d36523c-c1ba-404c-be15-5879be0360b8", "24249d5f-2d1e-467e-85b0-d43af44b6a0e"), // 8 - Crevasse
        new MapAreaInfo().rho(312, 232, 332, 252).content("24249d5f-2d1e-467e-85b0-d43af44b6a0e"), // 8 - treasure
        new MapAreaInfo().rho(90, 442, 110, 462).content("0a1e22ce-bf97-4169-b361-7aa60b9590b8"), // 9 - door
        new MapAreaInfo().rho(90, 356, 110, 376).content("f13c9e97-8f12-4fda-b6d3-59962469c2de"), // 10 - doors
        new MapAreaInfo().rho(119, 214, 139, 234).content("f13c9e97-8f12-4fda-b6d3-59962469c2de"), // 10 - doors
        new MapAreaInfo().rho(91, 258, 111, 278).content("92dbaa89-a9dc-4729-8ea2-ecb8c0ef15eb"), // 10 - treasure
        new MapAreaInfo().rho(91, 120, 111, 140).content("ae01aac2-fe98-4602-bbfa-988654d924bd", "90b12084-ea04-4def-bc77-c5c4f6f375eb"), // 11 - Books and Notes
        new MapAreaInfo().rho(53, 172, 73, 192).content("139e4fbc-d99f-4153-875c-8472596e9f69"), // 11 - treasure
        new MapAreaInfo().rho(232, 83, 252, 103).content("49ee9010-2408-4042-b1f4-cb22c443a2e2", "3e925bb9-5928-4718-adc2-6ddd8cc8b3d9"), // 12 - desk
        new MapAreaInfo().rho(220, 148, 240, 168).content("65dd4195-294a-4990-b95f-6adfb589933b"), // 12 - Treasure
        new MapToMapAreaInfo("lmop03.jpg", "809,437,15")
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
        new MapAreaInfo("13DragonCultists", "733,450,763,480"),
        new MapAreaInfo().rho(231, 260, 251, 280).content("17d429ac-6830-4371-a006-efb00edb0024"), // 2 - treasure
        new MapAreaInfo().rho(456, 342, 476, 362).content("cec2015f-0e17-4581-9f28-cc606545ad95", "dfc283cf-766c-47bb-a499-f3a4a7feb1a9"), // 6 - Webs
        new MapAreaInfo().rho(484, 72, 504, 92).content("03f015bb-67cc-49c6-b1d7-249f20c36aeb", "6cd4a750-63f7-4db2-b549-e88678c60c62"), // 7 - Tower
        new MapAreaInfo().rho(430, 370, 450, 390).content("dfc283cf-766c-47bb-a499-f3a4a7feb1a9"), // 6 - treasure
        new MapAreaInfo().rho(400, 88, 420, 108).content("6cd4a750-63f7-4db2-b549-e88678c60c62"), // 7 - Cottage
        new MapAreaInfo().rho(484, 110, 504, 130).content("a1ff3485-211d-46ce-af2a-536bd87644a9"), // 7 - treasure
        new MapAreaInfo().rho(484, 485, 504, 505).content("ca7e0c18-52a4-4c48-bef5-e3016ebfbb64"), // 8 - tools
        new MapAreaInfo().rho(597, 403, 617, 423).content("49794277-f5ba-4afa-82f5-4322847040b8", "28630edc-bea5-43a2-bd3c-84953616029b"), // 9 - treasure
        new MapAreaInfo().rho(668, 159, 688, 179).content("39b6004c-f321-4ff1-bf54-0f5c97760011"), // 10 - statue
        new MapAreaInfo().rho(679, 52, 699, 72).content("2fb29902-3c44-4a78-8420-7268ee781938"), // 11 - ladder 
        new MapAreaInfo().rho(771, 499, 791, 519).content("49a88624-1f6d-44cd-a254-c8257d482625"), // 13 - doors
        new MapAreaInfo().rho(753, 405, 773, 425).content("49a88624-1f6d-44cd-a254-c8257d482625"), // 13 - doors
        new MapAreaInfo().rho(738, 486, 758, 506).content("c174e393-dc67-44b4-a00c-c176a25cad83") // 13 - treasure
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
        new MapAreaInfo("12GuardBarracks", "558,309,588,339"),
        new MapAreaInfo("13OwlbearTower", "531,417,561,447"),
        new MapAreaInfo("14KingsQuarters", "639,146,669,176"),
        new MapAreaInfo().rho(457, 70, 477, 90).content("d19689d4-63f9-4ddc-9778-54c4d5faef56"), // 11 - Dusty canvas
        new MapAreaInfo().rho(262, 282, 282, 302).content("e913e64f-24d0-4bdd-a174-2ec1d93d7aec", "5fd03ecc-381f-48e4-b0ca-6767caa3a569"), // 2 - trap
        new MapAreaInfo().rho(186, 111, 206, 131).content("56eb64a1-a297-45fb-bc2f-9d6cfd4a4820", "4f5bd228-4177-43ef-8849-87d842e8901d"), // 5 - loot
        new MapAreaInfo().rho(156, 111, 176, 131).content("1b984ce5-61fa-43e4-b4a9-353264a5b1c0"), // 6 - treasure
        new MapAreaInfo().rho(319, 204, 339, 224).content("143ed6a8-deb6-4f6f-90fa-eb1c5ab42463"), // 8 - treasure
        new MapAreaInfo().rho(334, 95, 354, 115).content("f9cd6fd6-639c-4923-8345-4a65a28bffe7", "e9a11bc0-47ef-4902-8cfd-5239bdce870c"), // 9 - altar
        new MapAreaInfo().rho(428, 435, 448, 455).content("b840b8de-8ade-44de-b852-f1643c06f983"), // 10 - door
        new MapAreaInfo().rho(346, 433, 366, 453).content("af310451-f70c-4390-b412-bfd2d8b7e466"), // 10 - Arrow Slits
        new MapAreaInfo().rho(536, 381, 556, 401).content("83471833-897f-48d2-a965-6cda68ec4b12"), // 13 - door
        new MapAreaInfo().rho(595, 435, 615, 455).content("1edf7679-42d9-4238-855e-89be65eb9ba2"), // 13 - Arrow Slits
        new MapAreaInfo().rho(489, 400, 509, 420).content("2df97330-7780-4aff-8a13-368c566658af"), // 13 - treasure
        new MapAreaInfo().rho(603, 178, 623, 198).content("2f931f3c-288c-4cd9-9a5c-8e84d33abe63"), // 14 - door
        new MapAreaInfo().rho(701, 97, 721, 117).content("04221146-bd46-44c9-9b58-3df2abab623e"), // 14 - Arrow Slits
        new MapAreaInfo().rho(578, 140, 598, 160).content("896ff4bf-da47-47ca-9403-72cdc81dfe21"),// 14 - Northwest Room
        new MapAreaInfo().rho(617, 233, 637, 253).content("a1560108-9fb6-4bc5-a372-c1e6e9b096bf"), // 14 - dwarf
        new MapAreaInfo().rho(623, 98, 643, 118).content("95554e91-2fd0-468a-a4ac-4826402a1bc4") // 14 - treasure
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
        new MapAreaInfo("20PriestsQuarters", "130,65,150,85"),
        new MapAreaInfo().rho(151, 588, 167, 604).content("670be885-46b5-4c05-981d-6e48a99b2452"), // 1 - pit
        new MapAreaInfo().rho(109, 597, 125, 613).content("8137957c-111d-4d72-af79-3fdb1b597f3f"), // 1 - treasure
        new MapAreaInfo().rho(357, 695, 373, 711).content("678b955d-0aba-4ab2-a0c2-c398970316b4"), // 5 - treasure
        new MapAreaInfo().rho(296, 526, 312, 542).content("126cd5e6-81f2-43e0-bc84-68e771c8a599"), // 6 - door
        new MapAreaInfo().rho(472, 550, 488, 566).content("43ba31e3-e48e-4ac5-b2d0-0d43f63dab5d"), // 8 - gas
        new MapAreaInfo().rho(254, 328, 270, 344).content("6c0f3f38-5a67-4204-ac06-78b0800d06da"), // 9 - escarpments
        new MapAreaInfo().rho(84, 212, 100, 228).content("1d3851cc-5f6e-4f3b-bfb7-e95f590fd0ea"), // 10 - treasure
        new MapAreaInfo().rho(253, 241, 269, 257).content("ce9614fb-dee1-4d95-bb5d-16dcb2a48841"), // 11 - door
        new MapAreaInfo().rho(466, 429, 482, 445).content("6111952b-f9ec-41ab-8f98-8c81b9d2c0c2"), // 13 - cavern
        new MapAreaInfo().rho(510, 438, 526, 454).content("5fa0b672-f1d9-4029-862e-be253f9041ea"), // 14 - doors
        new MapAreaInfo().rho(550, 455, 566, 471).content("ee86a6b8-e57a-4b00-b1b1-da1502a56a1f"), // 14 - treasure
        new MapAreaInfo().rho(494, 325, 510, 341).content("c2c0224b-7204-43b5-a70d-b5c7d6205a91"), // 15 - doors
        new MapAreaInfo().rho(526, 278, 542, 294).content("c2c0224b-7204-43b5-a70d-b5c7d6205a91"), // 15 - doors
        new MapAreaInfo().rho(522, 321, 538, 337).content("81d6aad1-bc6a-44b3-979c-5e8933d0d8fa"), // 15 - Brazier of Green Flame
        new MapAreaInfo().rho(545, 284, 561, 300).content("f416c1fb-7801-48de-a81d-59ac9de65370"), // 15 - Northern Room
        new MapAreaInfo().rho(550, 340, 566, 356).content("a71ff599-3d18-4199-a8a9-6ab594623cf0"), // 15 - treasure
        new MapAreaInfo().rho(225, 113, 241, 129).content("0a0a2f3c-e794-49b6-9582-07f50c5fda12"), // 18 - Rift
        new MapAreaInfo().rho(253, 143, 269, 159).content("3c869841-6eb9-471c-a87b-a2cc9488dfa3"), // 18 - treasure
        new MapAreaInfo().rho(68, 52, 84, 68).content("fed8a05a-e5d9-4a97-b901-eccdeb7a11ee", "420e5c23-c2da-43ed-b0a7-c840ab7d1726"), // 19 - Statue
        new MapAreaInfo().rho(36, 67, 52, 83).content("420e5c23-c2da-43ed-b0a7-c840ab7d1726"), // 19 - table
        new MapAreaInfo().rho(135, 91, 151, 107).content("8ca5157b-1e73-4651-b31d-2dba89082673", "30767cbe-9843-41f2-80c9-e84cd0f8209a") // 20 - door
    ], ["#CharacterLevel", "#ExperiencePointAwards", "#KeyedEncounters", "#WanderingMonsters",
            "#GeneralFeatures", "#Conclusion"]).chMap()
];

MapRefs.processMapToMapRefs(maps);

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