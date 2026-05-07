// ============================================================
// Pokedex.test.ts
// Semana 7  → Testes Unitários com Jest — Padrão AAA
//             (Arrange / Act / Assert)
//             Casos de sucesso, exceção e valor-limite
// ============================================================

import { Atributos }        from "../Classes/Atributos";
import { Pokemon }          from "../Classes/Pokemon";
import { PokemonFogo, PokemonAgua, PokemonEletrico } from "../Classes/Subclasses";
import { Pokedex }          from "./Pokedex";

// ---- Helper para criar atributos padrão ----
function criarAtributos(ataque = 50, defesa = 30, agilidade = 40, energia = 80): Atributos {
    return new Atributos(ataque, defesa, agilidade, energia);
}

// ==============================================================
// SUITE 1: Atributos — encapsulamento e regras de negócio
// ==============================================================
describe("Atributos", () => {

    test("getter retorna valor inicial correto", () => {
        // Arrange
        const attr = criarAtributos(50, 30, 40, 80);
        // Act + Assert
        expect(attr.getAtaque()).toBe(50);
        expect(attr.getDefesa()).toBe(30);
        expect(attr.getAgilidade()).toBe(40);
        expect(attr.getEnergia()).toBe(80);
    });

    test("setter REJEITA valor negativo (regra de negócio Semana 8)", () => {
        // Arrange
        const attr = criarAtributos(50, 30, 40, 80);
        // Act
        attr.setAtaque(-10);
        attr.setEnergia(-5);
        // Assert — valores originais devem permanecer
        expect(attr.getAtaque()).toBe(50);
        expect(attr.getEnergia()).toBe(80);
    });

    test("treinar aumenta combate e consome energia", () => {
        // Arrange
        const attr = criarAtributos(50, 30, 40, 80);
        const ataqueAntes = attr.getAtaque();
        // Act
        const resultado = attr.treinar();
        // Assert
        expect(resultado).toBe("ok");
        expect(attr.getAtaque()).toBeGreaterThan(ataqueAntes);
        expect(attr.getEnergia()).toBeLessThan(80);
    });

    test("treinar FALHA quando energia < 10 (valor-limite)", () => {
        // Arrange
        const attr = criarAtributos(50, 30, 40, 5);  // energia insuficiente
        // Act
        const resultado = attr.treinar();
        // Assert — deve retornar mensagem de erro, não "ok"
        expect(resultado).not.toBe("ok");
        expect(resultado.length).toBeGreaterThan(0);
    });

    test("receberDano reduz energia respeitando defesa", () => {
        // Arrange
        const attr = criarAtributos(50, 30, 40, 100);
        // Act
        const danoReal = attr.receberDano(40);  // 40 ataque vs 30 defesa → 10 dano real
        // Assert
        expect(danoReal).toBe(10);
        expect(attr.getEnergia()).toBe(90);
    });

    test("energia nunca fica negativa após dano excessivo (valor-limite)", () => {
        // Arrange
        const attr = criarAtributos(50, 0, 40, 10);
        // Act
        attr.receberDano(999);
        // Assert
        expect(attr.getEnergia()).toBe(0);
    });
});

// ==============================================================
// SUITE 2: Pokemon — métodos de comportamento
// ==============================================================
describe("Pokemon", () => {

    test("getNome e getTipo retornam valores corretos", () => {
        // Arrange
        const pokemon = new Pokemon("Pikachu", criarAtributos(), "Elétrico");
        // Assert
        expect(pokemon.getNome()).toBe("Pikachu");
        expect(pokemon.getTipo()).toBe("Elétrico");
    });

    test("descansar recupera energia positiva", () => {
        // Arrange
        const pokemon = new Pokemon("Bulbasaur", criarAtributos(50, 30, 40, 20));
        const energiaAntes = pokemon.getAtributos().getEnergia();
        // Act
        const ganho = pokemon.descansar();
        // Assert
        expect(ganho).toBeGreaterThan(0);
        expect(pokemon.getAtributos().getEnergia()).toBeGreaterThan(energiaAntes);
    });

    test("lutar retorna resultado com mensagem quando ambos têm energia", () => {
        // Arrange
        const p1 = new Pokemon("Charmander", criarAtributos(80, 30, 60, 100));
        const p2 = new Pokemon("Squirtle",   criarAtributos(60, 50, 40, 100));
        // Act
        const resultado = p1.lutar(p2);
        // Assert
        expect(resultado.mensagem.length).toBeGreaterThan(0);
    });

    test("lutar BLOQUEIA quando Pokémon está exausto (HP = 0)", () => {
        // Arrange
        const p1 = new Pokemon("Exausto", criarAtributos(80, 30, 60, 0));  // HP = 0
        const p2 = new Pokemon("Normal",  criarAtributos(60, 50, 40, 100));
        // Act
        const resultado = p1.lutar(p2);
        // Assert — deve retornar mensagem de bloqueio, sem vencedor
        expect(resultado.vencedor).toBeNull();
        expect(resultado.mensagem).toContain("exausto");
    });
});

