import { Card } from "@core/cards/card";
import { GameStatus } from "../game-status";
import { SlideRegistration } from "../slide-registration";
import { SelectionAlgorithm } from "./selection-algorithm";
import { selectRandomWeighted, selectRandomFromWeightedList, RNG } from "./utils";
import { Weighted } from "@core/weighted";
import { GenderRequirement } from "@core/cards/player-setting";
import { PlayerInfo } from "@core/player-info";

// tslint:disable-next-line: max-classes-per-file
export abstract class SelectionAlgorithmBase implements SelectionAlgorithm {
    protected readonly random: RNG;

    constructor(protected readonly status: GameStatus, random: RNG) {
        this.random = random;
    }

    public abstract selectPlayers(
        playerSettings: GenderRequirement[],
        definedPlayers: (PlayerInfo | null)[],
        tags: string[],
    ): PlayerInfo[];
    public abstract selectNextSlide(availableSlides: SlideRegistration[]): string | undefined;
    public abstract selectCard<TCard extends Card>(cardType: string): TCard;
    public abstract getSips(min: number): number;
    public abstract recomputeWillPower(memory: string[]): { willPower: number; memory: string[] };

    public getRandom(): number {
        return this.random();
    }

    public selectRandomWeighted<T>(items: T[], getWeight: (item: T) => number): T | undefined {
        return selectRandomWeighted(items, getWeight, () => this.random());
    }

    protected selectRandomFromWeightedList<T>(items: Weighted<T>[]): T | undefined {
        return selectRandomFromWeightedList(items, () => this.random());
    }
}
