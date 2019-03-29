import { CardRef } from "@core/cards/card-ref";
import { GenderRequirement } from "@core/cards/player-setting";
import { PlayerInfo } from "@core/player-info";
import { SlideRegistration } from "../slide-registration";

export interface RandomUtils {
    selectRandomWeighted<T>(items: T[], getWeight: (item: T) => number): T | undefined;

    getRandom(): number;
}

export interface SelectionAlgorithm extends RandomUtils {
    /** select the next slide. Return undefined if no slide could be selected */
    selectNextSlide(availableSlides: SlideRegistration[]): string | undefined;

    selectCard(cardType: string): CardRef;

    selectPlayers(
        playerSettings: GenderRequirement[],
        definedPlayers: (PlayerInfo | null)[],
        tags: string[],
    ): PlayerInfo[];

    getSips(min: number): number;

    recomputeWillPower(memory: string[]): { willPower: number; memory: string[] };
}
