import { Card } from "../cards/card";
import { GameStatus } from "../game-status";
import { SlideRegistration } from "../slide-registration";
import { SelectionAlgorithm } from "./selection-algorithm";

// tslint:disable-next-line: max-classes-per-file
export abstract class SelectionAlgorithmBase implements SelectionAlgorithm {
    public readonly cardDictionary: CardDictionary;

    constructor(protected readonly status: GameStatus) {
        this.cardDictionary = this.compileCardDictionary(status.decks);
    }

    public abstract selectNextSlide(availableSlides: SlideRegistration[]): string;
    public abstract selectCard<TCard extends Card>(): TCard;

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

    private compileCardDictionary(decks: CardDeck[]): CardDictionary {
        const result: CardDictionary = {};
        const deckInfos: CardDeckInfo[] = [];

        for (const deck of decks) {
            const deckInfo = new CardDeckInfo(deck);

            for (const card of deck.cards) {
                if (!(card.id in result)) {
                    result[card.id] = {card, deck: deckInfo};
                    deckInfo.actualCards++;
                }
            }

            deckInfos.push(deckInfo);
        }

        return result;
    }
}
