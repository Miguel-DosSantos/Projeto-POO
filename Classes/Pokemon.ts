import { Atributos } from "./Atributos";

/**
 * Interface que representa o resultado de uma batalha entre dois Pokémons
 */
export interface ResultadoLuta {
    vencedor: Pokemon | null;  // Pokémon que venceu (null em caso de empate)
    mensagem: string;          // Mensagem descritiva da batalha
}

/**
 * Classe abstrata Pokémon: Base para todos os tipos de Pokémons
 * Define comportamentos comuns: treino, descanso, batalhas e status
 */
export abstract class Pokemon {

    // Nome do Pokémon
    protected _nome: string;
    // Atributos de combate (ATK, DEF, AGI, HP)
    protected _atributos: Atributos;
    // Tipo do Pokémon (Fogo, Água, Elétrico, Normal)
    protected _tipo: string;

    // Inicializa um novo Pokémon com nome, atributos e tipo
    constructor(nome: string, atributos: Atributos, tipo: string = "Normal") {
        this._nome      = nome;
        this._atributos = atributos;
        this._tipo      = tipo;
    }

    // ========== GETTERS ==========
    // Retorna o nome do Pokémon
    getNome(): string          { return this._nome;       }
    // Retorna os atributos do Pokémon
    getAtributos(): Atributos  { return this._atributos;  }
    // Retorna o tipo do Pokémon
    getTipo(): string          { return this._tipo;       }

    // ========== AÇÕES COM ATRIBUTOS ==========
    // Treina o Pokémon (delegado aos atributos)
    treinar(): string {
        return this._atributos.treinar();
    }

    // Descansa e recupera energia aleatória entre 10 e 30
    descansar(): number {
        const ganho = Math.floor(Math.random() * 20) + 10;
        this._atributos.descansar(ganho);
        return ganho;
    }

    // ========== BATALHAS ==========
    // Realiza uma batalha contra outro Pokémon
    lutar(adversario: Pokemon): ResultadoLuta {
        // Valida se ambos podem lutar (têm energia)
        if (this._atributos.getEnergia() <= 0) {
            return {
                vencedor: null,
                mensagem: `${this._nome} está exausto e não consegue lutar! Descanse primeiro.`,
            };
        }
        if (adversario.getAtributos().getEnergia() <= 0) {
            return {
                vencedor: null,
                mensagem: `${adversario.getNome()} está exausto e não consegue lutar! Descanse primeiro.`,
            };
        }

        // Calcula poder de ataque com variação aleatória (80-120%)
        const poderAtacante   = this._atributos.calcularPoderAtaque()          * (Math.random() * 0.4 + 0.8);
        const poderAdversario = adversario.getAtributos().calcularPoderAtaque() * (Math.random() * 0.4 + 0.8);

        // Ambos recebem dano
        adversario.getAtributos().receberDano(poderAtacante);
        this._atributos.receberDano(poderAdversario);

        // Determina vencedor baseado no poder de ataque
        if (poderAtacante > poderAdversario) {
            return {
                vencedor: this,
                mensagem: `⚔️  ${this._nome} venceu a batalha contra ${adversario.getNome()}!`,
            };
        }
        if (poderAdversario > poderAtacante) {
            return {
                vencedor: adversario,
                mensagem: `⚔️  ${adversario.getNome()} venceu a batalha contra ${this._nome}!`,
            };
        }
        // Se o poder é igual, resulta em empate
        return { vencedor: null, mensagem: "⚔️  A batalha terminou em empate!" };
    }

    // ========== EXIBIÇÃO ==========
    // Retorna uma string com status formatado: tipo, nome e atributos
    getStatus(): string {
        return `[${this._tipo}] ${this._nome} — ${this._atributos.getStatus()}`;
    }
}