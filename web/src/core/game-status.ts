import { CardDeck } from "./card-deck";
import { PlayerInfo } from "./player-info";
import { Weighted } from "./weighted";
import { PlayerArrangement } from "./player-arrangement";

export interface GameStatus {
    language: string;
    players: PlayerInfo[];
    slides: Array<Weighted<string>>;
    tags: Array<Weighted<string>>;
    history: string[];
    decks: CardDeck[];
    preferOppositeGenders: boolean;
    arrangements: PlayerArrangement[];
}
