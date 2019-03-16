import { TextCard } from "../cards/text-card";
import { TextCardParser } from "./text-card-parser";

class TestCard extends TextCard {
    public readonly type = "TestCard";
}

class TestCardParser extends TextCardParser<TestCard> {
    protected createCard(): TestCard {
        return new TestCard();
    }
}

it("Should correctly parse a text card", () => {
    const data = `
    <TestCard id="1">
        <Text lang="de">Hallo Welt</Text>
    </TestCard>`;

    const domParser = new DOMParser();
    const element = domParser.parseFromString(data, "text/xml");

    const parser = new TestCardParser();
    const card = parser.deserialize(element.getElementsByTagName("TestCard")[0]);

    expect(card).toMatchObject({
        content: [
            {
                translations: [
                    {
                        content: "Hallo Welt",
                        lang: "de",
                    },
                ],
                weight: 1,
            },
        ],
        id: "1",
    });
});
