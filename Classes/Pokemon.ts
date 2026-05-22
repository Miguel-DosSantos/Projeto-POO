import { Atributos } from "./Atributos";

export interface ResultadoLuta {
    vencedor: Pokemon | null;
    mensagem: string;
}

export abstract class Pokemon {

    protected _nome: string;
    protected _atributos: Atributos;
    protected _tipo: string;

    constructor(nome: string, atributos: Atributos, tipo: string = "Normal") {
        this._nome      = nome;
        this._atributos = atributos;
        this._tipo      = tipo;
    }

    getNome(): string          { return this._nome;       }
    getAtributos(): Atributos  { return this._atributos;  }
    getTipo(): string          { return this._tipo;       }

    treinar(): string {
        return this._atributos.treinar();
    }

    descansar(): number {
        const ganho = Math.floor(Math.random() * 20) + 10;
        this._atributos.descansar(ganho);
        return ganho;
    }

    lutar(adversario: Pokemon): ResultadoLuta {
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

        const poderAtacante   = this._atributos.calcularPoderAtaque()          * (Math.random() * 0.4 + 0.8);
        const poderAdversario = adversario.getAtributos().calcularPoderAtaque() * (Math.random() * 0.4 + 0.8);

        adversario.getAtributos().receberDano(poderAtacante);
        this._atributos.receberDano(poderAdversario);

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
        return { vencedor: null, mensagem: "⚔️  A batalha terminou em empate!" };
    }

    getStatus(): string {
        return `[${this._tipo}] ${this._nome} — ${this._atributos.getStatus()}`;
    }
}