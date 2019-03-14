import { CardParser } from "../core/parsing/card-parser";
import { CardParserFactory } from "../core/parsing/card-parser-factory";
import { FactCardParser } from "./parsing/fact-card-parser";

export class DefaultCardParserFactory implements CardParserFactory {
    private parsers: { [type: string]: new () => CardParser };

    constructor() {
        this.parsers = {
            FactCard: FactCardParser,
        };
    }

    public createParser(cardType: string): CardParser | undefined {
        if (cardType in this.parsers) {
            return new this.parsers[cardType];
        }

        return undefined;
    }
}
