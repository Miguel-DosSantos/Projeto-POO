import type { DadosPokemon } from "../Data/BancoPokemon";
import type { RNG } from "../RNG";

export type ResultadoCaptura = {
  capturado: boolean;
  chanceUsada: number;
  mensagem?: string;
};

export function tentarCapturar(pokemon: DadosPokemon, rng: RNG, modificador = 0): ResultadoCaptura {
  const base = pokemon.taxaCaptura ?? 0;
  const chance = Math.max(0, Math.min(1, base + (modificador ?? 0)));
  const roll = rng.random();
  const capturado = roll <= chance;
  const mensagem = capturado ? undefined : `Chance: ${(chance * 100).toFixed(0)}% (roll ${(roll * 100).toFixed(0)}%)`;
  return { capturado, chanceUsada: chance, mensagem };
}
