import { CardDeck } from "./card-deck";
import { PlayerInfo } from "./player-info";
import { Weighted } from "./weighted";
import { PlayerArrangement } from "./player-arrangement";
import { CardRef } from "./cards/card-ref";

export interface GameStatus {
    language: string;
    players: PlayerInfo[];
    willPower: number;
    slides: Array<Weighted<string>>;
    tags: Array<Weighted<string>>;
    cardsHistory: CardRef[];
    slidesHistory: string[];
    decks: CardDeck[];
    startTime: Date;
    preferOppositeGenders: boolean;
    arrangements: PlayerArrangement[];
}
