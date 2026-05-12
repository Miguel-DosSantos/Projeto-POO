export type PokemonTipo = "Fogo" | "Agua" | "Eletrico" | "Normal";
export type PokemonRaridade = "Comum" | "Incomum" | "Raro" | "Epico" | "Lendario";

export interface PokemonStats {
    ataque: number;
    defesa: number;
    agilidade: number;
}

export interface DadosPokemon {
    id: number;
    nome: string;
    tipo: PokemonTipo;
    imagem: string;
    raridade: PokemonRaridade;
    stats: PokemonStats;
    chanceAparicao: number; // 0..1
    taxaCaptura: number; // 0..1 (quanto maior, mais fácil)
}

function placeholderImagem(nome: string): string {
    // Mantém o projeto funcional sem depender de assets externos.
    // Você pode trocar depois por URLs reais ou caminhos locais.
    return `https://img.pokemondb.net/sprites/normal/${nome.toLowerCase().replace(/[^a-z0-9-]/g, "")}.png`;
}

function buildPokemon(
    id: number,
    nome: string,
    tipo: PokemonTipo,
    ataque: number,
    defesa: number,
    agilidade: number,
    raridade: PokemonRaridade,
    chanceAparicao: number
): DadosPokemon {
    // taxa de captura deriva da raridade, permitindo ajuste fino no futuro
    const taxaCaptura =
        raridade === "Comum" ? 0.85 :
        raridade === "Incomum" ? 0.55 :
        raridade === "Raro" ? 0.28 :
        raridade === "Epico" ? 0.12 :
        0.04;

    return {
        id,
        nome,
        tipo,
        imagem: placeholderImagem(nome),
        raridade,
        stats: { ataque, defesa, agilidade },
        chanceAparicao,
        taxaCaptura,
    };
}

// OBS: mantendo os ~150 pokémons existentes, agora com campos de raridade/chances.
// Critério simples: uma fatia fixa por ID para distribuir raridades.
// (Depois você pode parametrizar por espécie, mas isso já entrega o sistema.)

