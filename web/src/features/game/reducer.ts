import { PlayerInfo } from "../../core/player-info";

export type GameState = Readonly<{
    isStarted: boolean;

    selectedSlide: string;
    selectedCard: string;
    selectedPlayers: PlayerInfo[];

    currentWillPower: number;
    isWillPowerLocked: boolean;

    startTime: string;

    slidesHistory: string[];
    cardsHistory: string[];
}>;
