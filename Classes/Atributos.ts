/**
 * Classe Atributos: Gerencia os atributos estatísticos de um Pokémon
 * Responsável por armazenar e manipular valores de ATK, DEF, AGI e HP
 */
export class Atributos {

    // Força do ataque - determina o dano causado ao inimigo
    private _ataque: number;
    // Resistência à defesa - reduz o dano recebido
    private _defesa: number;
    // Velocidade - afeta a ordem de ataque e incremento de dano
    private _agilidade: number;
    // Pontos de vida - energia do Pokémon, quando chega a 0 o Pokémon desmaia
    private _energia: number;

    // Inicializa um novo objeto Atributos com os valores fornecidos
    constructor(ataque: number, defesa: number, agilidade: number, energia: number) {
        this._ataque    = ataque;
        this._defesa    = defesa;
        this._agilidade = agilidade;
        this._energia   = energia;
    }

    // Métodos Getters: Retornam os valores atuais dos atributos
    // Retorna o valor de ataque
    getAtaque(): number    { return this._ataque;    }
    // Retorna o valor de defesa
    getDefesa(): number    { return this._defesa;    }
    // Retorna o valor de agilidade
    getAgilidade(): number { return this._agilidade; }
    // Retorna o valor de energia (HP)
    getEnergia(): number   { return this._energia;   }

    // Métodos Setters: Modificam os valores dos atributos (não permite valores negativos)
    // Define um novo valor de ataque
    setAtaque(valor: number): void {
        if (valor < 0) return;
        this._ataque = valor;
    }

    // Define um novo valor de defesa
    setDefesa(valor: number): void {
        if (valor < 0) return;
        this._defesa = valor;
    }

    // Define um novo valor de agilidade
    setAgilidade(valor: number): void {
        if (valor < 0) return;
        this._agilidade = valor;
    }

    // Define um novo valor de energia (HP)
    setEnergia(valor: number): void {
        if (valor < 0) return;
        this._energia = valor;
    }

    // Treina o Pokémon: aumenta ATK +5, DEF +3, AGI +2 e gasta 10 de energia
    // Retorna mensagem de erro se energia for insuficiente
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

    // Recupera energia do Pokémon baseado no valor passado (ganho)
    descansar(ganho: number): void {
        this._energia += ganho;
    }

    // Calcula e aplica o dano recebido: defesa reduz o dano, energia é decrementada
    // Retorna o dano real aplicado (após redução pela defesa)
    receberDano(danoRecebido: number): number {
        const danoReal = Math.max(0, danoRecebido - this._defesa);
        this._energia  = Math.max(0, this._energia - danoReal);
        return danoReal;
    }

    // Calcula o poder total do ataque: ataque + (agilidade * 0.5)
    // Agilidade influencia 50% no poder total do ataque
    calcularPoderAtaque(): number {
        return this._ataque + this._agilidade * 0.5;
    }

    // Retorna uma string formatada com todos os status atuais do Pokémon
    getStatus(): string {
        return `ATK:${this._ataque} | DEF:${this._defesa} | AGI:${this._agilidade} | HP:${this._energia}`;
    }
}