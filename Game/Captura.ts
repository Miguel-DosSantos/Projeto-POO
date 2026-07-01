import type { DadosPokemon } from "../Data/BancoPokemon";
import type { RNG } from "../RNG";

/**
 * Resultado de uma tentativa de captura
 * capturado: Se o Pok\u00e9mon foi capturado com sucesso
 * chanceUsada: Chance real usada no c\u00e1lculo
 * mensagem: Mensagem de falha (undefined se capturou)
 */
export type ResultadoCaptura = {
  capturado: boolean;
  chanceUsada: number;
  mensagem?: string;
};

/**
 * Tenta capturar um Pok\u00e9mon encontrado na explora\u00e7\u00e3o
 * @param pokemon - Dados do Pok\u00e9mon a capturar\n * @param rng - Gerador de n\u00fameros aleat\u00f3rios\n * @param modificador - B\u00f4nus/pen\u00e1lidade na chance de captura (adicionado \u00e0 taxa base)\n * @returns Resultado da tentativa com sucesso, chance usada e mensagem de falha\n */\nexport function tentarCapturar(pokemon: DadosPokemon, rng: RNG, modificador = 0): ResultadoCaptura {\n  // Taxa de captura base do Pok\u00e9mon\n  const base = pokemon.taxaCaptura ?? 0;\n  // Aplica o modificador e limita entre 0 e 1\n  const chance = Math.max(0, Math.min(1, base + (modificador ?? 0)));\n  // Gera um n\u00famero aleat\u00f3rio entre 0 e 1\n  const roll = rng.random();\n  // Captura se o roll for menor ou igual \u00e0 chance\n  const capturado = roll <= chance;\n  // Retorna mensagem apenas se falhou\n  const mensagem = capturado ? undefined : `Chance: ${(chance * 100).toFixed(0)}% (roll ${(roll * 100).toFixed(0)}%)`;\n  return { capturado, chanceUsada: chance, mensagem };\n}
