import { Card } from "@core/cards/card";
import { SlideRegistration } from "../slide-registration";
import { GenderRequirement } from "@core/cards/player-setting";
import { PlayerInfo } from "@core/player-info";

export interface SelectionAlgorithm {
    /** select the next slide. Return undefined if no slide could be selected */
    selectNextSlide(availableSlides: SlideRegistration[]): string | undefined;

    selectCard<TCard extends Card>(cardType: string): TCard;

    selectPlayers(playerSettings: GenderRequirement[], definedPlayers: (PlayerInfo | null)[], card: Card): PlayerInfo[];

    getSips(min: number): number;

    selectRandomWeighted<T>(items: T[], getWeight: (item: T) => number): T | undefined;

    getRandom(): number;
}