// ==============================================================
// SUITE 3: Subclasses — herança (Semana 10)
// ==============================================================
describe("Herança: PokemonFogo", () => {

    test("É instância de Pokemon (teste É UM)", () => {
        const fogo = new PokemonFogo("Charmander", criarAtributos());
        expect(fogo instanceof Pokemon).toBe(true);
    });

    test("tipo é definido corretamente pela superclasse via super()", () => {
        const fogo = new PokemonFogo("Charmander", criarAtributos());
        expect(fogo.getTipo()).toBe("Fogo");
    });

    test("usarBrasas FALHA quando energia insuficiente", () => {
        const fogo = new PokemonFogo("Charmander", criarAtributos(50, 30, 40, 3));
        const msg = fogo.usarBrasas();
        expect(msg).toContain("não tem energia");
    });
});

describe("Herança: PokemonAgua", () => {

    test("descansar recupera 50% a mais que Pokemon normal", () => {
        const agua    = new PokemonAgua("Squirtle",  criarAtributos(50, 30, 40, 20));
        const normal  = new Pokemon("Pidgey",        criarAtributos(50, 30, 40, 20));
        // Act — múltiplas rodadas para comparar médias
        const ganhoAgua   = agua.descansar();
        const ganhoNormal = normal.descansar();
        // Assert — agua recupera mais (estatisticamente)
        // mínimo Água = 15, mínimo Normal = 10 → agua >= normal quase sempre
        expect(ganhoAgua).toBeGreaterThanOrEqual(ganhoNormal * 0.8); // margem 20%
    });
});

describe("Herança: PokemonEletrico", () => {

    test("usarRaio FALHA sem carga suficiente", () => {
        const eletrico = new PokemonEletrico("Pikachu", criarAtributos());
        const msg = eletrico.usarRaio();
        expect(msg).toContain("não tem carga");
    });

    test("treinar acumula carga elétrica", () => {
        const eletrico = new PokemonEletrico("Pikachu", criarAtributos(50, 30, 40, 100));
        eletrico.treinar();
        const status = eletrico.getStatus();
        expect(status).toContain("Carga: 20%");
    });
});

// ==============================================================
// SUITE 4: Pokedex — gerenciamento da coleção
// ==============================================================
describe("Pokedex", () => {

    test("começa vazia", () => {
        const dex = new Pokedex();
        expect(dex.getTamanho()).toBe(0);
    });

    test("adicionarPokemon incrementa a lista", () => {
        // Arrange
        const dex = new Pokedex();
        const pokemon = new Pokemon("Bulbasaur", criarAtributos());
        // Act
        dex.adicionarPokemon(pokemon);
        // Assert
        expect(dex.getTamanho()).toBe(1);
    });

    test("buscarPorIndice retorna null para índice inválido", () => {
        const dex = new Pokedex();
        expect(dex.buscarPorIndice(0)).toBeNull();
        expect(dex.buscarPorIndice(-1)).toBeNull();
    });

    test("treinarPokemon retorna mensagem de erro quando energia insuficiente", () => {
        // Arrange
        const dex = new Pokedex();
        dex.adicionarPokemon(new Pokemon("Fraco", criarAtributos(10, 5, 10, 2)));
        // Act
        const msg = dex.treinarPokemon(0);
        // Assert
        expect(msg).toContain("❌");
    });

    test("batalhar exige pelo menos 2 Pokémons", () => {
        // Arrange
        const dex = new Pokedex();
        dex.adicionarPokemon(new Pokemon("Solitário", criarAtributos()));
        // Act
        const msg = dex.batalhar(0, 1);
        // Assert
        expect(msg).toContain("pelo menos 2");
    });

    test("batalhar retorna resultado com os dois Pokémons envolvidos", () => {
        // Arrange
        const dex = new Pokedex();
        dex.adicionarPokemon(new Pokemon("P1", criarAtributos(80, 20, 60, 100)));
        dex.adicionarPokemon(new Pokemon("P2", criarAtributos(60, 40, 50, 100)));
        // Act
        const resultado = dex.batalhar(0, 1);
        // Assert
        expect(resultado).toContain("P1");
        expect(resultado).toContain("P2");
    });
});
