import { Card } from "../cards/card";
import { GameStatus } from "../game-status";
import { SlideRegistration } from "../slide-registration";
import { SelectionAlgorithm } from "./selection-algorithm";

// tslint:disable-next-line: max-classes-per-file
export abstract class SelectionAlgorithmBase implements SelectionAlgorithm {
    constructor(protected readonly status: GameStatus) {
    }

    public abstract selectNextSlide(availableSlides: SlideRegistration[]): string | undefined;
    public abstract selectCard<TCard extends Card>(cardType: string): TCard;

    public selectRandomWeighted<T>(items: T[], getWeight: (item: T) => number): T | undefined {
        if (items.length === 0) {
            return undefined;
        }

        const weights: Array<{ item: T; weight: number }> = [];
        let totalWeight: number = 0;
        for (const item of items) {
            const weight = getWeight(item);
            weights.push({ item, weight });

            totalWeight += weight;
        }

        let randomWeight = totalWeight * Math.random();
        for (const { item, weight } of weights) {
            randomWeight -= weight;

            if (randomWeight <= 0) {
                return item;
            }
        }

        throw new Error("No choice could be made");
    }
}
