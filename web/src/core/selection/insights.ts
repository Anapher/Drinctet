import { Weighted } from "@core/weighted";
import { CardDeck } from "@core/card-deck";

export class Insights {
    public playerSelection: PlayerSelectionInsights | null = null;
    public slideWeights: SlideSelectionInsights | null  = null;
}

export interface PlayerSelectionInsights {
    predefined: string[];
    rounds: Array<PlayerSelection[]>;
}

export interface SlideSelectionInsights {
    weights: Weighted<string>[];
}

export interface PlayerSelection {
    chosen: boolean;
    weight: number;
    playerId: string;
}

export interface CardsInsight {
    decks: Weighted<CardDeck>[];
    willPower: Weighted<{willPower: number | null, count: number}>[];
    totalCards: number;
}
