import { Card } from "../core/cards/card";
import { CardsLoader } from "./cards-loader";
import { PlayerSetting } from "./cards/player-setting";

class DummyCard implements Card {
    constructor(public id: string) {}
    
    public willPower: number;
    public type: string;
    public players: PlayerSetting[];
    public tags: string[];
    public condition: (status: GameStatus) => true;
}

let loader: CardsLoader;
let sources: { [url: string]: string };

beforeEach(() => {
    const dummyParserFactory = {
        createParser(t: string) {
            return {
                deserialize(xml: Element) {
                    return new DummyCard(xml.getAttribute("id")!);
                },
            };
        },
    };

    loader = new CardsLoader(url => Promise.resolve(sources[url]), dummyParserFactory);
});

it("should load a simple file", async () => {
    sources = {
        "local://nice-cards": '<Card id="2"></Card>',
    };

    const cards = await loader.loadFromUrl("local://nice-cards");
    expect(cards).toHaveLength(1);
    expect(cards[0].id).toBe("2");
});

it("should resolve references", async () => {
    sources = {
        "local://nice-cards": '<DeckReference url="local://even-nicer-cards" />',
        "local://even-nicer-cards": '<Card id="asdf"></Card>',
    };

    const cards = await loader.loadFromUrl("local://nice-cards");
    expect(cards).toHaveLength(1);
    expect(cards[0].id).toBe("asdf");
});

it("should mix cards from root with cards from references", async () => {
    sources = {
        "local://nice-cards": '<DeckReference url="local://even-nicer-cards" /><Card id="12" />',
        "local://even-nicer-cards": '<Card id="asdf"></Card>',
    };

    const cards = await loader.loadFromUrl("local://nice-cards");
    expect(cards).toHaveLength(2);
    expect(cards[0].id).toBe("asdf");
    expect(cards[1].id).toBe("12");
});

it("should resolve references recursivly", async () => {
    sources = {
        "local://nice-cards": '<DeckReference url="local://even-nicer-cards" /><Card id="12" />',
        "local://even-nicer-cards":
            '<Card id="asdf"></Card><DeckReference url="local://not-so-great-cards" />',
        "local://not-so-great-cards": '<Card id="wtf" />',
    };

    const cards = await loader.loadFromUrl("local://nice-cards");
    expect(cards).toHaveLength(3);
    expect(cards[0].id).toBe("asdf");
    expect(cards[1].id).toBe("wtf");
    expect(cards[2].id).toBe("12");
});

it("should filter cards", async () => {
    sources = {
        "local://collection": `
            <DeckReference url="local://huge-deck">
                <CardRef id="3" />
                <CardRef id="7" />
                <CardRef id="3242" />
            </DeckReference>
        `,
        "local://huge-deck": `
            <Card id="1" />
            <Card id="asd" />
            <Card id="3" />
            <Card id="6" />
            <Card id="5" />
            <Card id="7" />
            <Card id="hello" />
        `,
    };

    const cards = await loader.loadFromUrl("local://collection");
    expect(cards).toHaveLength(2);
    expect(cards[0].id).toBe("3");
    expect(cards[1].id).toBe("7");
});

it("should correctly pass filters", async () => {
    sources = {
        "local://collection": `
            <DeckReference url="local://huge-deck">
                <CardRef id="3" />
                <CardRef id="7" />
                <CardRef id="3242" />
            </DeckReference>
        `,
        "local://huge-deck": `
            <Card id="1" />
            <Card id="asd" />
            <Card id="3" />
            <DeckReference url="local://another-huge-deck" />
        `,
        "local://another-huge-deck": `
            <Card id="6" />
            <Card id="5" />
            <Card id="7" />
            <Card id="hello" />
        `,
    };

    const cards = await loader.loadFromUrl("local://collection");
    expect(cards).toHaveLength(2);
    expect(cards[0].id).toBe("3");
    expect(cards[1].id).toBe("7");
});

it("should correctly aggregate recursive filters", async () => {
    sources = {
        "local://collection": `
            <DeckReference url="local://huge-deck">
                <CardRef id="3" />
                <CardRef id="7" />
                <CardRef id="11" />
                <CardRef id="3242" />
            </DeckReference>
        `,
        "local://huge-deck": `
            <Card id="1" />
            <Card id="asd" />
            <Card id="3" />
            <DeckReference url="local://another-huge-deck">
                <CardRef id="7" />
                <CardRef id="8" />
            </DeckReference>
        `,
        "local://another-huge-deck": `
            <Card id="6" />
            <Card id="5" />
            <Card id="7" />
            <Card id="hello" />
            <Card id="11" />
        `,
    };

    const cards = await loader.loadFromUrl("local://collection");
    expect(cards).toHaveLength(2);
    expect(cards[0].id).toBe("3");
    expect(cards[1].id).toBe("7");
});