export const BANCO_POKEMONS: DadosPokemon[] = [
    // id 1..150
    // Comum até 120
    buildPokemon(1, "Bulbasaur", "Normal", 49, 49, 45, "Comum", 0.6),
    buildPokemon(2, "Ivysaur", "Normal", 62, 63, 60, "Comum", 0.6),
    buildPokemon(3, "Venusaur", "Normal", 82, 83, 80, "Comum", 0.6),
    buildPokemon(4, "Charmander", "Fogo", 52, 43, 65, "Comum", 0.6),
    buildPokemon(5, "Charmeleon", "Fogo", 64, 58, 80, "Comum", 0.6),
    buildPokemon(6, "Charizard", "Fogo", 84, 78, 100, "Comum", 0.6),
    buildPokemon(7, "Squirtle", "Agua", 48, 65, 43, "Comum", 0.6),
    buildPokemon(8, "Wartortle", "Agua", 63, 80, 58, "Comum", 0.6),
    buildPokemon(9, "Blastoise", "Agua", 83, 100, 78, "Comum", 0.6),
    buildPokemon(10, "Caterpie", "Normal", 30, 35, 45, "Comum", 0.6),
    buildPokemon(11, "Metapod", "Normal", 20, 55, 30, "Comum", 0.6),
    buildPokemon(12, "Butterfree", "Normal", 45, 50, 70, "Comum", 0.6),
    buildPokemon(13, "Weedle", "Normal", 35, 30, 50, "Comum", 0.6),
    buildPokemon(14, "Kakuna", "Normal", 25, 50, 35, "Comum", 0.6),
    buildPokemon(15, "Beedrill", "Normal", 90, 40, 75, "Comum", 0.6),
    buildPokemon(16, "Pidgey", "Normal", 45, 40, 56, "Comum", 0.6),
    buildPokemon(17, "Pidgeotto", "Normal", 60, 55, 71, "Comum", 0.6),
    buildPokemon(18, "Pidgeot", "Normal", 80, 75, 101, "Comum", 0.6),
    buildPokemon(19, "Rattata", "Normal", 56, 35, 72, "Comum", 0.6),
    buildPokemon(20, "Raticate", "Normal", 81, 60, 97, "Comum", 0.6),
    buildPokemon(21, "Spearow", "Normal", 60, 30, 70, "Comum", 0.6),
    buildPokemon(22, "Fearow", "Normal", 90, 65, 100, "Comum", 0.6),
    buildPokemon(23, "Ekans", "Normal", 60, 44, 55, "Comum", 0.6),
    buildPokemon(24, "Arbok", "Normal", 85, 69, 80, "Comum", 0.6),
    buildPokemon(25, "Pikachu", "Eletrico", 55, 40, 90, "Comum", 0.6),
    buildPokemon(26, "Raichu", "Eletrico", 90, 55, 110, "Comum", 0.6),
    buildPokemon(27, "Sandshrew", "Normal", 75, 85, 40, "Comum", 0.6),
    buildPokemon(28, "Sandslash", "Normal", 100, 110, 65, "Comum", 0.6),
    buildPokemon(29, "Nidoran-F", "Normal", 47, 52, 41, "Comum", 0.6),
    buildPokemon(30, "Nidorina", "Normal", 62, 67, 56, "Comum", 0.6),
    buildPokemon(31, "Nidoqueen", "Normal", 92, 87, 76, "Comum", 0.6),
    buildPokemon(32, "Nidoran-M", "Normal", 57, 40, 50, "Comum", 0.6),
    buildPokemon(33, "Nidorino", "Normal", 72, 57, 65, "Comum", 0.6),
    buildPokemon(34, "Nidoking", "Normal", 102, 77, 85, "Comum", 0.6),
    buildPokemon(35, "Clefairy", "Normal", 45, 48, 35, "Comum", 0.6),
    buildPokemon(36, "Clefable", "Normal", 70, 73, 60, "Comum", 0.6),
    buildPokemon(37, "Vulpix", "Fogo", 41, 40, 65, "Comum", 0.6),
    buildPokemon(38, "Ninetales", "Fogo", 76, 75, 100, "Comum", 0.6),
    buildPokemon(39, "Jigglypuff", "Normal", 45, 20, 20, "Comum", 0.6),
    buildPokemon(40, "Wigglytuff", "Normal", 70, 45, 45, "Comum", 0.6),
    buildPokemon(41, "Zubat", "Normal", 45, 35, 55, "Comum", 0.6),
    buildPokemon(42, "Golbat", "Normal", 80, 70, 90, "Comum", 0.6),
    buildPokemon(43, "Oddish", "Normal", 50, 55, 30, "Comum", 0.6),
    buildPokemon(44, "Gloom", "Normal", 65, 70, 40, "Comum", 0.6),
    buildPokemon(45, "Vileplume", "Normal", 80, 85, 50, "Comum", 0.6),
    buildPokemon(46, "Paras", "Normal", 70, 55, 25, "Comum", 0.6),
    buildPokemon(47, "Parasect", "Normal", 95, 80, 30, "Comum", 0.6),
    buildPokemon(48, "Venonat", "Normal", 55, 50, 45, "Comum", 0.6),
    buildPokemon(49, "Venomoth", "Normal", 65, 60, 90, "Comum", 0.6),
    buildPokemon(50, "Diglett", "Normal", 55, 25, 95, "Comum", 0.6),
    buildPokemon(51, "Dugtrio", "Normal", 80, 50, 120, "Comum", 0.6),
    buildPokemon(52, "Meowth", "Normal", 45, 35, 90, "Comum", 0.6),
    buildPokemon(53, "Persian", "Normal", 70, 60, 115, "Comum", 0.6),
    buildPokemon(54, "Psyduck", "Agua", 52, 48, 55, "Comum", 0.6),
    buildPokemon(55, "Golduck", "Agua", 82, 78, 85, "Comum", 0.6),
    buildPokemon(56, "Mankey", "Normal", 80, 35, 70, "Comum", 0.6),
    buildPokemon(57, "Primeape", "Normal", 105, 60, 95, "Comum", 0.6),
    buildPokemon(58, "Growlithe", "Fogo", 70, 45, 60, "Comum", 0.6),
    buildPokemon(59, "Arcanine", "Fogo", 110, 80, 95, "Comum", 0.6),
    buildPokemon(60, "Poliwag", "Agua", 50, 40, 90, "Comum", 0.6),
    buildPokemon(61, "Poliwhirl", "Agua", 65, 65, 90, "Comum", 0.6),
    buildPokemon(62, "Poliwrath", "Agua", 95, 95, 70, "Comum", 0.6),
    buildPokemon(63, "Abra", "Normal", 20, 15, 90, "Comum", 0.6),
    buildPokemon(64, "Kadabra", "Normal", 35, 30, 105, "Comum", 0.6),
    buildPokemon(65, "Alakazam", "Normal", 50, 45, 120, "Comum", 0.6),
    buildPokemon(66, "Machop", "Normal", 80, 50, 35, "Comum", 0.6),
    buildPokemon(67, "Machoke", "Normal", 100, 80, 45, "Comum", 0.6),
    buildPokemon(68, "Machamp", "Normal", 130, 80, 55, "Comum", 0.6),
    buildPokemon(69, "Bellsprout", "Normal", 75, 35, 40, "Comum", 0.6),
    buildPokemon(70, "Weepinbell", "Normal", 90, 50, 55, "Comum", 0.6),
    buildPokemon(71, "Victreebel", "Normal", 105, 65, 70, "Comum", 0.6),
    buildPokemon(72, "Tentacool", "Agua", 40, 35, 70, "Comum", 0.6),
    buildPokemon(73, "Tentacruel", "Agua", 70, 65, 100, "Comum", 0.6),
    buildPokemon(74, "Geodude", "Normal", 80, 100, 20, "Comum", 0.6),
    buildPokemon(75, "Graveler", "Normal", 95, 115, 35, "Comum", 0.6),
    buildPokemon(76, "Golem", "Normal", 120, 130, 45, "Comum", 0.6),
    buildPokemon(77, "Ponyta", "Fogo", 85, 55, 90, "Comum", 0.6),
    buildPokemon(78, "Rapidash", "Fogo", 100, 70, 105, "Comum", 0.6),
    buildPokemon(79, "Slowpoke", "Agua", 65, 65, 15, "Comum", 0.6),
    buildPokemon(80, "Slowbro", "Agua", 75, 110, 30, "Comum", 0.6),
    buildPokemon(81, "Magnemite", "Eletrico", 35, 70, 45, "Comum", 0.6),
    buildPokemon(82, "Magneton", "Eletrico", 60, 95, 70, "Comum", 0.6),
    buildPokemon(83, "Farfetch'd", "Normal", 65, 55, 60, "Comum", 0.6),
    buildPokemon(84, "Doduo", "Normal", 85, 45, 75, "Comum", 0.6),
    buildPokemon(85, "Dodrio", "Normal", 110, 70, 100, "Comum", 0.6),
    buildPokemon(86, "Seel", "Agua", 45, 55, 45, "Comum", 0.6),
    buildPokemon(87, "Dewgong", "Agua", 70, 80, 70, "Comum", 0.6),
    buildPokemon(88, "Grimer", "Normal", 80, 50, 25, "Comum", 0.6),
    buildPokemon(89, "Muk", "Normal", 105, 75, 50, "Comum", 0.6),
    buildPokemon(90, "Shellder", "Agua", 65, 100, 40, "Comum", 0.6),
    buildPokemon(91, "Cloyster", "Agua", 95, 180, 70, "Comum", 0.6),
    buildPokemon(92, "Gastly", "Normal", 35, 30, 80, "Comum", 0.6),
    buildPokemon(93, "Haunter", "Normal", 50, 45, 95, "Comum", 0.6),
    buildPokemon(94, "Gengar", "Normal", 65, 60, 110, "Comum", 0.6),
    buildPokemon(95, "Onix", "Normal", 45, 160, 70, "Comum", 0.6),
    buildPokemon(96, "Drowzee", "Normal", 48, 45, 42, "Comum", 0.6),
    buildPokemon(97, "Hypno", "Normal", 73, 70, 67, "Comum", 0.6),
    buildPokemon(98, "Krabby", "Agua", 105, 90, 50, "Comum", 0.6),
    buildPokemon(99, "Kingler", "Agua", 130, 115, 75, "Comum", 0.6),
    buildPokemon(100, "Voltorb", "Eletrico", 30, 50, 100, "Comum", 0.6),
    buildPokemon(101, "Electrode", "Eletrico", 50, 70, 140, "Comum", 0.6),
    buildPokemon(102, "Exeggcute", "Normal", 40, 80, 40, "Comum", 0.6),
    buildPokemon(103, "Exeggutor", "Normal", 95, 85, 55, "Comum", 0.6),
    buildPokemon(104, "Cubone", "Normal", 50, 95, 35, "Comum", 0.6),
    buildPokemon(105, "Marowak", "Normal", 80, 110, 45, "Comum", 0.6),
    buildPokemon(106, "Hitmonlee", "Normal", 120, 53, 87, "Comum", 0.6),
    buildPokemon(107, "Hitmonchan", "Normal", 105, 79, 76, "Comum", 0.6),
    buildPokemon(108, "Lickitung", "Normal", 55, 75, 30, "Comum", 0.6),
    buildPokemon(109, "Koffing", "Normal", 65, 95, 35, "Comum", 0.6),
    buildPokemon(110, "Weezing", "Normal", 90, 120, 60, "Comum", 0.6),
    buildPokemon(111, "Rhyhorn", "Normal", 85, 95, 25, "Comum", 0.6),
    buildPokemon(112, "Rhydon", "Normal", 130, 120, 40, "Comum", 0.6),
    buildPokemon(113, "Chansey", "Normal", 5, 5, 50, "Comum", 0.6),
    buildPokemon(114, "Tangela", "Normal", 55, 115, 60, "Comum", 0.6),
    buildPokemon(115, "Kangaskhan", "Normal", 95, 80, 90, "Comum", 0.6),
    buildPokemon(116, "Horsea", "Agua", 40, 70, 60, "Comum", 0.6),
    buildPokemon(117, "Seadra", "Agua", 65, 95, 85, "Comum", 0.6),
    buildPokemon(118, "Goldeen", "Agua", 67, 60, 63, "Comum", 0.6),
    buildPokemon(119, "Seaking", "Agua", 92, 65, 68, "Comum", 0.6),
    buildPokemon(120, "Staryu", "Agua", 45, 55, 85, "Comum", 0.6),

    // Incomuns 121..135
    buildPokemon(121, "Starmie", "Agua", 75, 85, 115, "Incomum", 0.25),
    buildPokemon(122, "Mr. Mime", "Normal", 45, 65, 90, "Incomum", 0.25),
    buildPokemon(123, "Scyther", "Normal", 110, 80, 105, "Incomum", 0.25),
    buildPokemon(124, "Jynx", "Normal", 50, 35, 95, "Incomum", 0.25),
    buildPokemon(125, "Electabuzz", "Eletrico", 83, 57, 105, "Incomum", 0.25),
    buildPokemon(126, "Magmar", "Fogo", 95, 57, 93, "Incomum", 0.25),
    buildPokemon(127, "Pinsir", "Normal", 125, 100, 85, "Incomum", 0.25),
    buildPokemon(128, "Tauros", "Normal", 100, 95, 110, "Incomum", 0.25),
    buildPokemon(129, "Magikarp", "Agua", 10, 55, 80, "Incomum", 0.25),
    buildPokemon(130, "Gyarados", "Agua", 125, 79, 81, "Incomum", 0.25),
    buildPokemon(131, "Lapras", "Agua", 85, 80, 60, "Incomum", 0.25),
    buildPokemon(132, "Ditto", "Normal", 48, 48, 48, "Incomum", 0.25),
    buildPokemon(133, "Eevee", "Normal", 55, 50, 55, "Incomum", 0.25),
    buildPokemon(134, "Vaporeon", "Agua", 65, 60, 65, "Incomum", 0.25),
    buildPokemon(135, "Jolteon", "Eletrico", 65, 60, 130, "Incomum", 0.25),

    // Raros 136..145
    buildPokemon(136, "Flareon", "Fogo", 130, 60, 65, "Raro", 0.10),
    buildPokemon(137, "Porygon", "Normal", 60, 70, 40, "Raro", 0.10),
    buildPokemon(138, "Omanyte", "Agua", 40, 100, 35, "Raro", 0.10),
    buildPokemon(139, "Omastar", "Agua", 60, 125, 55, "Raro", 0.10),
    buildPokemon(140, "Kabuto", "Agua", 80, 90, 55, "Raro", 0.10),
    buildPokemon(141, "Kabutops", "Agua", 115, 105, 80, "Raro", 0.10),
    buildPokemon(142, "Aerodactyl", "Normal", 105, 65, 130, "Raro", 0.10),
    buildPokemon(143, "Snorlax", "Normal", 110, 65, 30, "Raro", 0.10),
    buildPokemon(144, "Articuno", "Normal", 85, 100, 85, "Raro", 0.10),
    buildPokemon(145, "Zapdos", "Eletrico", 90, 85, 100, "Raro", 0.10),

    // Épicos 146..149
    buildPokemon(146, "Moltres", "Fogo", 100, 90, 90, "Epico", 0.04),
    buildPokemon(147, "Dratini", "Normal", 64, 45, 50, "Epico", 0.04),
    buildPokemon(148, "Dragonair", "Normal", 84, 65, 70, "Epico", 0.04),
    buildPokemon(149, "Dragonite", "Normal", 134, 95, 80, "Epico", 0.04),

    // Lendário 150
    buildPokemon(150, "Mewtwo", "Normal", 154, 90, 130, "Lendario", 0.01),
];

