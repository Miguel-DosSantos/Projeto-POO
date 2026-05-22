import promptSync from "prompt-sync";
import { Pokedex } from "./Principal/Pokedex";
import { PokemonFogo, PokemonAgua, PokemonEletrico } from "./Classes/Subclasses";
import { Pokemon } from "./Classes/Pokemon";

const prompt = promptSync();
const pokedex = new Pokedex();

// ✨ [QUEST 3] Try/catch para tratar entradas inválidas
function lerNumero(msg: string): number {
  try {
    const input = prompt(msg);
    if (input === null || input.trim() === "") {
      console.log("\n  ⚠️  Entrada vazia! Retornando 0.");
      return 0;
    }
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

function selecionarPokemon(msg: string): number {
  try {
    console.log(pokedex.listarNomes());
    return lerNumero(msg) - 1;
  } catch (erro) {
    console.log(`\n  ❌ Erro ao selecionar Pokémon: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
    return -1;
  }
}

function pausar(): void {
  try {
    prompt("\n  [ Pressione ENTER para continuar... ]");
  } catch (erro) {
    console.log(`\n  ❌ Erro ao pausar: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
  }
}

function explorarECapturar(): void {
  try {
    while (true) {
      const encontro = pokedex.explorar();

      if ("erro" in encontro) {
        console.log(`\n  ${encontro.erro}`);
        return;
      }

      console.log(pokedex.listarEncontro());

      const opcaoCaptura = prompt("\n  1 - Capturar\n  2 - Próximo\n  Opção: ");
      console.clear();

      if (opcaoCaptura === "2") {
        continue;
      }

      if (opcaoCaptura !== "1") {
        console.log("\n   Opção inválida. Tente novamente.");
        continue;
      }

      const captura = pokedex.capturar();
      if ("erro" in captura) {
        console.log(`\n\n  ${captura.erro}`);
        return;
      }

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

function usarHabilidadeEspecial(): void {
  try {
    if (pokedex.getTamanho() === 0) {
      console.log("\n  Pokédex vazia!");
      return;
    }

    const idx = selecionarPokemon("  Escolha o Pokémon: ");
    if (idx < 0) {
      console.log("\n  Seleção cancelada.");
      return;
    }

    const pokemon = pokedex.buscarPorIndice(idx);

    if (!pokemon) {
      console.log("\n  Escolha inválida.");
      return;
    }

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

// ✨ [QUEST 2] Loop polimórfico em massa - treina todos os Pokémons usando polimorfismo
function treinarEmMassa(): void {
  if (pokedex.getTamanho() === 0) {
    console.log("\n  Pokédex vazia! Capture Pokémons primeiro.");
    return;
  }

  const pokemons: Pokemon[] = pokedex.getPokemons();
  let sucessos = 0;
  let falhas = 0;

  console.log("\n  🏋️  Iniciando TREINO EM MASSA de toda a equipe...\n");

  // Loop que percorre Array da Superclasse e executa ação em massa via polimorfismo
  for (const pokemon of pokemons) {
    const resultado = pokemon.treinar();
    
    if (resultado === "ok") {
      console.log(`  ✅ ${pokemon.getNome()} [${pokemon.getTipo()}] treinou com sucesso!`);
      sucessos++;
    } else {
      console.log(`  ❌ ${pokemon.getNome()} [${pokemon.getTipo()}]: ${resultado}`);
      falhas++;
    }
  }

  console.log(`\n  📊 Resumo: ${sucessos} treinado(s) com sucesso, ${falhas} falha(s).\n`);
}


let opcao = "";

// ✨ [QUEST 3] Loop principal com try/catch para garantir resiliência
while (opcao !== "9") {
  try {
    console.log("\n╔══════════════════════════════════════╗");
    console.log("║         🎮  POKÉDEX SYSTEM           ║");
    console.log("╠══════════════════════════════════════╣");
    console.log("║  1 - Procurar Pokémon (explorar)   ║");
    console.log("║  2 - Ver todos os Pokémons           ║");
    console.log("║  3 - Treinar Pokémon                 ║");
    console.log("║  4 - Descansar Pokémon               ║");
    console.log("║  5 - Batalhar                        ║");
    console.log("║  6 - Usar habilidade especial        ║");
    console.log("║  7 - Ver status detalhado            ║");
    console.log("║  8 - Treinar TODOS em massa          ║");
    console.log("║  9 - Sair                            ║");
    console.log("╚══════════════════════════════════════╝");

    opcao = prompt("\n  Opção: ");
    console.clear();

    switch (opcao) {
      case "1":
        try {
          explorarECapturar();
          pausar();
        } catch (erro) {
          console.log(`\n  ❌ Erro na exploração: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
        }
        break;

      case "2":
        try {
          console.log(pokedex.listarTodos());
          pausar();
        } catch (erro) {
          console.log(`\n  ❌ Erro ao listar: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
        }
        break;

      case "3":
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
        try {
          usarHabilidadeEspecial();
          pausar();
        } catch (erro) {
          console.log(`\n  ❌ Erro ao usar habilidade: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
        }
        break;

      case "7":
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
        try {
          treinarEmMassa();
          pausar();
        } catch (erro) {
          console.log(`\n  ❌ Erro no treino em massa: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
        }
        break;

      case "9":
        console.log("\n  Saindo do sistema Pokédex. Até mais!\n");
        break;

      default:
        console.log("\n    Opção inválida! Tente novamente.");
    }
  } catch (erro) {
    console.log(`\n  ❌ Erro no menu principal: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`);
    console.log("  Voltando ao menu...\n");
  }
}
