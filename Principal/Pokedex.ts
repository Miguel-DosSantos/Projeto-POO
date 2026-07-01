import { Atributos } from "../Classes/Atributos";
import { Pokemon, ResultadoLuta } from "../Classes/Pokemon";
import { PokemonFogo, PokemonAgua, PokemonEletrico } from "../Classes/Subclasses";
import { BANCO_POKEMONS, DadosPokemon } from "../Data/BancoPokemon";
import { explorar, type DistribuicaoRaridade, type ResultadoEncontro } from "../Game/Exploracao";
import { defaultRng, type RNG } from "../Game/RNG";
import { tentarCapturar, type ResultadoCaptura } from "../Game/Captura";

/**
 * Tipos internos para o estado da Pokédex
 */
// Estado do encontro atual durante uma exploração
type EstadoEncontro = {
    pokemon: DadosPokemon;     // Dados do Pokémon encontrado
    capturado?: boolean;       // Se já foi capturado nesta sessão
};

// Pokémon armazenado na coleção
type PokemonColecionado = {
    pokemonInstancia: Pokemon; // Instância do Pokémon (com atributos mutáveis)
    quantidade: number;        // Quantidade de cópias na coleção
};

/**
 * Classe Pokédex: Gerencia a coleção de Pokémons capturados
 * Responsável por exploração, captura, treinamento e batalhas
 */
export class Pokedex {
    // Mapa de Pokémons coletados: chave é o nome, valor é o Pokémon e quantidade
    private _colecao: Map<string, PokemonColecionado> = new Map();
    // Ordem de inserção dos Pokémons (para manter ordem na exibição)
    private _ordemNomes: string[] = [];

    // Encontro atual durante exploração
    private _encontroAtual: EstadoEncontro | null = null;

    // Cooldown entre explorações (ms) - permite controlar frequência
    private _cooldownExplorarMs = 0;
    // Timestamp da última exploração
    private _ultimaExploracaoTs = 0;

    // Cooldown entre capturas (ms) - padrão 5 segundos
    private _cooldownCapturarMs = 5_000;
    // Timestamp da última captura
    private _ultimaCapturaTs = 0;

    // Construtor vazio - inicializa collections
    constructor() {}

    // ========== GETTERS SIMPLES ==========
    // Retorna o número de Pokémons únicos coletados
    getTamanho(): number {
        return this._ordemNomes.length;
    }

    // Retorna lista com todas as instâncias de Pokémons na coleção
    getPokemons(): Pokemon[] {
        return this._ordemNomes.map((nome) => this._colecao.get(nome)!.pokemonInstancia);
    }

    // ========== BUSCA NO BANCO DE DADOS ==========
    // Busca Pokémons no banco de dados por ID ou nome (substring matching)
    buscarNoBanco(termoBusca: string): DadosPokemon[] {
        const termo = termoBusca.toLowerCase().trim();
        if (!termo) return [];

        // Tenta interpretar como ID numérico
        const porId = Number(termoBusca);
        if (!isNaN(porId)) {
            const encontrado = BANCO_POKEMONS.find((p) => p.id === porId);
            return encontrado ? [encontrado] : [];
        }

        // Busca por nome (case-insensitive)
        return BANCO_POKEMONS.filter((p) => p.nome.toLowerCase().includes(termo));
    }

    // ========== ADICIONAR POKÉMONS ==========
    // Adiciona um Pokémon do banco de dados à coleção pelo ID
    adicionarDoBanco(id: number): string {
        const dados = BANCO_POKEMONS.find((p) => p.id === id);
        if (!dados) return `Pokémon com ID ${id} não encontrado no banco.`;

        // Verifica se já existe na coleção
        if (this._colecao.has(dados.nome)) {
            return `${dados.nome} já está na sua Pokédex!`;
        }

        // Cria nova instância e adiciona à coleção
        const instancia = this.criarInstanciaAPartirDoBanco(dados);
        this._colecao.set(dados.nome, { pokemonInstancia: instancia, quantidade: 1 });
        this._ordemNomes.push(dados.nome);

        return ` #${String(dados.id).padStart(3, "0")} ${dados.nome} [${dados.tipo}] adicionado!`;
    }

    // Adiciona um Pokémon instanciado à coleção
    adicionarPokemon(pokemon: Pokemon): void {
        const nome = pokemon.getNome();
        if (this._colecao.has(nome)) {
            // Aumenta a quantidade se já existe
            const atual = this._colecao.get(nome)!;
            this._colecao.set(nome, { ...atual, quantidade: atual.quantidade + 1 });
            return;
        }
        // Novo Pokémon
        this._colecao.set(nome, { pokemonInstancia: pokemon, quantidade: 1 });
        this._ordemNomes.push(nome);
    }

