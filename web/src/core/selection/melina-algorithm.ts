import { SelectionAlgorithmBase } from "./selection-algorithm-base";
import { SlideRegistration } from "../slide-registration";
import { Card } from "../cards/card";
import { CardDeck } from "../card-deck";
import { Weighted } from "../weighted";
import { PlayerSetting } from "../cards/player-setting";
import { PlayerInfo } from "../player-info";

export class MelinaAlgorithm extends SelectionAlgorithmBase {
    /** the percentage of cards that were played from one deck once the cards get weighted much lower */
    private readonly deckExhaustionLimit = 0.1;

    public selectCard<TCard extends Card>(): TCard {}

    public selectNextSlide(availableSlides: SlideRegistration[]): string {
        const uniqueCardTypes: string[] = [];
        for (const slide of availableSlides) {
            for (const cardType of slide.requestedCards) {
                if (uniqueCardTypes.findIndex(x => x === cardType) === -1) {
                    uniqueCardTypes.push(cardType);
                }
            }
        }

        for (const cardType of uniqueCardTypes) {
            const weightedCards = this.weightCards(this.status.decks, cardType);
            
        }

        const weightedSlides: Array<Weighted<SlideRegistration>> = [];
        const cardTypeRatings: {[type: string]: number} = {};

        for (const slide of availableSlides) {
            const slideSettings = this.status.slides.find(x => x.value === slide.slideType);
            if (slideSettings === undefined || slideSettings.weight === 0) {
                continue;
            }


        }

        // TODO: check if cards are available for the slides
        const selected = this.selectRandomWeighted(this.status.slides, slide => slide.weight);
        if (selected === undefined) {
            return this.status.slides[0].slideType;
        }

        return selected.slideType;
    }

    protected rateCards(cards: Array<Weighted<Card>>) {

    }

    protected weightCards(
        decks: CardDeck[],
        type: string,
    ): Array<{ cards: Array<Weighted<Card>>; deck: CardDeck }> {
        const filtered: CardDeck[] = decks.map(x => ({
            cards: x.cards.filter(card => {
                if (card.type !== type) {
                    return false;
                }

                return (
                    card.tags.length > 0 &&
                    card.tags.findIndex(x => {
                        const weightedTag = this.status.tags.find(y => y.value === x);
                        return weightedTag !== undefined && weightedTag.weight === 0;
                    }) === -1
                );
            }),
            url: x.url,
            weight: x.weight,
        }));

        // cards are now of the correct type and playable

        const totalCards = filtered.reduce((x, y) => x + y.cards.length, 0);

        // every card should be rated by x when 0 < x <= 1
        const result: Array<{ cards: Array<Weighted<Card>>; deck: CardDeck }> = [];

        const willPower = this.getWillPower();

        for (const deck of filtered) {
            // cards from this deck that were already played
            const cardsPlayed = this.status.history.filter(
                x => deck.cards.findIndex(y => y.id === x) > -1,
            );

            // get how many cards we have for every will power value
            const willPowerDistributions: Array<{
                willPower: number | undefined;
                count: number;
            }> = [];

            for (const card of deck.cards) {
                const distribution = willPowerDistributions.findIndex(
                    x => x.willPower === card.willPower,
                );
                if (distribution > -1) {
                    willPowerDistributions[distribution].count++;
                } else {
                    willPowerDistributions.push({ willPower: card.willPower, count: 1 });
                }
            }

            // compute the deck exhaustion factor
            let exhaustionFactor: number;

            const percentage = cardsPlayed.length / deck.cards.length;
            if (percentage > this.deckExhaustionLimit) {
                // cubic reduction
                exhaustionFactor = Math.pow(1.1 - percentage, 2) * 0.5;
            } else {
                exhaustionFactor = 1;
            }

            const weightedCards: Array<Weighted<Card>> = [];
            for (const card of deck.cards) {
                const willPowerDistribution = willPowerDistributions.find(
                    x => x.willPower === card.willPower,
                )!;

                const distributionFactor = willPowerDistribution.count / deck.cards.length;
                const willPowerRating = this.rateWillPower(card.willPower, willPower);
                const historyFactor = this.getHistoryFactor(
                    card.id,
                    this.status.history,
                    totalCards,
                );
                const tagsFactor = this.getTagsFactor(card.tags, this.status.tags);

                weightedCards.push({
                    value: card,
                    weight:
                        exhaustionFactor *
                        // distributionFactor *
                        willPowerRating *
                        historyFactor *
                        tagsFactor,
                });
            }

            result.push({deck, cards: weightedCards});
        }

        return result;
    }

