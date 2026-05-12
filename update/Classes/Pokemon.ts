import { Atributos } from "./Atributos";

export class Pokemon {

    protected _nome: string;
    protected _atributos: Atributos;
    protected _tipo: string;

    constructor(nome: string, atributos: Atributos, tipo: string = "Normal") {
        this._nome      = nome;
        this._atributos = atributos;
        this._tipo      = tipo;
    }

    getNome(): string        { return this._nome;       }
    getAtributos(): Atributos { return this._atributos;  }
    getTipo(): string        { return this._tipo;       }

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
                mensagem: `${this._nome} está exausto e não consegue lutar! Descanse primeiro.`
            };
        }
        if (adversario.getAtributos().getEnergia() <= 0) {
            return {
                vencedor: null,
                mensagem: `${adversario.getNome()} está exausto e não consegue lutar! Descanse primeiro.`
            };
        }

        const poderAtacante  = this._atributos.calcularPoderAtaque()  * (Math.random() * 0.4 + 0.8);
        const poderAdversario = adversario.getAtributos().calcularPoderAtaque() * (Math.random() * 0.4 + 0.8);

        const danoNoAdversario = this._atributos.receberDano(0) + poderAtacante;
        const danoNoAtacante   = adversario.getAtributos().receberDano(0) + poderAdversario;

        adversario.getAtributos().receberDano(poderAtacante);
        this._atributos.receberDano(poderAdversario);

        let vencedor: Pokemon | null = null;
        let mensagem: string;

        if (poderAtacante > poderAdversario) {
            vencedor = this;
            mensagem = `⚔️  ${this._nome} venceu a batalha contra ${adversario.getNome()}!`;
        } else if (poderAdversario > poderAtacante) {
            vencedor = adversario;
            mensagem = `⚔️  ${adversario.getNome()} venceu a batalha contra ${this._nome}!`;
        } else {
            mensagem = "⚔️  A batalha terminou em empate!";
        }

        return { vencedor, mensagem };
    }

    getStatus(): string {
        return `[${this._tipo}] ${this._nome} — ${this._atributos.getStatus()}`;
    }
}

export interface ResultadoLuta {
    vencedor: Pokemon | null;
    mensagem: string;
}