    // ========== BUSCA NA COLEÇÃO ==========
    // Busca um Pokémon na coleção pelo índice (retorna null se fora do intervalo)
    buscarPorIndice(indice: number): Pokemon | null {
        if (indice < 0 || indice >= this._ordemNomes.length) return null;
        const nome = this._ordemNomes[indice]!;
        return this._colecao.get(nome)!.pokemonInstancia;
    }

    // ========== ENCONTRO ATUAL ==========
    // Retorna os dados do Pokémon em encontro (null se nenhum)
    getEncontroAtual(): DadosPokemon | null {
        return this._encontroAtual?.pokemon ?? null;
    }

    // ========== COOLDOWN EXPLORAÇÃO ==========
    // Retorna tempo restante do cooldown de exploração (ms)
    getTempoRestanteCooldownExplorarMs(): number {
        const agora = Date.now();
        const fim = this._ultimaExploracaoTs + this._cooldownExplorarMs;
        return Math.max(0, fim - agora);
    }

    // Define o cooldown de exploração
    setCooldownExplorarMs(ms: number): void {
        this._cooldownExplorarMs = Math.max(0, ms);
    }

    // ========== COOLDOWN CAPTURA ==========
    // Retorna tempo restante do cooldown de captura (ms)
    getTempoRestanteCooldownCapturarMs(): number {
        const agora = Date.now();
        const fim = this._ultimaCapturaTs + this._cooldownCapturarMs;
        return Math.max(0, fim - agora);
    }

    // Define o cooldown de captura
    setCooldownCapturarMs(ms: number): void {
        this._cooldownCapturarMs = Math.max(0, ms);
    }

    // ========== EXPLORAÇÃO ==========
    // Explora a natureza e encontra um Pokémon (respeitando cooldown)
    explorar(rng: RNG = defaultRng, distribuicao?: DistribuicaoRaridade): ResultadoEncontro | { erro: string } {
        // Verifica cooldown ativo
        const restante = this.getTempoRestanteCooldownExplorarMs();
        if (restante > 0) {
            return { erro: `Cooldown ativo: aguarde ${Math.ceil(restante / 1000)}s.` };
        }

        // Atualiza timestamp e realiza exploração
        this._ultimaExploracaoTs = Date.now();
        const encontro = explorar(rng, distribuicao);
        this._encontroAtual = { pokemon: encontro.pokemon };
        return encontro;
    }

    // ========== CAPTURA ==========
    // Tenta capturar o Pokémon em encontro (respeitando cooldown)
    capturar(rng: RNG = defaultRng, modificador?: number): ResultadoCaptura | { erro: string } {
        // Valida se há Pokémon em encontro
        if (!this._encontroAtual) return { erro: "Nenhum Pokémon em encontro. Faça uma exploração primeiro." };

        const pokemon = this._encontroAtual.pokemon;

        // Verifica se já foi capturado nesta sessão
        if (this._encontroAtual.capturado) {
            return {
                capturado: false,
                mensagem: "Este Pokémon já foi capturado nesta tentativa.",
                chanceUsada: 0,
            };
        }

        // Realiza a tentativa de captura
        const resultado = tentarCapturar(pokemon, rng, modificador);

        // Se capturou com sucesso, adiciona à coleção
        if (resultado.capturado) {
            // Reseta cooldown de captura
            this._ultimaCapturaTs = 0;

            const chave = pokemon.nome;
            const instancia = this.criarInstanciaAPartirDoBanco(pokemon);

            // Adiciona à coleção
            if (this._colecao.has(chave)) {
                const atual = this._colecao.get(chave)!;
                this._colecao.set(chave, { pokemonInstancia: atual.pokemonInstancia, quantidade: atual.quantidade + 1 });
            } else {
                this._colecao.set(chave, { pokemonInstancia: instancia, quantidade: 1 });
                this._ordemNomes.push(chave);
            }

            // Marca como capturado nesta sessão
            this._encontroAtual.capturado = true;
        }

        return resultado;
    }

    // ========== HELPER PRIVADOS ==========
    // Cria uma instância de Pokémon a partir dos dados do banco
    private criarInstanciaAPartirDoBanco(dados: DadosPokemon): Pokemon {
        // Gera energia aleatória entre 50 e 100
        const energia = Math.floor(Math.random() * 50) + 50;
        // Cria atributos com base nos dados
        const atributos = new Atributos(dados.stats.ataque, dados.stats.defesa, dados.stats.agilidade, energia);

        // Retorna instância do tipo correto
        switch (dados.tipo) {
            case "Fogo":
                return new PokemonFogo(dados.nome, atributos);
            case "Agua":
                return new PokemonAgua(dados.nome, atributos);
            case "Eletrico":
                return new PokemonEletrico(dados.nome, atributos);
            default:
                return new PokemonFogo(dados.nome, atributos);
        }
    }

