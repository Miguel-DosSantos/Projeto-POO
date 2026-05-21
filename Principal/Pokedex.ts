import { Atributos } from "../Classes/Atributos";
import { Pokemon, ResultadoLuta } from "../Classes/Pokemon";
import { PokemonFogo, PokemonAgua, PokemonEletrico } from "../Classes/Subclasses";
import { BANCO_POKEMONS, DadosPokemon } from "../Data/BancoPokemon";
import { explorar, type DistribuicaoRaridade, type ResultadoEncontro } from "../Game/Exploracao";
import { defaultRng, type RNG } from "../Game/RNG";
import { tentarCapturar, type ResultadoCaptura } from "../Game/Captura";

type EstadoEncontro = {
    pokemon: DadosPokemon;
    capturado?: boolean;
};

type PokemonColecionado = {
    pokemonInstancia: Pokemon;
    quantidade: number;
};

export class Pokedex {
    private _colecao: Map<string, PokemonColecionado> = new Map();
    private _ordemNomes: string[] = [];

    private _encontroAtual: EstadoEncontro | null = null;

  
    private _cooldownExplorarMs = 0;
    private _ultimaExploracaoTs = 0;

    private _cooldownCapturarMs = 5_000;
    private _ultimaCapturaTs = 0;


    constructor() {}

  
    getTamanho(): number {
        return this._ordemNomes.length;
    }

    getPokemons(): Pokemon[] {
        return this._ordemNomes.map((nome) => this._colecao.get(nome)!.pokemonInstancia);
    }


    buscarNoBanco(termoBusca: string): DadosPokemon[] {
        const termo = termoBusca.toLowerCase().trim();
        if (!termo) return [];

        const porId = Number(termoBusca);
        if (!isNaN(porId)) {
            const encontrado = BANCO_POKEMONS.find((p) => p.id === porId);
            return encontrado ? [encontrado] : [];
        }

        return BANCO_POKEMONS.filter((p) => p.nome.toLowerCase().includes(termo));
    }

    adicionarDoBanco(id: number): string {
        const dados = BANCO_POKEMONS.find((p) => p.id === id);
        if (!dados) return `Pokémon com ID ${id} não encontrado no banco.`;

        if (this._colecao.has(dados.nome)) {
            return `${dados.nome} já está na sua Pokédex!`;
        }

        const instancia = this.criarInstanciaAPartirDoBanco(dados);
        this._colecao.set(dados.nome, { pokemonInstancia: instancia, quantidade: 1 });
        this._ordemNomes.push(dados.nome);

        return ` #${String(dados.id).padStart(3, "0")} ${dados.nome} [${dados.tipo}] adicionado!`;
    }


    adicionarPokemon(pokemon: Pokemon): void {
        const nome = pokemon.getNome();
        if (this._colecao.has(nome)) {
            const atual = this._colecao.get(nome)!;
            this._colecao.set(nome, { ...atual, quantidade: atual.quantidade + 1 });
            return;
        }
        this._colecao.set(nome, { pokemonInstancia: pokemon, quantidade: 1 });
        this._ordemNomes.push(nome);
    }

    buscarPorIndice(indice: number): Pokemon | null {
        if (indice < 0 || indice >= this._ordemNomes.length) return null;
        const nome = this._ordemNomes[indice]!;
        return this._colecao.get(nome)!.pokemonInstancia;
    }


    getEncontroAtual(): DadosPokemon | null {
        return this._encontroAtual?.pokemon ?? null;
    }

    getTempoRestanteCooldownExplorarMs(): number {
        const agora = Date.now();
        const fim = this._ultimaExploracaoTs + this._cooldownExplorarMs;
        return Math.max(0, fim - agora);
    }

    setCooldownExplorarMs(ms: number): void {
        this._cooldownExplorarMs = Math.max(0, ms);
    }

    getTempoRestanteCooldownCapturarMs(): number {
        const agora = Date.now();
        const fim = this._ultimaCapturaTs + this._cooldownCapturarMs;
        return Math.max(0, fim - agora);
    }

    setCooldownCapturarMs(ms: number): void {
        this._cooldownCapturarMs = Math.max(0, ms);
    }


    explorar(rng: RNG = defaultRng, distribuicao?: DistribuicaoRaridade): ResultadoEncontro | { erro: string } {

        const restante = this.getTempoRestanteCooldownExplorarMs();
        if (restante > 0) {
            return { erro: `Cooldown ativo: aguarde ${Math.ceil(restante / 1000)}s.` };
        }

        this._ultimaExploracaoTs = Date.now();
        const encontro = explorar(rng, distribuicao);
        this._encontroAtual = { pokemon: encontro.pokemon };
        return encontro;
    }

