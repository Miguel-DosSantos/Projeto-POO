export class Atributos {

    private _ataque: number;
    private _defesa: number;
    private _agilidade: number;
    private _energia: number;

    constructor(ataque: number, defesa: number, agilidade: number, energia: number) {
        this._ataque    = ataque;
        this._defesa    = defesa;
        this._agilidade = agilidade;
        this._energia   = energia;
    }

    getAtaque(): number    { return this._ataque;    }
    getDefesa(): number    { return this._defesa;    }
    getAgilidade(): number { return this._agilidade; }
    getEnergia(): number   { return this._energia;   }

    setAtaque(valor: number): void {
        if (valor < 0) return;
        this._ataque = valor;
    }

    setDefesa(valor: number): void {
        if (valor < 0) return;
        this._defesa = valor;
    }

    setAgilidade(valor: number): void {
        if (valor < 0) return;
        this._agilidade = valor;
    }

    setEnergia(valor: number): void {
        if (valor < 0) return;
        this._energia = valor;
    }

    treinar(): string {
        const CUSTO_ENERGIA = 10;
        if (this._energia < CUSTO_ENERGIA) {
            return "Energia insuficiente para treinar! Pokémon precisa descansar primeiro.";
        }
        this._ataque    += 5;
        this._defesa    += 3;
        this._agilidade += 2;
        this._energia   -= CUSTO_ENERGIA;
        return "ok";
    }

    descansar(ganho: number): void {
        this._energia += ganho;
    }

    receberDano(danoRecebido: number): number {
        const danoReal = Math.max(0, danoRecebido - this._defesa);
        this._energia  = Math.max(0, this._energia - danoReal);
        return danoReal;
    }

    calcularPoderAtaque(): number {
        return this._ataque + this._agilidade * 0.5;
    }

    getStatus(): string {
        return `ATK:${this._ataque} | DEF:${this._defesa} | AGI:${this._agilidade} | HP:${this._energia}`;
    }
}