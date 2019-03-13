import { BaseCardParser } from "./base-card-parser";
import { BaseCard } from "../cards/base-card";

class TestCard extends BaseCard {
    public type = "FactCard";
}

class BasicBaseCardParser extends BaseCardParser<TestCard> {
    constructor(private defaultTags: string[]) {
        super();
    }

    protected createCard(): TestCard {
        return new TestCard();
    }

    protected parseAttributes(rootXml: Element, card: TestCard) {}
    protected parseElement(element: Element, card: TestCard) {}

    protected getDefaultAttributes() {
        return this.defaultTags;
    }
}

it("should deserialize all attributes", () => {
    const data = `
<Root>
<FactCard id="9h348h" willPower="4" tags="nice,wow">
</FactCard>
</Root>`;

    const parser = new DOMParser();
    let element = parser
        .parseFromString(data, "text/xml")
        .getElementsByTagName("FactCard")[0];

    let cardParser = new BasicBaseCardParser([]);
    const card = cardParser.deserialize(element);

    expect(card.id).toBe("9h348h");
    expect(card.willPower).toBe(4);
    expect(card.tags).toEqual(["nice", "wow"]);
});

it("should deserialize minimal attributes", () => {
    const data = `
<Root>
<FactCard id="9h348h">
</FactCard>
</Root>`;

    const parser = new DOMParser();
    const element = parser
        .parseFromString(data, "text/xml")
        .getElementsByTagName("FactCard")[0];

    const cardParser = new BasicBaseCardParser(["fun"]);
    const card = cardParser.deserialize(element);

    expect(card.id).toBe("9h348h");
    expect(card.willPower).toBeUndefined();
    expect(card.tags).toEqual(["fun"]);
});

it("should deserialize zero will power to undefined", () => {
    const data = `
<Root>
<FactCard id="1" willPower="0">
</FactCard>
</Root>`;

    const parser = new DOMParser();
    const element = parser
        .parseFromString(data, "text/xml")
        .getElementsByTagName("FactCard")[0];

    const cardParser = new BasicBaseCardParser([]);
    const card = cardParser.deserialize(element);

    expect(card.willPower).toBeUndefined();
});

it("should parse player", () => {
    const data = `
<Root>
<FactCard id="1">
    <FactCard.players>
        <Player gender="m" />
    </FactCard.players>
</FactCard>
</Root>`;

    const parser = new DOMParser();
    const element = parser
        .parseFromString(data, "text/xml")
        .getElementsByTagName("FactCard")[0];

    const cardParser = new BasicBaseCardParser([]);
    const card = cardParser.deserialize(element);
    
    expect(card.players).toHaveLength(1);
    expect(card.players[0]).toEqual({playerIndex: 1, gender: "Male"});
});

it("should parse players", () => {
    const data = `
<Root>
<FactCard id="1">
    <FactCard.players>
        <Player1 gender="m" />
        <Player2 gender="f" />
    </FactCard.players>
</FactCard>
</Root>`;

    const parser = new DOMParser();
    const element = parser
        .parseFromString(data, "text/xml")
        .getElementsByTagName("FactCard")[0];

    const cardParser = new BasicBaseCardParser([]);
    const card = cardParser.deserialize(element);
    
    expect(card.players).toHaveLength(2);

    expect(card.players[0]).toEqual({playerIndex: 1, gender: "Male"});
    expect(card.players[1]).toEqual({playerIndex: 2, gender: "Female"});
});