    // Renderiza um card visual do Pokémon em encontro
    private renderCard(dados: DadosPokemon): string {
        const linhaTipoRar = `${dados.tipo} • ${dados.raridade}`;
        const stats = `ATK ${dados.stats.ataque} | DEF ${dados.stats.defesa} | AGI ${dados.stats.agilidade}`;
        const aparicao = `Aparição: ${(dados.chanceAparicao * 100).toFixed(0)}% (relativo)`;
        const captura = `Captura: ${(dados.taxaCaptura * 100).toFixed(0)}%`;

        return [
            "╔══════════════════════════════════════╗",
            "║              ENCONTRO                ║",
            "╠══════════════════════════════════════╣",
            `║ #${String(dados.id).padStart(3, "0")} ${dados.nome.padEnd(26, " ")}      ║`,
            `║ ${linhaTipoRar.padEnd(37, " ")}║`,
            `║ ${stats.padEnd(37, " ")}║`,
            `║ ${aparicao.padEnd(37, " ")}║`,
            `║ ${captura.padEnd(37, " ")}║`,
            "╚══════════════════════════════════════╝",
        ].join("\n");
    }

    // ========== LISTAGENS E EXIBIÇÕES ==========
    // Lista nomes dos Pokémons na coleção com HP
    listarNomes(): string {
        if (this._ordemNomes.length === 0) return "Pokédex vazia!";

        return this._ordemNomes
            .map((nome, i) => {
                const item = this._colecao.get(nome)!;
                return `  ${i + 1}. ${item.pokemonInstancia.getNome()} [${item.pokemonInstancia.getTipo()}] — HP: ${item.pokemonInstancia.getAtributos().getEnergia()} (x${item.quantidade})`;
            })
            .join("\n") + "\n";
    }

    // Lista todos os Pokémons com status completo
    listarTodos(): string {
        if (this._ordemNomes.length === 0) return "Nenhum Pokémon cadastrado na Pokédex ainda!";
        let lista = "\n POKÉMONS NA POKÉDEX:\n";
        this._ordemNomes.forEach((nome, i) => {
            const item = this._colecao.get(nome)!;
            lista += `  ${i + 1}. ${item.pokemonInstancia.getStatus()} (x${item.quantidade})\n`;
        });
        return lista;
    }

    // Exibe o Pokémon em encontro com card visual
    listarEncontro(): string {
        if (!this._encontroAtual) return "Nenhum Pokémon em encontro.";
        return "\n\n" + this.renderCard(this._encontroAtual.pokemon) + "\n";
    }

    // ========== AÇÕES COM POKÉMONS ==========
    // Treina um Pokémon da coleção pelo índice
    treinarPokemon(indice: number): string {
        const pokemon = this.buscarPorIndice(indice);
        if (!pokemon) return "Escolha inválida!";
        const resultado = pokemon.treinar();
        if (resultado === "ok") {
            return `✅ ${pokemon.getNome()} treinou com sucesso!\n   ${pokemon.getStatus()}`;
        }
        return ` ${pokemon.getNome()}: ${resultado}`;
    }

    // Descansa um Pokémon da coleção pelo índice
    descansarPokemon(indice: number): string {
        const pokemon = this.buscarPorIndice(indice);
        if (!pokemon) return "Escolha inválida!";
        const ganho = pokemon.descansar();
        return ` ${pokemon.getNome()} descansou e recuperou ${ganho} de energia!\n   ${pokemon.getStatus()}`;
    }

    // ========== BATALHAS ==========
    // Realiza uma batalha entre dois Pokémons da coleção
    batalhar(indice1: number, indice2: number): string {
        if (this._ordemNomes.length < 2) {
            return "Você precisa de pelo menos 2 Pokémons para batalhar!";
        }
        if (indice1 === indice2) return "Selecione dois Pokémons diferentes!";

        const pokemon1 = this.buscarPorIndice(indice1);
        const pokemon2 = this.buscarPorIndice(indice2);
        if (!pokemon1 || !pokemon2) return "Escolha inválida!";

        // Realiza a luta e coleta resultado
        const resultado: ResultadoLuta = pokemon1.lutar(pokemon2);
        let relatorio = `\n${resultado.mensagem}\n`;
        relatorio += `   ${pokemon1.getNome()}: HP restante ${pokemon1.getAtributos().getEnergia()}\n`;
        relatorio += `   ${pokemon2.getNome()}: HP restante ${pokemon2.getAtributos().getEnergia()}`;
        return relatorio;
    }

    // Alias para adicionar do banco
    adicionarPokemonCapturadoAoBanco(id: number): string {
        return this.adicionarDoBanco(id);
    }
}

