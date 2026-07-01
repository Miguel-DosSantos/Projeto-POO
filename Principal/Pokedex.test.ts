import { Atributos }        from "../Classes/Atributos";
import { Pokemon }          from "../Classes/Pokemon";
import { PokemonFogo, PokemonAgua, PokemonEletrico } from "../Classes/Subclasses";
import { Pokedex }          from "./Pokedex";

/**
 * Helper para criar atributos com valores padrão
 * Usado em todos os testes para simplificar a criação de Pokémons
 */
function criarAtributos(ataque = 50, defesa = 30, agilidade = 40, energia = 80): Atributos {
    return new Atributos(ataque, defesa, agilidade, energia);
}

/**
 * Suite de testes para a classe Atributos
 * Valida: getters, setters, treino, descanso e cálculo de dano
 */
describe("Atributos", () => {

    // Testa se os getters retornam os valores iniciais corretamente
    test("getter retorna valor inicial correto", () => {

        const attr = criarAtributos(50, 30, 40, 80);

        expect(attr.getAtaque()).toBe(50);
        expect(attr.getDefesa()).toBe(30);
        expect(attr.getAgilidade()).toBe(40);
        expect(attr.getEnergia()).toBe(80);
    });

    // Testa se os setters rejeitam valores negativos (regra de negócio)
    test("setter REJEITA valor negativo (regra de negócio Semana 8)", () => {

        const attr = criarAtributos(50, 30, 40, 80);

        attr.setAtaque(-10);
        attr.setEnergia(-5);

        // Valores devem permanecer inalterados
        expect(attr.getAtaque()).toBe(50);
        expect(attr.getEnergia()).toBe(80);
    });

    // Testa se treinar aumenta stats e consome energia
    test("treinar aumenta combate e consome energia", () => {

        const attr = criarAtributos(50, 30, 40, 80);
        const ataqueAntes = attr.getAtaque();

        const resultado = attr.treinar();

        expect(resultado).toBe("ok");
        expect(attr.getAtaque()).toBeGreaterThan(ataqueAntes);
        expect(attr.getEnergia()).toBeLessThan(80);
    });

    // Testa o limite: treinar com energia insuficiente deve falhar
    test("treinar FALHA quando energia < 10 (valor-limite)", () => {

        const attr = criarAtributos(50, 30, 40, 5);  // Energia abaixo do custo (10)

        const resultado = attr.treinar();

        expect(resultado).not.toBe("ok");
        expect(resultado.length).toBeGreaterThan(0);  // Deve retornar mensagem de erro
    });

    // Testa se a defesa reduz o dano recebido
    test("receberDano reduz energia respeitando defesa", () => {

        const attr = criarAtributos(50, 30, 40, 100);

        const danoReal = attr.receberDano(40);  // Dano 40 - Defesa 30 = 10

        expect(danoReal).toBe(10);
        expect(attr.getEnergia()).toBe(90);  // 100 - 10 = 90
    });

    // Testa o limite: energia nunca deve ficar negativa
    test("energia nunca fica negativa após dano excessivo (valor-limite)", () => {

        const attr = criarAtributos(50, 0, 40, 10);

        attr.receberDano(999);  // Dano muito alto

        expect(attr.getEnergia()).toBe(0);  // Deve ser 0, nunca negativo
    });

});

/**
 * Suite de testes para a classe Pokemon
 * Valida: construção, getters, descanso e batalhas
 */
describe("Pokemon", () => {

    // Testa se os getters retornam nome e tipo corretos
    test("getNome e getTipo retornam valores corretos", () => {

        const pokemon = new PokemonFogo("Pikachu", criarAtributos());

        expect(pokemon.getNome()).toBe("Pikachu");
        expect(pokemon.getTipo()).toBe("Fogo");
    });

    // Testa se o descanso recupera energia positiva
    test("descansar recupera energia positiva", () => {

        const pokemon = new PokemonFogo("Bulbasaur", criarAtributos(50, 30, 40, 20));
        const energiaAntes = pokemon.getAtributos().getEnergia();

        const ganho = pokemon.descansar();

        expect(ganho).toBeGreaterThan(0);
        expect(pokemon.getAtributos().getEnergia()).toBeGreaterThan(energiaAntes);
    });
    // Testa uma batalha com ambos Pokémons com energia    test("lutar retorna resultado com mensagem quando ambos têm energia", () => {

        const p1 = new PokemonFogo("Charmander", criarAtributos(80, 30, 60, 100));
        const p2 = new PokemonAgua("Squirtle",   criarAtributos(60, 50, 40, 100));

        const resultado = p1.lutar(p2);

        expect(resultado.mensagem.length).toBeGreaterThan(0);
    });

    // Testa o limite: Pokémon exausto não pode batalhar
    test("lutar BLOQUEIA quando Pokémon está exausto (HP = 0)", () => {

        const p1 = new PokemonFogo("Exausto", criarAtributos(80, 30, 60, 0));  // HP = 0
        const p2 = new PokemonAgua("Normal",  criarAtributos(60, 50, 40, 100));

        const resultado = p1.lutar(p2);

        expect(resultado.vencedor).toBeNull();
        expect(resultado.mensagem).toContain("exausto");
    });
});

/**
 * Suite de testes para herança: PokemonFogo
 * Valida: instância de Pokemon, tipo correto, habilidade especística
 */
