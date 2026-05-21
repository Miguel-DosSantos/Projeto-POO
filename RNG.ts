
export interface RNG {
    random(): number;
}

export const defaultRng: RNG = {
    random: () => Math.random(),
};
export function criarRngFixo(valores: number[]): RNG {
    let index = 0;
    return {
        random(): number {
            const v = valores[index % valores.length] ?? 0;
            index++;
            return v;
        },
    };
}