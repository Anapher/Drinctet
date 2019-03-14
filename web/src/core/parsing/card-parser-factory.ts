import { CardParser } from "./card-parser";

/** a factory that creates the right parser for a card type */
export interface CardParserFactory {
    createParser(cardType: string) : CardParser | undefined;
}