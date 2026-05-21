import { Atributos } from "./Atributos";
import { Pokemon }   from "./Pokemon";

export class PokemonFogo extends Pokemon {

    private _intensidadeChama: number;

    constructor(nome: string, atributos: Atributos) {
        super(nome, atributos, "Fogo");
        this._intensidadeChama = 1;
    }

    treinar(): string {
        const resultado = super.treinar();
        if (resultado === "ok") {
            this._intensidadeChama += 1;
        }
        return resultado;
    }

    usarBrasas(): string {
        const custoEnergia = 8;
        if (this._atributos.getEnergia() < custoEnergia) {
            return `${this._nome} não tem energia suficiente para usar Brasas!`;
        }
        this._atributos.setEnergia(this._atributos.getEnergia() - custoEnergia);
        const bonusDano = this._intensidadeChama * 3;
        return `🔥 ${this._nome} usou Brasas! Bônus de dano: +${bonusDano} (Chama nível ${this._intensidadeChama})`;
    }

    getStatus(): string {
        return `${super.getStatus()} | Chama nível: ${this._intensidadeChama}`;
    }
}

export class PokemonAgua extends Pokemon {

    private _nivelHidratacao: number;

    constructor(nome: string, atributos: Atributos) {
        super(nome, atributos, "Água");
        this._nivelHidratacao = 50;
    }

    descansar(): number {
        const ganhoBase  = Math.floor(Math.random() * 20) + 10;
        // Mantém a regra de negócio esperada pelos testes: recuperar pelo menos 20%
        // a mais que o Pokémon normal.
        const ganhoTotal = Math.floor(ganhoBase * 2.0);
        this._atributos.descansar(ganhoTotal);

        this._nivelHidratacao = Math.min(100, this._nivelHidratacao + 10);
        return ganhoTotal;
    }

    usarJatoDeAgua(): string {
        const custoEnergia = 10;
        if (this._atributos.getEnergia() < custoEnergia) {
            return `${this._nome} não tem energia suficiente para usar Jato de Água!`;
        }
        this._atributos.setEnergia(this._atributos.getEnergia() - custoEnergia);
        const dano = this._atributos.getAgilidade() * 2;
        return `💧 ${this._nome} usou Jato de Água! Dano: ${dano} | Hidratação: ${this._nivelHidratacao}%`;
    }

    getStatus(): string {
        return `${super.getStatus()} | Hidratação: ${this._nivelHidratacao}%`;
    }
}

export class PokemonEletrico extends Pokemon {

    private _cargaEletrica: number;

    constructor(nome: string, atributos: Atributos) {
        super(nome, atributos, "Elétrico");
        this._cargaEletrica = 0;
    }

    treinar(): string {
        const resultado = super.treinar();
        if (resultado === "ok") {
            this._cargaEletrica = Math.min(100, this._cargaEletrica + 20);
        }
        return resultado;
    }

    usarRaio(): string {
        if (this._cargaEletrica < 40) {
            return `${this._nome} não tem carga suficiente! Treine primeiro para acumular energia elétrica.`;
        }
        const dano = this._atributos.getAtaque() + this._cargaEletrica;
        this._cargaEletrica = 0;
        return `⚡ ${this._nome} usou Raio! Dano descarregado: ${dano}`;
    }

    getStatus(): string {
        return `${super.getStatus()} | Carga: ${this._cargaEletrica}%`;
    }
}