/**
 * MAIN.TS - Ponto de entrada da aplicação Pokédex
 * Sistema interativo para explorar, capturar, treinar e batalhar Pokémons
 */

import promptSync from "prompt-sync";
import { Pokedex } from "./Principal/Pokedex";
import { PokemonFogo, PokemonAgua, PokemonEletrico } from "./Classes/Subclasses";
import { Pokemon } from "./Classes/Pokemon";

// Inicializa o leitor de entrada do terminal
const prompt = promptSync();
// Inicializa a Pokédex (controlador principal do jogo)
const pokedex = new Pokedex();

/**
 * Lê um número inteiro do usuário com validação
 * @param msg - Mensagem a exibir
 * @returns Número lido ou 0 se inválido
 */
function lerNumero(msg: string): number {
  try {
    const input = prompt(msg);
    // Valida entrada vazia
    if (input === null || input.trim() === "") {
      console.log("\n  ⚠️  Entrada vazia! Retornando 0.");
      return 0;
    }
    // Converte para número e valida
    const numero = Number(input);
    if (isNaN(numero)) {
      console.log("\n  ⚠️  Entrada inválida! Digite um número.");
      return 0;
    }
    return numero;
  } catch (erro) {
    console.log(`\n  ❌ Erro ao ler número: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
    return 0;
  }
}

/**
 * Exibe lista de Pokémons e solicita seleção de um
 * @param msg - Mensagem a exibir
 * @returns Índice do Pokémon selecionado (-1 se cancelado)
 */
function selecionarPokemon(msg: string): number {
  try {
    // Lista todos os Pokémons da Pokédex
    console.log(pokedex.listarNomes());
    // Retorna índice (subtraindo 1 da escolha do usuário para 0-based)
    return lerNumero(msg) - 1;
  } catch (erro) {
    console.log(`\n  ❌ Erro ao selecionar Pokémon: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
    return -1;
  }
}

/**
 * Pausa a execução e aguarda o usuário pressionar ENTER
 */
function pausar(): void {
  try {
    prompt("\n  [ Pressione ENTER para continuar... ]");
  } catch (erro) {
    console.log(`\n  ❌ Erro ao pausar: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
  }
}

/**
 * Loop interativo: Explora a natureza e tenta capturar Pokémons
 * Usuário pode escolher continuar procurando ou capturar o encontrado
 */
function explorarECapturar(): void {
  try {
    while (true) {
      // Realiza exploração
      const encontro = pokedex.explorar();

      // Verifica se houve erro (e.g., cooldown ativo)
      if ("erro" in encontro) {
        console.log(`\n  ${encontro.erro}`);
        return;
      }

      // Exibe Pokémon encontrado em card visual
      console.log(pokedex.listarEncontro());

      // Menu de opções
      const opcaoCaptura = prompt("\n  1 - Capturar\n  2 - Próximo\n  Opção: ");
      console.clear();

      // Opção 2: Procura o próximo Pokémon
      if (opcaoCaptura === "2") {
        continue;
      }

      // Valida entrada
      if (opcaoCaptura !== "1") {
        console.log("\n   Opção inválida. Tente novamente.");
        continue;
      }

      // Tenta capturar
      const captura = pokedex.capturar();
      if ("erro" in captura) {
        console.log(`\n\n  ${captura.erro}`);
        return;
      }

      // Exibe resultado da captura
      console.log("\n\n");
      console.log(
        `  ${captura.capturado ? "✓ Capturado!" : "✗ Não capturado"}`
      );
      return;
    }
  } catch (erro) {
    console.log(`\n  ❌ Erro na exploração: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
  }
}

/**
 * Permite usar a habilidade especial de um Pokémon
 * Brasas (Fogo), Jato de Água (Água), Raio (Elétrico)
 */
function usarHabilidadeEspecial(): void {
  try {
    // Valida se há Pokémons na coleção
    if (pokedex.getTamanho() === 0) {
      console.log("\n  Pokédex vazia!");
      return;
    }

    // Solicita seleção do Pokémon
    const idx = selecionarPokemon("  Escolha o Pokémon: ");
    if (idx < 0) {
      console.log("\n  Seleção cancelada.");
      return;
    }

    // Obtém instância do Pokémon
    const pokemon = pokedex.buscarPorIndice(idx);

    if (!pokemon) {
      console.log("\n  Escolha inválida.");
      return;
    }

    // Usa habilidade específica do tipo de Pokémon
    if (pokemon instanceof PokemonFogo) {
      console.log("\n  " + pokemon.usarBrasas());
    } else if (pokemon instanceof PokemonAgua) {
      console.log("\n  " + pokemon.usarJatoDeAgua());
    } else if (pokemon instanceof PokemonEletrico) {
      console.log("\n  " + pokemon.usarRaio());
    } else {
      console.log("\n  Este Pokémon não possui habilidade especial.");
    }
  } catch (erro) {
    console.log(`\n  ❌ Erro ao usar habilidade: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
  }
}

/**
 * Treina todos os Pokémons da coleção em uma única ação
 * Exibe resumo de sucessos e falhas
 */
function treinarEmMassa(): void {
  // Valida se há Pokémons
  if (pokedex.getTamanho() === 0) {
    console.log("\n  Pokédex vazia! Capture Pokémons primeiro.");
    return;
  }

  // Obtém lista de todos os Pokémons
  const pokemons: Pokemon[] = pokedex.getPokemons();
  let sucessos = 0;
  let falhas = 0;

  console.log("\n  🏋️  Iniciando TREINO EM MASSA de toda a equipe...\n");

  // Treina cada Pokémon
  for (const pokemon of pokemons) {
    const resultado = pokemon.treinar();
    
    // Registra sucesso ou falha
    if (resultado === "ok") {
      console.log(`  ✅ ${pokemon.getNome()} [${pokemon.getTipo()}] treinou com sucesso!`);
      sucessos++;
    } else {
      console.log(`  ❌ ${pokemon.getNome()} [${pokemon.getTipo()}]: ${resultado}`);
      falhas++;
    }
  }

  // Exibe resumo final
  console.log(`\n  📊 Resumo: ${sucessos} treinado(s) com sucesso, ${falhas} falha(s).\n`);
}


// ========== LOOP PRINCIPAL DO MENU ==========
let opcao = "";

while (opcao !== "9") {
  try {
    // Exibe menu principal
    console.log("\n╔══════════════════════════════════════╗");
    console.log("║         🎮  POKÉDEX SYSTEM           ║");
    console.log("╠══════════════════════════════════════╣");
    console.log("║  1 - Procurar Pokémon (explorar)     ║");
    console.log("║  2 - Ver todos os Pokémons           ║");
    console.log("║  3 - Treinar Pokémon                 ║");
    console.log("║  4 - Descansar Pokémon               ║");
    console.log("║  5 - Batalhar                        ║");
    console.log("║  6 - Usar habilidade especial        ║");
    console.log("║  7 - Ver status detalhado            ║");
    console.log("║  8 - Treinar TODOS em massa          ║");
    console.log("║  9 - Sair                            ║");
    console.log("╚══════════════════════════════════════╝");

    // Lê opção do usuário
    opcao = prompt("\n  Opção: ");
    console.clear();

    // Processa cada opção do menu
    switch (opcao) {
      case "1":
        // Exploração e captura
        try {
          explorarECapturar();
          pausar();
        } catch (erro) {
          console.log(`\n  ❌ Erro na exploração: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
        }
        break;

      case "2":
        // Lista todos os Pokémons com status completo
        try {
          console.log(pokedex.listarTodos());
          pausar();
        } catch (erro) {
          console.log(`\n  ❌ Erro ao listar: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
        }
        break;

      case "3":
        // Treina um Pokémon individual
        try {
          if (pokedex.getTamanho() === 0) {
            console.log("\n  Pokédex vazia!");
            break;
          }
          const idxTreino = selecionarPokemon("  Escolha o Pokémon para treinar: ");
          if (idxTreino >= 0) {
            console.log("\n  " + pokedex.treinarPokemon(idxTreino));
          }
          pausar();
        } catch (erro) {
          console.log(`\n  ❌ Erro ao treinar: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
        }
        break;

      case "4":
        // Descansa um Pokémon para recuperar energia
        try {
          if (pokedex.getTamanho() === 0) {
            console.log("\n  Pokédex vazia!");
            break;
          }
          const idxDescanso = selecionarPokemon("  Escolha o Pokémon para descansar: ");
          if (idxDescanso >= 0) {
            console.log("\n  " + pokedex.descansarPokemon(idxDescanso));
          }
          pausar();
        } catch (erro) {
          console.log(`\n  ❌ Erro ao descansar: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
        }
        break;

      case "5":
        // Realiza uma batalha entre dois Pokémons
        try {
          if (pokedex.getTamanho() < 2) {
            console.log("\n  Você precisa de pelo menos 2 Pokémons para batalhar!");
            break;
          }
          console.log("\n  === ESCOLHA O 1º POKÉMON ===");
          const idx1 = selecionarPokemon("  Pokémon 1: ");
          if (idx1 < 0) break;
          console.log("\n  === ESCOLHA O 2º POKÉMON ===");
          const idx2 = selecionarPokemon("  Pokémon 2: ");
          if (idx2 < 0) break;
          console.log(pokedex.batalhar(idx1, idx2));
          pausar();
        } catch (erro) {
          console.log(`\n  ❌ Erro na batalha: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
        }
        break;

      case "6":
        // Usa habilidade especial (Brasas, Jato de Água, Raio)
        try {
          usarHabilidadeEspecial();
          pausar();
        } catch (erro) {
          console.log(`\n  ❌ Erro ao usar habilidade: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
        }
        break;

      case "7":
        // Exibe status detalhado de um Pokémon
        try {
          if (pokedex.getTamanho() === 0) {
            console.log("\n  Pokédex vazia!");
            break;
          }
          const idxStatus = selecionarPokemon("  Escolha o Pokémon: ");
          if (idxStatus >= 0) {
            const pkStatus: Pokemon | null = pokedex.buscarPorIndice(idxStatus);
            if (pkStatus) {
              console.log("\n   STATUS DETALHADO:");
              console.log("  " + pkStatus.getStatus());
            } else {
              console.log("\n  Escolha inválida.");
            }
          }
          pausar();
        } catch (erro) {
          console.log(`\n  ❌ Erro ao exibir status: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
        }
        break;

      case "8":
        // Treina todos os Pokémons de uma vez
        try {
          treinarEmMassa();
          pausar();
        } catch (erro) {
          console.log(`\n  ❌ Erro no treino em massa: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
        }
        break;

      case "9":
        // Sai do programa
        console.log("\n  Saindo do sistema Pokédex. Até mais!\n");
        break;

      default:
        // Opção inválida
        console.log("\n    Opção inválida! Tente novamente.");
    }
  } catch (erro) {
    // Trata erros não previstos no menu
    console.log(`\n  ❌ Erro no menu principal: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
    console.log("  Voltando ao menu...\n");
  }
}
