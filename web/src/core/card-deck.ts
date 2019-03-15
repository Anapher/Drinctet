import { Card } from "./cards/card";

export interface CardDeck {
    cards: Card[];
    weight: number;
    url: string;
}
