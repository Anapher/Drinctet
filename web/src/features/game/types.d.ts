declare module "GameModels" {
    export interface CardIdentifier {
        id: string;
        sourceUrl: string;
    }
    
    export interface SelectedPlayer {
        index: number;
        player: import("@core/player-info").PlayerInfo;
    }

    export interface FollowUpSlide {
        slideType: string;
        selectedCard: import("@core/cards/card").Card | null;
        selectedPlayers: SelectedPlayer[];
        due: Date;
        id: string;
        param: any;
    }
}
