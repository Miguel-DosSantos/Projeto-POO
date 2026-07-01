import { defaultRng as _defaultRng, type RNG as _RNG } from "../RNG";

/**
 * RNG padrão do jogo
 * Usado para gerar números aleatórios em explorações e capturas
 */
export const defaultRng: _RNG = _defaultRng;

/**
 * Tipo de interface para o gerador de números aleatórios
 */
export type RNG = _RNG;
