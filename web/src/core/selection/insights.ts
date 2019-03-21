import { Weighted } from "@core/weighted";

export class Insights {
    public playerSelection: PlayerSelectionInsights | null = null;
}

export interface PlayerSelectionInsights {
    predefined: string[];
    rounds: Array<Weighted<string>[]>;
}


