import { BANCO_POKEMONS, type DadosPokemon, type PokemonRaridade } from "../Data/BancoPokemon";
import type { RNG } from "../RNG";

/**
 * Distribuição customizada de raridade para a exploração
 * Permite sobrescrever os pesos padrão de aparição
 */
export type DistribuicaoRaridade = Partial<Record<PokemonRaridade, number>>;

/**
 * Resultado de uma exploração: um Pokémon foi encontrado
 */
export type ResultadoEncontro = { pokemon: DadosPokemon };

/**
 * Explora a natureza e encontra um Pokémon aleatório
 * @param rng - Gerador de números aleatórios
 * @param distribuicao - Distribuição customizada de pesos (opcional)
 * @returns Um Pokémon encontrado durante a exploração
 */
export function explorar(rng: RNG, distribuicao?: DistribuicaoRaridade): ResultadoEncontro {
  // Cria um pool com todos os Pokémons e seus pesos
  const pool = BANCO_POKEMONS.map((p) => ({
    pokemon: p,
    // Usa distribuição customizada se fornecida, senão usa o peso padrão
    weight: distribuicao?.[p.raridade] ?? p.chanceAparicao,
  }));

  // Calcula o peso total
  const total = pool.reduce((s, it) => s + it.weight, 0);
  // Se o total for inválido, retorna o primeiro Pokémon
  if (total <= 0) return { pokemon: BANCO_POKEMONS[0] };

  // Realiza seleção ponderada: roda um número aleatório e procura qual Pokémon caiu
  let r = rng.random() * total;
  for (const it of pool) {
    if (r < it.weight) return { pokemon: it.pokemon };
    r -= it.weight;
  }

  // Fallback (nunca deverá chegar aqui)
  return { pokemon: BANCO_POKEMONS[0] };
}
