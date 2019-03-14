import { FactCard } from "../cards/fact-card";
import { FactCardParser } from "./fact-card-parser";

it("should deserialize card correctly", () => {
    const data = `
<FactCard id="1" is="false">
    <Text lang="de">Eine Kokusnuss ist ein Säugetier, weil ihr Haare wachsen und sie Milch produziert.</Text>
    <Text lang="en">A coconut is a mammal because it grows hair and produces milk.</Text>
</FactCard>
    `;

    const card = deserializeCard(data);
    expect(card).toEqual({
        content: [
            {
                translations: [
                    {
                        content:
                            "Eine Kokusnuss ist ein Säugetier, weil ihr Haare wachsen und sie Milch produziert.",
                        lang: "de",
                    },
                    {
                        content: "A coconut is a mammal because it grows hair and produces milk.",
                        lang: "en",
                    },
                ],
                weight: 1,
            },
        ],
        followUpPropability: 1,
        id: "1",
        isTrueFact: false,
        tags: [],
        type: "Fact",
    });
});

it("should assume a true fact if not hint is given", () => {
    const data = `
<FactCard id="1">
    <Text lang="de">Eine Kokusnuss ist ein Säugetier, weil ihr Haare wachsen und sie Milch produziert.</Text>
    <Text lang="en">A coconut is a mammal because it grows hair and produces milk.</Text>
</FactCard>
    `;

    const card = deserializeCard(data);
    expect(card).toEqual({
        content: [
            {
                translations: [
                    {
                        content:
                            "Eine Kokusnuss ist ein Säugetier, weil ihr Haare wachsen und sie Milch produziert.",
                        lang: "de",
                    },
                    {
                        content: "A coconut is a mammal because it grows hair and produces milk.",
                        lang: "en",
                    },
                ],
                weight: 1,
            },
        ],
        followUpPropability: 1,
        id: "1",
        isTrueFact: true,
        tags: [],
        type: "Fact",
    });
});

it("should correctly deserialize if the true hint is given", () => {
    const data = `
<FactCard id="1" is="true">
    <Text lang="de">Eine Kokusnuss ist ein Säugetier, weil ihr Haare wachsen und sie Milch produziert.</Text>
    <Text lang="en">A coconut is a mammal because it grows hair and produces milk.</Text>
</FactCard>
    `;

    const card = deserializeCard(data);
    expect(card).toEqual({
        content: [
            {
                translations: [
                    {
                        content:
                            "Eine Kokusnuss ist ein Säugetier, weil ihr Haare wachsen und sie Milch produziert.",
                        lang: "de",
                    },
                    {
                        content: "A coconut is a mammal because it grows hair and produces milk.",
                        lang: "en",
                    },
                ],
                weight: 1,
            },
        ],
        followUpPropability: 1,
        id: "1",
        isTrueFact: true,
        tags: [],
        type: "Fact",
    });
});

function deserializeCard(s: string): FactCard {
    const domParser = new DOMParser();
    const xml = domParser.parseFromString(s, "text/xml").documentElement;

    const parser = new FactCardParser();
    return parser.deserialize(xml) as FactCard;
}
