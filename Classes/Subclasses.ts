import { Atributos } from "./Atributos";
import { Pokemon }   from "./Pokemon";

/**
 * Subclasse PokemonFogo: Especializado em ataques de chama
 * Aumenta intensidade da chama ao treinar
 * Habilidade: usarBrasas() - gasta 8 de energia
 */
export class PokemonFogo extends Pokemon {

    // Nível de intensidade das chamas (aumenta a cada treinamento)
    private _intensidadeChama: number;

    // Inicializa como tipo Fogo
    constructor(nome: string, atributos: Atributos) {
        super(nome, atributos, "Fogo");
        this._intensidadeChama = 1;  // Começa no nível 1
    }

    // Treina e aumenta a intensidade da chama
    treinar(): string {
        const resultado = super.treinar();
        if (resultado === "ok") {
            this._intensidadeChama += 1;
        }
        return resultado;
    }

    // Usa habilidade especial Brasas
    // Gasta 8 de energia e causa dano baseado na intensidade da chama
    usarBrasas(): string {
        const custoEnergia = 8;
        if (this._atributos.getEnergia() < custoEnergia) {
            return `${this._nome} não tem energia suficiente para usar Brasas!`;
        }
        this._atributos.setEnergia(this._atributos.getEnergia() - custoEnergia);
        const bonusDano = this._intensidadeChama * 3;
        return `🔥 ${this._nome} usou Brasas! Bônus de dano: +${bonusDano} (Chama nível ${this._intensidadeChama})`;
    }

    // Adiciona nível de chama ao status
    getStatus(): string {
        return `${super.getStatus()} | Chama nível: ${this._intensidadeChama}`;
    }
}

/**
 * Subclasse PokemonAgua: Especializado em recuperação de energia
 * Recupera 50% a mais de energia ao descansar
 * Habilidade: usarJatoDeAgua() - gasta 10 de energia, dano baseado em agilidade
 */
export class PokemonAgua extends Pokemon {

    // Nível de hidratação (melhora recuperação de energia)
    private _nivelHidratacao: number;

    // Inicializa como tipo Água
    constructor(nome: string, atributos: Atributos) {
        super(nome, atributos, "Água");
        this._nivelHidratacao = 50;  // Começa no nível 50%
    }

    // Descanso especial: recupera 2x a energia normal (50% a mais)
    descansar(): number {
        const ganhoBase  = Math.floor(Math.random() * 20) + 10;
        const ganhoTotal = Math.floor(ganhoBase * 2.0);  // Dobro da recuperação
        this._atributos.descansar(ganhoTotal);

        // Aumenta hidratação
        this._nivelHidratacao = Math.min(100, this._nivelHidratacao + 10);
        return ganhoTotal;
    }

    // Usa habilidade especial Jato de Água
    // Gasta 10 de energia e causa dano baseado em agilidade
    usarJatoDeAgua(): string {
        const custoEnergia = 10;
        if (this._atributos.getEnergia() < custoEnergia) {
            return `${this._nome} não tem energia suficiente para usar Jato de Água!`;
        }
        this._atributos.setEnergia(this._atributos.getEnergia() - custoEnergia);
        const dano = this._atributos.getAgilidade() * 2;
        return `💧 ${this._nome} usou Jato de Água! Dano: ${dano} | Hidratação: ${this._nivelHidratacao}%`;
    }

    // Adiciona nível de hidratação ao status
    getStatus(): string {
        return `${super.getStatus()} | Hidratação: ${this._nivelHidratacao}%`;
    }
}

/**
 * Subclasse PokemonEletrico: Especializado em ataques elétricos poderosos
 * Acumula carga elétrica ao treinar
 * Habilidade: usarRaio() - gasta 40% de carga, causa dano baseado em ATK + carga
 */
export class PokemonEletrico extends Pokemon {

    // Carga elétrica acumulada (0-100%)
    private _cargaEletrica: number;

    // Inicializa como tipo Elétrico
    constructor(nome: string, atributos: Atributos) {
        super(nome, atributos, "Elétrico");
        this._cargaEletrica = 0;  // Começa sem carga
    }

    // Treina e acumula carga elétrica
    treinar(): string {
        const resultado = super.treinar();
        if (resultado === "ok") {
            this._cargaEletrica = Math.min(100, this._cargaEletrica + 20);  // Máximo 100%
        }
        return resultado;
    }

    // Usa habilidade especial Raio
    // Requer 40% de carga e descarrega toda a energia em um ataque poderoso
    usarRaio(): string {
        if (this._cargaEletrica < 40) {
            return `${this._nome} não tem carga suficiente! Treine primeiro para acumular energia elétrica.`;
        }
        // Dano = Ataque + Carga acumulada
        const dano = this._atributos.getAtaque() + this._cargaEletrica;
        this._cargaEletrica = 0;  // Descarrega tudo
        return `⚡ ${this._nome} usou Raio! Dano descarregado: ${dano}`;
    }

    // Adiciona nível de carga ao status
    getStatus(): string {
        return `${super.getStatus()} | Carga: ${this._cargaEletrica}%`;
    }
}