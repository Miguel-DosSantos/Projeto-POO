import promptSync from "prompt-sync";
import { Pokedex } from "./Principal/Pokedex";
import { PokemonFogo, PokemonAgua, PokemonEletrico } from "./Classes/Subclasses";
import { Pokemon } from "./Classes/Pokemon";

const prompt = promptSync();
const pokedex = new Pokedex();

function lerNumero(msg: string): number {
  return Number(prompt(msg));
}

function selecionarPokemon(msg: string): number {
  console.log(pokedex.listarNomes());
  return lerNumero(msg) - 1;
}

function pausar(): void {
  prompt("\n  [ Pressione ENTER para continuar... ]");
}

function explorarECapturar(): void {
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
}

function usarHabilidadeEspecial(): void {
  if (pokedex.getTamanho() === 0) {
    console.log("\n  Pokédex vazia!");
    return;
  }

  const idx = selecionarPokemon("  Escolha o Pokémon: ");
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
}

let opcao = "";

while (opcao !== "8") {
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
  console.log("║  8 - Sair                            ║");
  console.log("╚══════════════════════════════════════╝");

  opcao = prompt("\n  Opção: ");
  console.clear();

  switch (opcao) {
    case "1":
      explorarECapturar();
      pausar();
      break;

    case "2":
      console.log(pokedex.listarTodos());
      pausar();
      break;

    case "3":
      if (pokedex.getTamanho() === 0) {
        console.log("\n  Pokédex vazia!");
        break;
      }
      const idxTreino = selecionarPokemon("  Escolha o Pokémon para treinar: ");
      console.log("\n  " + pokedex.treinarPokemon(idxTreino));
      pausar();
      break;

    case "4":
      if (pokedex.getTamanho() === 0) {
        console.log("\n  Pokédex vazia!");
        break;
      }
      const idxDescanso = selecionarPokemon("  Escolha o Pokémon para descansar: ");
      console.log("\n  " + pokedex.descansarPokemon(idxDescanso));
      pausar();
      break;

    case "5":
      if (pokedex.getTamanho() < 2) {
        console.log("\n  Você precisa de pelo menos 2 Pokémons para batalhar!");
        break;
      }
      console.log("\n  === ESCOLHA O 1º POKÉMON ===");
      const idx1 = selecionarPokemon("  Pokémon 1: ");
      console.log("\n  === ESCOLHA O 2º POKÉMON ===");
      const idx2 = selecionarPokemon("  Pokémon 2: ");
      console.log(pokedex.batalhar(idx1, idx2));
      pausar();
      break;

    case "6":
      usarHabilidadeEspecial();
      pausar();
      break;

    case "7":
      if (pokedex.getTamanho() === 0) {
        console.log("\n  Pokédex vazia!");
        break;
      }
      const idxStatus = selecionarPokemon("  Escolha o Pokémon: ");
      const pkStatus: Pokemon | null = pokedex.buscarPorIndice(idxStatus);
      if (pkStatus) {
        console.log("\n   STATUS DETALHADO:");
        console.log("  " + pkStatus.getStatus());
      } else {
        console.log("\n  Escolha inválida.");
      }
      pausar();
      break;

    case "8":
      console.log("\n  Saindo do sistema Pokédex. Até mais!\n");
      break;

    default:
      console.log("\n    Opção inválida! Tente novamente.");
  }
}
