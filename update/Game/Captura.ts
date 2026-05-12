import { DadosPokemon } from "../Data/BancoPokemon";
import type { RNG } from "./Exploracao";

export type ResultadoCaptura = {
    capturado: boolean;
    mensagem: string;
};

export function calcularChanceCaptura(
    pokemon: DadosPokemon,
    rngFactor: number = 1,
    modificador?: number
): number {
    // A chance base é a taxaCaptura do banco.
    // rngFactor e modificador são extensões para gameplay (ex.: itens/nível).
    const base = pokemon.taxaCaptura;
    const mod = modificador ?? 1;

    const chance = base * mod * rngFactor;
    return Math.max(0, Math.min(0.99, chance));
}

export function tentarCapturar(
    pokemon: DadosPokemon,
    rng: RNG,
    modificador?: number
): ResultadoCaptura {
    const fatorVariacao = 0.9 + rng.random() * 0.2; // variação leve
    const chance = calcularChanceCaptura(pokemon, fatorVariacao, modificador);
    const sucesso = rng.random() < chance;

    if (sucesso) {
        return {
            capturado: true,
            mensagem: `✨ Pokémon capturado! (${pokemon.nome} — ${pokemon.raridade})`,
        };
    }

    return {
        capturado: false,
        mensagem: `💨 O Pokémon escapou! (${pokemon.nome} — ${pokemon.raridade})`,
    };
}

