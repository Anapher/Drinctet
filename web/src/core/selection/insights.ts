import { Weighted } from "@core/weighted";
import { CardDeck } from "@core/card-deck";

export class Insights {
    public playerSelection: PlayerSelectionInsights | null = null;
}

export interface PlayerSelectionInsights {
    predefined: string[];
    rounds: Array<PlayerSelection[]>;
}

export interface PlayerSelection {
    chosen: boolean;
    weight: number;
    playerId: string;
}

export interface CardsInsight {
    decks: Weighted<CardDeck>[];
    willPower: Weighted<number | null>[];
}
