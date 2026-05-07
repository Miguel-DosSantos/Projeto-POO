import { Pokemon, ResultadoLuta } from "../Classes/Pokemon";

export class Pokedex {

    private _pokemons: Pokemon[];

    constructor() {
        this._pokemons = [];
    }

    getPokemons(): Pokemon[] {
        return this._pokemons;
    }

    getTamanho(): number {
        return this._pokemons.length;
    }

    adicionarPokemon(pokemon: Pokemon): void {
        this._pokemons.push(pokemon);
    }


    buscarPorIndice(indice: number): Pokemon | null {
        if (indice < 0 || indice >= this._pokemons.length) {
            return null;
        }
        return this._pokemons[indice]!;
    }

    listarTodos(): string {
        if (this._pokemons.length === 0) {
            return "Nenhum Pokémon cadastrado na Pokédex ainda!";
        }
        let lista = "\n📋 POKÉMONS NA POKÉDEX:\n";
        this._pokemons.forEach((p, i) => {
            lista += `  ${i + 1}. ${p.getStatus()}\n`;
        });
        return lista;
    }

    listarNomes(): string {
        if (this._pokemons.length === 0) {
            return "Pokédex vazia!";
        }
        let lista = "";
        this._pokemons.forEach((p, i) => {
            lista += `  ${i + 1}. ${p.getNome()} [${p.getTipo()}] — HP: ${p.getAtributos().getEnergia()}\n`;
        });
        return lista;
    }

    treinarPokemon(indice: number): string {
        const pokemon = this.buscarPorIndice(indice);
        if (!pokemon) {
            return "Escolha inválida!";
        }
        const resultado = pokemon.treinar();
        if (resultado === "ok") {
            return `✅ ${pokemon.getNome()} treinou com sucesso!\n   ${pokemon.getStatus()}`;
        }
        return `❌ ${pokemon.getNome()}: ${resultado}`;
    }

    descansarPokemon(indice: number): string {
        const pokemon = this.buscarPorIndice(indice);
        if (!pokemon) {
            return "Escolha inválida!";
        }
        const ganho = pokemon.descansar();
        return `😴 ${pokemon.getNome()} descansou e recuperou ${ganho} de energia!\n   ${pokemon.getStatus()}`;
    }

    batalhar(indice1: number, indice2: number): string {
        if (this._pokemons.length < 2) {
            return "Você precisa de pelo menos 2 Pokémons para batalhar!";
        }
        if (indice1 === indice2) {
            return "Selecione dois Pokémons diferentes!";
        }
        const pokemon1 = this.buscarPorIndice(indice1);
        const pokemon2 = this.buscarPorIndice(indice2);
        if (!pokemon1 || !pokemon2) {
            return "Escolha inválida!";
        }

        const resultado: ResultadoLuta = pokemon1.lutar(pokemon2);
        let relatorio = `\n${resultado.mensagem}\n`;
        relatorio += `   ${pokemon1.getNome()}: HP restante ${pokemon1.getAtributos().getEnergia()}\n`;
        relatorio += `   ${pokemon2.getNome()}: HP restante ${pokemon2.getAtributos().getEnergia()}`;
        return relatorio;
    }
}