    protected getWillPower(): number {
        return 4;
    }

    protected getTagsFactor(tags: string[], tagWeights: Array<Weighted<string>>) {
        const weights = tags
            .map(x => tagWeights.find(y => y.value === x))
            .filter(x => x !== undefined)
            .map(x => x!.weight);
        if (weights.length > 0) {
            return Math.min(...weights);
        }
        return 0.5;
    }

    /** return a value between 0 and 1 that returns 1 if the card was never played and a smaller number if the card was played recently */
    protected getHistoryFactor(id: string, history: string[], totalCards: number) {
        const historyPosition = history.findIndex(x => x === id);
        if (historyPosition === -1) {
            return 1;
        }

        return historyPosition / totalCards;
    }

    /** return a value between 0 and 1 for the given will power */
    protected rateWillPower(cardWillPower: number | undefined, willPower: number) {
        if (cardWillPower === undefined) {
            return 0.75;
        }

        // --- --- --- ||| --- --- --- ---
        // 0.5 .75 .75  1  .25 .15 .05 .05

        if (cardWillPower === willPower) {
            return 1;
        }

        if (cardWillPower > willPower) {
            const result = 0.35 - (cardWillPower - willPower) * 0.1;
            return result < 0 ? 0.5 : result;
        }

        return 0.5;
    }

    protected filterDecks(decks: CardDeck[]): CardDeck[] {
        const filteredDecks: CardDeck[] = [];

        for (const deck of decks) {
            // remove disabled decks
            if (deck.weight <= 0) {
                continue;
            }

            const cards: Card[] = [];
            for (const card of deck.cards) {
                if (!this.verifyPlayerSpecification(this.status.players, card.players)) {
                    continue;
                }

                let weightedZero = false;
                for (const tag of card.tags) {
                    if (this.checkIfWeightedZero(tag, this.status.tags)) {
                        weightedZero = true;
                        break;
                    }
                }

                if (weightedZero) {
                    continue;
                }

                if (!card.condition(this.status)) {
                    continue;
                }

                cards.push(card);
            }

            if (cards.length > 0) {
                filteredDecks.push({ cards, weight: deck.weight, url: deck.url });
            }
        }

        return filteredDecks;
    }

    protected checkIfWeightedZero<T>(value: T, weights: Array<Weighted<T>>): boolean {
        return weights.findIndex(x => x.value === value && x.weight <= 0) > -1;
    }

    protected verifyPlayerSpecification(
        players: PlayerInfo[],
        specification: PlayerSetting[],
    ): boolean {
        if (specification.length > players.length) {
            return false;
        }

        const specificationMales = specification.filter(x => x.gender === "Male").length;
        const actualMales = players.filter(x => x.gender === "Male").length;

        if (specificationMales > actualMales) {
            return false;
        }

        const specificationFemales = specification.filter(x => x.gender === "Female").length;
        const actualFemales = players.filter(x => x.gender === "Female").length;
        if (specificationFemales > actualFemales) {
            return false;
        }

        const specificationOpposite = specification.filter(x => x.gender === "Opposite").length;
        if (specificationOpposite > Math.min(actualFemales, actualMales)) {
            return false;
        }

        const specificationSame = specification.filter(x => x.gender === "Same").length;
        if (specificationSame > Math.min(actualFemales, actualMales)) {
            return false;
        }

        return true;
    }
}
