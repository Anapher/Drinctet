import { Card } from "../cards/card";

/** defines a parser that can deserialize an XML element to a card  */
export interface CardParser {
    deserialize(xml: Element) : Card;
}