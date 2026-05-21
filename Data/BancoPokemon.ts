
export type PokemonTipo     = "Fogo" | "Agua" | "Eletrico" | "Normal";
export type PokemonRaridade = "Comum" | "Incomum" | "Epico" | "Lendario";

export interface PokemonStats {
    ataque: number;
    defesa: number;
    agilidade: number;
}

export interface DadosPokemon {
    id:             number;
    nome:           string;
    tipo:           PokemonTipo;
    imagem:         string;     
    raridade:       PokemonRaridade;
    stats:          PokemonStats;
    chanceAparicao: number;      
    taxaCaptura:    number;      
}

function taxaPorRaridade(raridade: PokemonRaridade): number {
    switch (raridade) {
        case "Comum":    return 0.85;
        case "Incomum":  return 0.50;
        case "Epico":    return 0.12;
        case "Lendario": return 0.04;
    }
}

function pesoPorRaridade(raridade: PokemonRaridade): number {
    switch (raridade) {
        case "Comum":    return 0.60;
        case "Incomum":  return 0.25;
        case "Epico":    return 0.04;
        case "Lendario": return 0.01;
    }
}

function pk(
    id: number,
    nome: string,
    tipo: PokemonTipo,
    ataque: number,
    defesa: number,
    agilidade: number,
    raridade: PokemonRaridade,
    chanceAparicao?: number,
): DadosPokemon {
    return {
        id,
        nome,
        tipo,
        imagem:         "",
        raridade,
        stats:          { ataque, defesa, agilidade },
        chanceAparicao: chanceAparicao ?? pesoPorRaridade(raridade),
        taxaCaptura:    taxaPorRaridade(raridade),
    };
}


