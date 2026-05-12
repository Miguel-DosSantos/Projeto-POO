import { BANCO_POKEMONS, DadosPokemon, PokemonRaridade } from "../Data/BancoPokemon";

export type ResultadoEncontro = {
    pokemon: DadosPokemon;
    raridade: PokemonRaridade;
};

export type DistribuicaoRaridade = {
    Comum: number;
    Incomum: number;
    Raro: number;
    Epico: number;
    Lendario: number;
};

export const DISTRIBUICAO_PADRAO: DistribuicaoRaridade = {
    Comum: 0.60,
    Incomum: 0.25,
    Raro: 0.10,
    Epico: 0.04,
    Lendario: 0.01,
};

export interface RNG {
    random(): number;
}

export const defaultRng: RNG = {
    random: () => Math.random(),
};

function sortearPorPeso<T>(itens: Array<{ valor: T; peso: number }>, rng: RNG): T {
    const soma = itens.reduce((acc, i) => acc + i.peso, 0);
    if (soma <= 0) {
        // fallback determinístico
        return itens[0]!.valor;
    }

    const r = rng.random() * soma;
    let acumulado = 0;
    for (const item of itens) {
        acumulado += item.peso;
        if (r <= acumulado) return item.valor;
    }

    return itens[itens.length - 1]!.valor;
}

export function sortearRaridade(
    distribuicao: DistribuicaoRaridade,
    rng: RNG = defaultRng
): PokemonRaridade {
    return sortearPorPeso<PokemonRaridade>([
        { valor: "Comum", peso: distribuicao.Comum },
        { valor: "Incomum", peso: distribuicao.Incomum },
        { valor: "Raro", peso: distribuicao.Raro },
        { valor: "Epico", peso: distribuicao.Epico },
        { valor: "Lendario", peso: distribuicao.Lendario },
    ], rng);
}

export function sortearPokemonPorRaridade(
    raridade: PokemonRaridade,
    rng: RNG = defaultRng
): DadosPokemon {
    const candidatos = BANCO_POKEMONS.filter((p) => p.raridade === raridade);
    if (candidatos.length === 0) {
        // fallback: se não tiver nenhum candidato, pega qualquer um
        return BANCO_POKEMONS[Math.floor(rng.random() * BANCO_POKEMONS.length)]!;
    }

    return sortearPorPeso(
        candidatos.map((p) => ({ valor: p, peso: p.chanceAparicao })),
        rng
    );
}

export function explorar(
    rng: RNG = defaultRng,
    distribuicao: DistribuicaoRaridade = DISTRIBUICAO_PADRAO
): ResultadoEncontro {
    const raridade = sortearRaridade(distribuicao, rng);
    const pokemon = sortearPokemonPorRaridade(raridade, rng);
    return { pokemon, raridade };
}

