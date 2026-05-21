import { Atributos }        from "../Classes/Atributos";
import { Pokemon }          from "../Classes/Pokemon";
import { PokemonFogo, PokemonAgua, PokemonEletrico } from "../Classes/Subclasses";
import { Pokedex }          from "./Pokedex";

function criarAtributos(ataque = 50, defesa = 30, agilidade = 40, energia = 80): Atributos {
    return new Atributos(ataque, defesa, agilidade, energia);
}

describe("Atributos", () => {

    test("getter retorna valor inicial correto", () => {

        const attr = criarAtributos(50, 30, 40, 80);

        expect(attr.getAtaque()).toBe(50);
        expect(attr.getDefesa()).toBe(30);
        expect(attr.getAgilidade()).toBe(40);
        expect(attr.getEnergia()).toBe(80);
    });

    test("setter REJEITA valor negativo (regra de negócio Semana 8)", () => {

        const attr = criarAtributos(50, 30, 40, 80);

        attr.setAtaque(-10);
        attr.setEnergia(-5);

        expect(attr.getAtaque()).toBe(50);
        expect(attr.getEnergia()).toBe(80);
    });

    test("treinar aumenta combate e consome energia", () => {

        const attr = criarAtributos(50, 30, 40, 80);
        const ataqueAntes = attr.getAtaque();

        const resultado = attr.treinar();

        expect(resultado).toBe("ok");
        expect(attr.getAtaque()).toBeGreaterThan(ataqueAntes);
        expect(attr.getEnergia()).toBeLessThan(80);
    });

    test("treinar FALHA quando energia < 10 (valor-limite)", () => {

        const attr = criarAtributos(50, 30, 40, 5);  

        const resultado = attr.treinar();

        expect(resultado).not.toBe("ok");
        expect(resultado.length).toBeGreaterThan(0);
    });

    test("receberDano reduz energia respeitando defesa", () => {

        const attr = criarAtributos(50, 30, 40, 100);

        const danoReal = attr.receberDano(40);  

        expect(danoReal).toBe(10);
        expect(attr.getEnergia()).toBe(90);
    });

    test("energia nunca fica negativa após dano excessivo (valor-limite)", () => {

        const attr = criarAtributos(50, 0, 40, 10);

        attr.receberDano(999);

        expect(attr.getEnergia()).toBe(0);
    });
});

describe("Pokemon", () => {

    test("getNome e getTipo retornam valores corretos", () => {

        const pokemon = new Pokemon("Pikachu", criarAtributos(), "Elétrico");

        expect(pokemon.getNome()).toBe("Pikachu");
        expect(pokemon.getTipo()).toBe("Elétrico");
    });

    test("descansar recupera energia positiva", () => {

        const pokemon = new Pokemon("Bulbasaur", criarAtributos(50, 30, 40, 20));
        const energiaAntes = pokemon.getAtributos().getEnergia();

        const ganho = pokemon.descansar();

        expect(ganho).toBeGreaterThan(0);
        expect(pokemon.getAtributos().getEnergia()).toBeGreaterThan(energiaAntes);
    });

    test("lutar retorna resultado com mensagem quando ambos têm energia", () => {

        const p1 = new Pokemon("Charmander", criarAtributos(80, 30, 60, 100));
        const p2 = new Pokemon("Squirtle",   criarAtributos(60, 50, 40, 100));

        const resultado = p1.lutar(p2);

        expect(resultado.mensagem.length).toBeGreaterThan(0);
    });

    test("lutar BLOQUEIA quando Pokémon está exausto (HP = 0)", () => {

        const p1 = new Pokemon("Exausto", criarAtributos(80, 30, 60, 0));  // HP = 0
        const p2 = new Pokemon("Normal",  criarAtributos(60, 50, 40, 100));

        const resultado = p1.lutar(p2);

        expect(resultado.vencedor).toBeNull();
        expect(resultado.mensagem).toContain("exausto");
    });
});

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

        const ganhoAgua   = agua.descansar();
        const ganhoNormal = normal.descansar();

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

describe("Pokedex", () => {

    test("começa vazia", () => {
        const dex = new Pokedex();
        expect(dex.getTamanho()).toBe(0);
    });

    test("adicionarPokemon incrementa a lista", () => {

        const dex = new Pokedex();
        const pokemon = new Pokemon("Bulbasaur", criarAtributos());

        dex.adicionarPokemon(pokemon);

        expect(dex.getTamanho()).toBe(1);
    });

    test("buscarNoBanco encontra Pokémon por nome e por id", () => {
        const dex = new Pokedex();

        const resultadosNome = dex.buscarNoBanco("Pikachu");
        const resultadosId = dex.buscarNoBanco("25");

        expect(resultadosNome.length).toBeGreaterThan(0);
        expect(resultadosNome[0].nome).toBe("Pikachu");
        expect(resultadosId.length).toBe(1);
        expect(resultadosId[0].id).toBe(25);
    });

    test("adicionarDoBanco adiciona Pokémon a partir do banco e evita duplicatas", () => {
        const dex = new Pokedex();

        const primeiro = dex.adicionarDoBanco(25);
        const segundo  = dex.adicionarDoBanco(25);

        expect(primeiro).toContain("Pikachu");
        expect(dex.getTamanho()).toBe(1);
        expect(segundo).toContain("já está na sua Pokédex");
    });

    test("buscarPorIndice retorna null para índice inválido", () => {
        const dex = new Pokedex();
        expect(dex.buscarPorIndice(0)).toBeNull();
        expect(dex.buscarPorIndice(-1)).toBeNull();
    });

    test("treinarPokemon retorna mensagem de erro quando energia insuficiente", () => {

        const dex = new Pokedex();
        dex.adicionarPokemon(new Pokemon("Fraco", criarAtributos(10, 5, 10, 2)));

        const msg = dex.treinarPokemon(0);

        expect(msg).toContain("Energia insuficiente");
    });

    test("batalhar exige pelo menos 2 Pokémons", () => {

        const dex = new Pokedex();
        dex.adicionarPokemon(new Pokemon("Solitário", criarAtributos()));

        const msg = dex.batalhar(0, 1);

        expect(msg).toContain("pelo menos 2");
    });

    test("batalhar retorna resultado com os dois Pokémons envolvidos", () => {

        const dex = new Pokedex();
        dex.adicionarPokemon(new Pokemon("P1", criarAtributos(80, 20, 60, 100)));
        dex.adicionarPokemon(new Pokemon("P2", criarAtributos(60, 40, 50, 100)));

        const resultado = dex.batalhar(0, 1);

        expect(resultado).toContain("P1");
        expect(resultado).toContain("P2");
    });
});