    capturar(rng: RNG = defaultRng, modificador?: number): ResultadoCaptura | { erro: string } {
        if (!this._encontroAtual) return { erro: "Nenhum Pokémon em encontro. Faça uma exploração primeiro." };


        const pokemon = this._encontroAtual.pokemon;



        if (this._encontroAtual.capturado) {
            return {
                capturado: false,
                mensagem: "Este Pokémon já foi capturado nesta tentativa.",
                chanceUsada: 0,
            };
        }


        const resultado = tentarCapturar(pokemon, rng, modificador);

        if (resultado.capturado) {
        
            this._ultimaCapturaTs = 0;

            const chave = pokemon.nome;
            const instancia = this.criarInstanciaAPartirDoBanco(pokemon);

            if (this._colecao.has(chave)) {
                const atual = this._colecao.get(chave)!;
       
                this._colecao.set(chave, { pokemonInstancia: atual.pokemonInstancia, quantidade: atual.quantidade + 1 });
            } else {
                this._colecao.set(chave, { pokemonInstancia: instancia, quantidade: 1 });
                this._ordemNomes.push(chave);
            }

            this._encontroAtual.capturado = true;
        }

        return resultado;
    }

    private criarInstanciaAPartirDoBanco(dados: DadosPokemon): Pokemon {
  
        const energia = Math.floor(Math.random() * 50) + 50;
        const atributos = new Atributos(dados.stats.ataque, dados.stats.defesa, dados.stats.agilidade, energia);

        switch (dados.tipo) {
            case "Fogo":
                return new PokemonFogo(dados.nome, atributos);
            case "Agua":
                return new PokemonAgua(dados.nome, atributos);
            case "Eletrico":
                return new PokemonEletrico(dados.nome, atributos);
            default:
                return new Pokemon(dados.nome, atributos, "Normal");
        }
    }

    private renderCard(dados: DadosPokemon): string {
        const linhaTipoRar = `${dados.tipo} • ${dados.raridade}`;
        const stats = `ATK ${dados.stats.ataque} | DEF ${dados.stats.defesa} | AGI ${dados.stats.agilidade}`;
        const aparicao = `Aparição: ${(dados.chanceAparicao * 100).toFixed(0)}% (relativo)`;
        const captura = `Captura: ${(dados.taxaCaptura * 100).toFixed(0)}%`;

        return [
            "╔══════════════════════════════════════╗",
            "║              ENCONTRO               ║",
            "╠══════════════════════════════════════╣",
            `║ #${String(dados.id).padStart(3, "0")} ${dados.nome.padEnd(26, " ")} ║`,
            `║ ${linhaTipoRar.padEnd(37, " ")} ║`,
            `║ ${stats.padEnd(37, " ")} ║`,
            `║ ${aparicao.padEnd(37, " ")} ║`,
            `║ ${captura.padEnd(37, " ")} ║`,
            "╚══════════════════════════════════════╝",
        ].join("\n");
    }

    listarNomes(): string {
        if (this._ordemNomes.length === 0) return "Pokédex vazia!";

        return this._ordemNomes
            .map((nome, i) => {
                const item = this._colecao.get(nome)!;
                return `  ${i + 1}. ${item.pokemonInstancia.getNome()} [${item.pokemonInstancia.getTipo()}] — HP: ${item.pokemonInstancia.getAtributos().getEnergia()} (x${item.quantidade})`;
            })
            .join("\n") + "\n";
    }

    listarTodos(): string {
        if (this._ordemNomes.length === 0) return "Nenhum Pokémon cadastrado na Pokédex ainda!";
        let lista = "\n POKÉMONS NA POKÉDEX:\n";
        this._ordemNomes.forEach((nome, i) => {
            const item = this._colecao.get(nome)!;
            lista += `  ${i + 1}. ${item.pokemonInstancia.getStatus()} (x${item.quantidade})\n`;
        });
        return lista;
    }

    listarEncontro(): string {
        if (!this._encontroAtual) return "Nenhum Pokémon em encontro.";
        return this.renderCard(this._encontroAtual.pokemon);
    }

    treinarPokemon(indice: number): string {
        const pokemon = this.buscarPorIndice(indice);
        if (!pokemon) return "Escolha inválida!";
        const resultado = pokemon.treinar();
        if (resultado === "ok") {
            return `✅ ${pokemon.getNome()} treinou com sucesso!\n   ${pokemon.getStatus()}`;
        }
        return ` ${pokemon.getNome()}: ${resultado}`;
    }

    descansarPokemon(indice: number): string {
        const pokemon = this.buscarPorIndice(indice);
        if (!pokemon) return "Escolha inválida!";
        const ganho = pokemon.descansar();
        return ` ${pokemon.getNome()} descansou e recuperou ${ganho} de energia!\n   ${pokemon.getStatus()}`;
    }

    batalhar(indice1: number, indice2: number): string {
        if (this._ordemNomes.length < 2) {
            return "Você precisa de pelo menos 2 Pokémons para batalhar!";
        }
        if (indice1 === indice2) return "Selecione dois Pokémons diferentes!";

        const pokemon1 = this.buscarPorIndice(indice1);
        const pokemon2 = this.buscarPorIndice(indice2);
        if (!pokemon1 || !pokemon2) return "Escolha inválida!";

        const resultado: ResultadoLuta = pokemon1.lutar(pokemon2);
        let relatorio = `\n${resultado.mensagem}\n`;
        relatorio += `   ${pokemon1.getNome()}: HP restante ${pokemon1.getAtributos().getEnergia()}\n`;
        relatorio += `   ${pokemon2.getNome()}: HP restante ${pokemon2.getAtributos().getEnergia()}`;
        return relatorio;
    }

   
    adicionarPokemonCapturadoAoBanco(id: number): string {
        return this.adicionarDoBanco(id);
    }
}

