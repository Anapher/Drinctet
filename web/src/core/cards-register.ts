import { CardsSource } from "./cards-source";
import { Card } from "./cards/card";
import { CardParserFactory } from "./parsing/card-parser-factory";

export class CardsRegister {
  private readonly cards: { cards: Card[]; source: CardsSource }[];

  constructor(private parserFactory: CardParserFactory) {
    this.cards = [];
  }

  addSource(source: CardsSource) {
    const xml = source.getCardsXml();
    const cards = this.parseCards(xml);

    this.cards.push({ cards, source });
  }

  parseCards(xml: string): Card[] {
    const result: Card[] = [];

    const domParser = new DOMParser();
    const xmlDoc = domParser.parseFromString(
      "<Root>" + xml + "</Root>",
      "text/xml",
    );

    const cardElements = xmlDoc.getElementsByTagName("*");
    for (let i = 0; i < cardElements.length; i++) {
      const xmlElement = cardElements[i];

      if (xmlElement.parentElement === xmlDoc.documentElement) {
        const parser = this.parserFactory.createParser(xmlElement.nodeName);
        if (parser === undefined) {
          console.error(
            `The card ${
              xmlElement.nodeName
            } could not be parsed. No parser found.`,
          );
          continue;
        }

        const card = parser.deserialize(xmlElement);
        result.push(card);
      }
    }

    return result;
  }
}
