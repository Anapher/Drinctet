import { Card } from "./cards/card";
import { CardParserFactory } from "./parsing/card-parser-factory";

export class CardsLoader {
    private readonly domParser = new DOMParser();

    constructor(
        private requestFile: (url: string) => Promise<string>,
        private parserFactory: CardParserFactory,
    ) {}

    public async loadFromUrl(url: string): Promise<Card[]> {
        const result: Card[] = [];

        await this.loadFile(url, result, undefined);
        return result;
    }

    private async loadFile(url: string, result: Card[], requestedCards?: string[]): Promise<void> {
        const xml = await this.requestFile(url);
        
        // the DOMParser doesn't like XML docs without a Root element
        const xmlDoc = this.domParser.parseFromString("<Root>" + xml + "</Root>", "text/xml");

        const cardElements = xmlDoc.getElementsByTagName("*");
        for (let i = 0; i < cardElements.length; i++) {
            const xmlElement = cardElements[i];

            if (xmlElement.parentElement !== xmlDoc.documentElement) {
                continue;
            }

            if (xmlElement.nodeName === "DeckReference") {
                await this.parseDeckReference(xmlElement, result, requestedCards);
                continue;
            }

            const parser = this.parserFactory.createParser(xmlElement.nodeName);
            if (parser === undefined) {
                console.error(
                    `The card ${xmlElement.nodeName} could not be parsed. No parser found.`,
                );
                continue;
            }

            const card = parser.deserialize(xmlElement);
            if (requestedCards !== undefined && requestedCards.indexOf(card.id) === -1) {
                continue;
            }

            result.push(card);
        }
    }

    private parseDeckReference(
        xmlElement: Element,
        result: Card[],
        requestedCards?: string[],
    ): Promise<void> {
        const url = xmlElement.getAttribute("url");
        if (url === null) {
            throw new Error("The url on a deck reference must not be null.");
        }

        const referenceRequests: string[] = [];

        const cardRefs = xmlElement.getElementsByTagName("CardRef");
        for (let i = 0; i < cardRefs.length; i++) {
            const cardRef = cardRefs[i];

            const idAttr = cardRef.getAttribute("id");
            if (idAttr === null) {
                continue;
            }

            referenceRequests.push(idAttr);
        }

        let deckWhitelist: string[] | undefined;
        if (referenceRequests.length === 0) {
            deckWhitelist = requestedCards;
        } else {
            if (requestedCards !== undefined) {
                deckWhitelist = [];

                // only request cards that are in the superior list aswell as in the reference list
                for (const cardId of requestedCards) {
                    if (referenceRequests.indexOf(cardId) > -1) {
                        deckWhitelist.push(cardId);
                    }
                }
            } else {
                deckWhitelist = referenceRequests;
            }
        }

        return this.loadFile(url, result, deckWhitelist);
    }
}
