import { BANCO_POKEMONS, type DadosPokemon, type PokemonRaridade } from "../Data/BancoPokemon";
import type { RNG } from "../RNG";

export type DistribuicaoRaridade = Partial<Record<PokemonRaridade, number>>;
export type ResultadoEncontro = { pokemon: DadosPokemon };

export function explorar(rng: RNG, distribuicao?: DistribuicaoRaridade): ResultadoEncontro {
  const pool = BANCO_POKEMONS.map((p) => ({
    pokemon: p,
    weight: distribuicao?.[p.raridade] ?? p.chanceAparicao,
  }));

  const total = pool.reduce((s, it) => s + it.weight, 0);
  if (total <= 0) return { pokemon: BANCO_POKEMONS[0] };

  let r = rng.random() * total;
  for (const it of pool) {
    if (r < it.weight) return { pokemon: it.pokemon };
    r -= it.weight;
  }

  return { pokemon: BANCO_POKEMONS[0] };
}
