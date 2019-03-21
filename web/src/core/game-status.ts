import { CardDeck } from "./card-deck";
import { PlayerInfo } from "./player-info";
import { Weighted } from "./weighted";
import { PlayerArrangement } from "./player-arrangement";

export interface GameStatus {
    language: string;
    players: PlayerInfo[];
    willPower: number;
    slides: Array<Weighted<string>>;
    tags: Array<Weighted<string>>;
    cardsHistory: string[];
    slidesHistory: string[];
    decks: CardDeck[];
    startTime: Date;
    preferOppositeGenders: boolean;
    arrangements: PlayerArrangement[];
}