export const BANCO_POKEMONS: DadosPokemon[] = [

    pk(1,   "Bulbasaur",   "Normal",   49,  49,  45,  "Comum"),
    pk(2,   "Ivysaur",     "Normal",   62,  63,  60,  "Comum"),
    pk(3,   "Venusaur",    "Normal",   82,  83,  80,  "Comum"),
    pk(4,   "Charmander",  "Fogo",     52,  43,  65,  "Comum"),
    pk(5,   "Charmeleon",  "Fogo",     64,  58,  80,  "Comum"),
    pk(6,   "Charizard",   "Fogo",     84,  78, 100,  "Comum"),
    pk(7,   "Squirtle",    "Agua",     48,  65,  43,  "Comum"),
    pk(8,   "Wartortle",   "Agua",     63,  80,  58,  "Comum"),
    pk(9,   "Blastoise",   "Agua",     83, 100,  78,  "Comum"),
    pk(10,  "Caterpie",    "Normal",   30,  35,  45,  "Comum"),
    pk(11,  "Metapod",     "Normal",   20,  55,  30,  "Comum"),
    pk(12,  "Butterfree",  "Normal",   45,  50,  70,  "Comum"),
    pk(13,  "Weedle",      "Normal",   35,  30,  50,  "Comum"),
    pk(14,  "Kakuna",      "Normal",   25,  50,  35,  "Comum"),
    pk(15,  "Beedrill",    "Normal",   90,  40,  75,  "Comum"),
    pk(16,  "Pidgey",      "Normal",   45,  40,  56,  "Comum"),
    pk(17,  "Pidgeotto",   "Normal",   60,  55,  71,  "Comum"),
    pk(18,  "Pidgeot",     "Normal",   80,  75, 101,  "Comum"),
    pk(19,  "Rattata",     "Normal",   56,  35,  72,  "Comum"),
    pk(20,  "Raticate",    "Normal",   81,  60,  97,  "Comum"),
    pk(21,  "Spearow",     "Normal",   60,  30,  70,  "Comum"),
    pk(22,  "Fearow",      "Normal",   90,  65, 100,  "Comum"),
    pk(23,  "Ekans",       "Normal",   60,  44,  55,  "Comum"),
    pk(24,  "Arbok",       "Normal",   85,  69,  80,  "Comum"),
    pk(25,  "Pikachu",     "Eletrico", 55,  40,  90,  "Comum"),
    pk(26,  "Raichu",      "Eletrico", 90,  55, 110,  "Comum"),
    pk(27,  "Sandshrew",   "Normal",   75,  85,  40,  "Comum"),
    pk(28,  "Sandslash",   "Normal",  100, 110,  65,  "Comum"),
    pk(29,  "Nidoran-F",   "Normal",   47,  52,  41,  "Comum"),
    pk(30,  "Nidorina",    "Normal",   62,  67,  56,  "Comum"),
    pk(31,  "Nidoqueen",   "Normal",   92,  87,  76,  "Comum"),
    pk(32,  "Nidoran-M",   "Normal",   57,  40,  50,  "Comum"),
    pk(33,  "Nidorino",    "Normal",   72,  57,  65,  "Comum"),
    pk(34,  "Nidoking",    "Normal",  102,  77,  85,  "Comum"),
    pk(35,  "Clefairy",    "Normal",   45,  48,  35,  "Comum"),
    pk(36,  "Clefable",    "Normal",   70,  73,  60,  "Comum"),
    pk(37,  "Vulpix",      "Fogo",     41,  40,  65,  "Comum"),
    pk(38,  "Ninetales",   "Fogo",     76,  75, 100,  "Comum"),
    pk(39,  "Jigglypuff",  "Normal",   45,  20,  20,  "Comum"),
    pk(40,  "Wigglytuff",  "Normal",   70,  45,  45,  "Comum"),
    pk(41,  "Zubat",       "Normal",   45,  35,  55,  "Comum"),
    pk(42,  "Golbat",      "Normal",   80,  70,  90,  "Comum"),
    pk(43,  "Oddish",      "Normal",   50,  55,  30,  "Comum"),
    pk(44,  "Gloom",       "Normal",   65,  70,  40,  "Comum"),
    pk(45,  "Vileplume",   "Normal",   80,  85,  50,  "Comum"),
    pk(46,  "Paras",       "Normal",   70,  55,  25,  "Comum"),
    pk(47,  "Parasect",    "Normal",   95,  80,  30,  "Comum"),
    pk(48,  "Venonat",     "Normal",   55,  50,  45,  "Comum"),
    pk(49,  "Venomoth",    "Normal",   65,  60,  90,  "Comum"),
    pk(50,  "Diglett",     "Normal",   55,  25,  95,  "Comum"),
    pk(51,  "Dugtrio",     "Normal",   80,  50, 120,  "Comum"),
    pk(52,  "Meowth",      "Normal",   45,  35,  90,  "Comum"),
    pk(53,  "Persian",     "Normal",   70,  60, 115,  "Comum"),
    pk(54,  "Psyduck",     "Agua",     52,  48,  55,  "Comum"),
    pk(55,  "Golduck",     "Agua",     82,  78,  85,  "Comum"),
    pk(56,  "Mankey",      "Normal",   80,  35,  70,  "Comum"),
    pk(57,  "Primeape",    "Normal",  105,  60,  95,  "Comum"),
    pk(58,  "Growlithe",   "Fogo",     70,  45,  60,  "Comum"),
    pk(59,  "Arcanine",    "Fogo",    110,  80,  95,  "Comum"),
    pk(60,  "Poliwag",     "Agua",     50,  40,  90,  "Comum"),
    pk(61,  "Poliwhirl",   "Agua",     65,  65,  90,  "Comum"),
    pk(62,  "Poliwrath",   "Agua",     95,  95,  70,  "Comum"),
    pk(63,  "Abra",        "Normal",   20,  15,  90,  "Comum"),
    pk(64,  "Kadabra",     "Normal",   35,  30, 105,  "Comum"),
    pk(65,  "Alakazam",    "Normal",   50,  45, 120,  "Comum"),
    pk(66,  "Machop",      "Normal",   80,  50,  35,  "Comum"),
    pk(67,  "Machoke",     "Normal",  100,  80,  45,  "Comum"),
    pk(68,  "Machamp",     "Normal",  130,  80,  55,  "Comum"),
    pk(69,  "Bellsprout",  "Normal",   75,  35,  40,  "Comum"),
    pk(70,  "Weepinbell",  "Normal",   90,  50,  55,  "Comum"),
    pk(71,  "Victreebel",  "Normal",  105,  65,  70,  "Comum"),
    pk(72,  "Tentacool",   "Agua",     40,  35,  70,  "Comum"),
    pk(73,  "Tentacruel",  "Agua",     70,  65, 100,  "Comum"),
    pk(74,  "Geodude",     "Normal",   80, 100,  20,  "Comum"),
    pk(75,  "Graveler",    "Normal",   95, 115,  35,  "Comum"),
    pk(76,  "Golem",       "Normal",  120, 130,  45,  "Comum"),
    pk(77,  "Ponyta",      "Fogo",     85,  55,  90,  "Comum"),
    pk(78,  "Rapidash",    "Fogo",    100,  70, 105,  "Comum"),
    pk(79,  "Slowpoke",    "Agua",     65,  65,  15,  "Comum"),
    pk(80,  "Slowbro",     "Agua",     75, 110,  30,  "Comum"),
    pk(81,  "Magnemite",   "Eletrico", 35,  70,  45,  "Comum"),
    pk(82,  "Magneton",    "Eletrico", 60,  95,  70,  "Comum"),
    pk(83,  "Farfetchd",   "Normal",   65,  55,  60,  "Comum"),
    pk(84,  "Doduo",       "Normal",   85,  45,  75,  "Comum"),
    pk(85,  "Dodrio",      "Normal",  110,  70, 100,  "Comum"),
    pk(86,  "Seel",        "Agua",     45,  55,  45,  "Comum"),
    pk(87,  "Dewgong",     "Agua",     70,  80,  70,  "Comum"),
    pk(88,  "Grimer",      "Normal",   80,  50,  25,  "Comum"),
    pk(89,  "Muk",         "Normal",  105,  75,  50,  "Comum"),
    pk(90,  "Shellder",    "Agua",     65, 100,  40,  "Comum"),
    pk(91,  "Cloyster",    "Agua",     95, 180,  70,  "Comum"),
    pk(92,  "Gastly",      "Normal",   35,  30,  80,  "Comum"),
    pk(93,  "Haunter",     "Normal",   50,  45,  95,  "Comum"),
    pk(94,  "Gengar",      "Normal",   65,  60, 110,  "Comum"),
    pk(95,  "Onix",        "Normal",   45, 160,  70,  "Comum"),
    pk(96,  "Drowzee",     "Normal",   48,  45,  42,  "Comum"),
    pk(97,  "Hypno",       "Normal",   73,  70,  67,  "Comum"),
    pk(98,  "Krabby",      "Agua",    105,  90,  50,  "Comum"),
    pk(99,  "Kingler",     "Agua",    130, 115,  75,  "Comum"),
    pk(100, "Voltorb",     "Eletrico", 30,  50, 100,  "Comum"),
    pk(101, "Electrode",   "Eletrico", 50,  70, 140,  "Comum"),
    pk(102, "Exeggcute",   "Normal",   40,  80,  40,  "Comum"),
    pk(103, "Exeggutor",   "Normal",   95,  85,  55,  "Comum"),
    pk(104, "Cubone",      "Normal",   50,  95,  35,  "Comum"),
    pk(105, "Marowak",     "Normal",   80, 110,  45,  "Comum"),
    pk(106, "Hitmonlee",   "Normal",  120,  53,  87,  "Comum"),
    pk(107, "Hitmonchan",  "Normal",  105,  79,  76,  "Comum"),
    pk(108, "Lickitung",   "Normal",   55,  75,  30,  "Comum"),
    pk(109, "Koffing",     "Normal",   65,  95,  35,  "Comum"),
    pk(110, "Weezing",     "Normal",   90, 120,  60,  "Comum"),
    pk(111, "Rhyhorn",     "Normal",   85,  95,  25,  "Comum"),
    pk(112, "Rhydon",      "Normal",  130, 120,  40,  "Comum"),
    pk(113, "Chansey",     "Normal",    5,   5,  50,  "Comum"),
    pk(114, "Tangela",     "Normal",   55, 115,  60,  "Comum"),
    pk(115, "Kangaskhan",  "Normal",   95,  80,  90,  "Comum"),
    pk(116, "Horsea",      "Agua",     40,  70,  60,  "Comum"),
    pk(117, "Seadra",      "Agua",     65,  95,  85,  "Comum"),
    pk(118, "Goldeen",     "Agua",     67,  60,  63,  "Comum"),
    pk(119, "Seaking",     "Agua",     92,  65,  68,  "Comum"),
    pk(120, "Staryu",      "Agua",     45,  55,  85,  "Comum"),
    pk(121, "Starmie",     "Agua",     75,  85, 115,  "Incomum"),
    pk(122, "Mr. Mime",    "Normal",   45,  65,  90,  "Incomum"),
    pk(123, "Scyther",     "Normal",  110,  80, 105,  "Incomum"),
    pk(124, "Jynx",        "Normal",   50,  35,  95,  "Incomum"),
    pk(125, "Electabuzz",  "Eletrico", 83,  57, 105,  "Incomum"),
    pk(126, "Magmar",      "Fogo",     95,  57,  93,  "Incomum"),
    pk(127, "Pinsir",      "Normal",  125, 100,  85,  "Incomum"),
    pk(128, "Tauros",      "Normal",  100,  95, 110,  "Incomum"),
    pk(129, "Magikarp",    "Agua",     10,  55,  80,  "Incomum"),
    pk(130, "Gyarados",    "Agua",    125,  79,  81,  "Incomum"),
    pk(131, "Lapras",      "Agua",     85,  80,  60,  "Incomum"),
    pk(132, "Ditto",       "Normal",   48,  48,  48,  "Incomum"),
    pk(133, "Eevee",       "Normal",   55,  50,  55,  "Incomum"),
    pk(134, "Vaporeon",    "Agua",     65,  60,  65,  "Incomum"),
    pk(135, "Jolteon",     "Eletrico", 65,  60, 130,  "Incomum"),
    pk(136, "Flareon",     "Fogo",    130,  60,  65,  "Incomum"),
    pk(137, "Porygon",     "Normal",   60,  70,  40,  "Incomum"),
    pk(138, "Omanyte",     "Agua",     40, 100,  35,  "Incomum"),
    pk(139, "Omastar",     "Agua",     60, 125,  55,  "Incomum"),
    pk(140, "Kabuto",      "Agua",     80,  90,  55,  "Incomum"),
    pk(141, "Kabutops",    "Agua",    115, 105,  80,  "Incomum"),
    pk(142, "Aerodactyl",  "Normal",  105,  65, 130,  "Incomum"),
    pk(143, "Snorlax",     "Normal",  110,  65,  30,  "Incomum"),
    pk(144, "Articuno",    "Normal",   85, 100,  85,  "Incomum"),
    pk(145, "Zapdos",      "Eletrico", 90,  85, 100,  "Incomum"),
    pk(146, "Moltres",    "Fogo",    100,  90,  90,  "Epico"),
    pk(147, "Dratini",    "Normal",   64,  45,  50,  "Epico"),
    pk(148, "Dragonair",  "Normal",   84,  65,  70,  "Epico"),
    pk(149, "Dragonite",  "Normal",  134,  95,  80,  "Epico"),
    pk(150, "Mewtwo",     "Normal",  154,  90, 130,  "Lendario"),
    pk(151, "blimblimblimblimblim",     "Fogo",  1000000,  1000000, 1000000,  "Lendario"),
];