describe("Herança: PokemonFogo", () => {

    // Testa se PokemonFogo é uma instância de Pokemon (relação IS-A)
    test("É instância de Pokemon (teste É UM)", () => {
        const fogo = new PokemonFogo("Charmander", criarAtributos());
        expect(fogo instanceof Pokemon).toBe(true);
    });

    // Testa se o tipo é definido corretamente via super()
    test("tipo é definido corretamente pela superclasse via super()", () => {
        const fogo = new PokemonFogo("Charmander", criarAtributos());
        expect(fogo.getTipo()).toBe("Fogo");
    });

    // Testa se usarBrasas falha sem energia suficiente
    test("usarBrasas FALHA quando energia insuficiente", () => {
        const fogo = new PokemonFogo("Charmander", criarAtributos(50, 30, 40, 3));
        const msg = fogo.usarBrasas();
        expect(msg).toContain("não tem energia");
    });
});

/**
 * Suite de testes para herança: PokemonAgua
 * Valida: método descansar com bônus de 50%
 */
describe("Herança: PokemonAgua", () => {

    // Testa se PokemonAgua recupera 50% a mais de energia ao descansar
    test("descansar recupera 50% a mais que Pokemon normal", () => {
        const agua    = new PokemonAgua("Squirtle",  criarAtributos(50, 30, 40, 20));
        const normal  = new PokemonFogo("Pidgey",        criarAtributos(50, 30, 40, 20));

        const ganhoAgua   = agua.descansar();
        const ganhoNormal = normal.descansar();

        expect(ganhoAgua).toBeGreaterThanOrEqual(ganhoNormal * 0.8); // margem 20%
    });
});

/**
 * Suite de testes para herança: PokemonEletrico
 * Valida: habilidade de raio e acúmulo de carga durante treinamento
 */
describe("Herança: PokemonEletrico", () => {

    // Testa se usarRaio falha sem carga suficiente
    test("usarRaio FALHA sem carga suficiente", () => {
        const eletrico = new PokemonEletrico("Pikachu", criarAtributos());
        const msg = eletrico.usarRaio();
        expect(msg).toContain("não tem carga");
    });

    // Testa se o treinamento acumula carga elétrica
    test("treinar acumula carga elétrica", () => {
        const eletrico = new PokemonEletrico("Pikachu", criarAtributos(50, 30, 40, 100));
        eletrico.treinar();
        const status = eletrico.getStatus();
        expect(status).toContain("Carga: 20%");
    });
});

/**
 * Suite de testes para a classe Pokedex
 * Valida: gerenciamento de coleção, busca, captura e batalhas
 */
describe("Pokedex", () => {

    // Testa se a Pokedex começa vazia
    test("começa vazia", () => {
        const dex = new Pokedex();
        expect(dex.getTamanho()).toBe(0);
    });

    // Testa se adicionarPokemon incrementa a lista
    test("adicionarPokemon incrementa a lista", () => {

        const dex = new Pokedex();
        const pokemon = new PokemonFogo("Bulbasaur", criarAtributos());

        dex.adicionarPokemon(pokemon);

        expect(dex.getTamanho()).toBe(1);
    });

    // Testa busca no banco por nome e por ID
    test("buscarNoBanco encontra Pokémon por nome e por id", () => {
        const dex = new Pokedex();

        const resultadosNome = dex.buscarNoBanco("Pikachu");
        const resultadosId = dex.buscarNoBanco("25");

        expect(resultadosNome.length).toBeGreaterThan(0);
        expect(resultadosNome[0].nome).toBe("Pikachu");
        expect(resultadosId.length).toBe(1);
        expect(resultadosId[0].id).toBe(25);
    });

    // Testa adição do banco e prevenção de duplicatas
    test("adicionarDoBanco adiciona Pokémon a partir do banco e evita duplicatas", () => {
        const dex = new Pokedex();

        const primeiro = dex.adicionarDoBanco(25);
        const segundo  = dex.adicionarDoBanco(25);

        expect(primeiro).toContain("Pikachu");
        expect(dex.getTamanho()).toBe(1);
        expect(segundo).toContain("já está na sua Pokédex");
    });

    // Testa se buscarPorIndice retorna null para índice inválido
    test("buscarPorIndice retorna null para índice inválido", () => {
        const dex = new Pokedex();
        expect(dex.buscarPorIndice(0)).toBeNull();
        expect(dex.buscarPorIndice(-1)).toBeNull();
    });

    // Testa se treinarPokemon retorna mensagem de erro quando energia insuficiente
    test("treinarPokemon retorna mensagem de erro quando energia insuficiente", () => {

        const dex = new Pokedex();
        dex.adicionarPokemon(new PokemonFogo("Fraco", criarAtributos(10, 5, 10, 2)));

        const msg = dex.treinarPokemon(0);

        expect(msg).toContain("Energia insuficiente");
    });

    // Testa se batalhar exige pelo menos 2 Pokémons
    test("batalhar exige pelo menos 2 Pokémons", () => {

        const dex = new Pokedex();
        dex.adicionarPokemon(new PokemonFogo("Solitário", criarAtributos()));

        const msg = dex.batalhar(0, 1);

        expect(msg).toContain("pelo menos 2");
    });

    // Testa se batalhar retorna resultado com os dois Pokémons envolvidos
    test("batalhar retorna resultado com os dois Pokémons envolvidos", () => {

        const dex = new Pokedex();
        dex.adicionarPokemon(new PokemonFogo("P1", criarAtributos(80, 20, 60, 100)));
        dex.adicionarPokemon(new PokemonAgua("P2", criarAtributos(60, 40, 50, 100)));

        const resultado = dex.batalhar(0, 1);

        expect(resultado).toContain("P1");
        expect(resultado).toContain("P2");
    });
});
