import { CardDeck } from "../card-deck";
import { Card } from "../cards/card";
import { GenderRequirement, PlayerSetting } from "../cards/player-setting";
import { PlayerInfo, Gender } from "../player-info";
import { SlideRegistration } from "../slide-registration";
import { Weighted } from "../weighted";
import { SelectionAlgorithmBase } from "./selection-algorithm-base";
import _ from "underscore";
import { higherArrangementPropabilityTags } from "../../preferences";

export class MelinaAlgorithm extends SelectionAlgorithmBase {
    /** the percentage of cards that were played from one deck once the cards get weighted much lower */
    private readonly deckExhaustionLimit = 0.1;

    public selectPlayers(playerSettings: GenderRequirement[], card: Card): PlayerInfo[] {
        if (playerSettings.length === 0) {
            return [];
        }

        if (playerSettings.length > this.status.players.length) {
            throw new Error("More players were requested than available.");
        }

        const result: (PlayerInfo | null)[] = playerSettings.map(_ => null);
        let resultCounter = 0;
        const forArrangement = new Array<string>();

        while (result.findIndex(x => x === null) !== -1) {
            for (let i = 0; i < playerSettings.length; i++) {
                if (result[i] !== null) {
                    continue;
                }

                const gender = playerSettings[i];
                let sourceList: PlayerInfo[];

                switch (gender) {
                    case "None":
                        sourceList = this.status.players;
                        break;
                    case "Male":
                        sourceList = this.status.players.filter(x => x.gender === "Male");
                        break;
                    case "Female":
                        sourceList = this.status.players.filter(x => x.gender === "Female");
                        break;
                    default:
                        continue;
                }

                const source = sourceList.filter(x => !_.contains(result, x));
                const malesCount = result.filter(x => x !== null && x.gender === "Male").length;
                const femalesCount = result.filter(x => x !== null && x.gender === "Female").length;

                const player = this.selectRandomWeighted(source, p => {
                    let weight = 1;

                    if (_.any(forArrangement, x => x === p.id)) {
                        if (
                            _.any(higherArrangementPropabilityTags, x =>
                                _.any(card.tags, y => x === y.toLowerCase()),
                            )
                        ) {
                            weight += source.length;
                        } else {
                            // everyone has ~ the weight 1
                            weight += source.length * 0.5;
                        }
                    }

                    if (gender === "None" && this.status.preferOppositeGenders) {
                        if (malesCount > femalesCount) {
                            if (p.gender === "Female") {
                                weight += 0.5;
                            }
                        } else if (femalesCount > malesCount) {
                            if (p.gender === "Male") {
                                weight += 0.5;
                            }
                        }
                    }

                    return weight;
                })!;

                result[i] = player;
                resultCounter++;

                const arrangement = this.status.arrangements.find(
                    x => x.p1 === player.id || x.p2 === player.id,
                );
                if (arrangement !== undefined) {
                    if (arrangement.p1 === player.id) {
                        forArrangement.push(arrangement.p2);
                    } else {
                        forArrangement.push(arrangement.p1);
                    }
                }
            }

            if (resultCounter === result.length) {
                break;
            }

            // here we have to handle Same/Opposite genders

            const malesCount = result.filter(x => x !== null && x.gender === "Male").length;
            const femalesCount = result.filter(x => x !== null && x.gender === "Female").length;
            let dominant: Gender | null = null;

            if (malesCount > femalesCount) dominant = "Male";
            else if (femalesCount > malesCount) dominant = "Female";

            if (dominant === null) {
                // we try to change a 'Same' gender, so Same and opposite stay on different sites
                // because the player gender will become dominant and opposite is always against dominant

                let changed = false;
                for (let i = 0; i < playerSettings.length; i++) {
                    if (playerSettings[i] === "Same") {
                        playerSettings[i] = "None";
                        changed = true;
                        break;
                    }
                }

                if (!changed) {
                    // we have the problem here that we only have opposite genders left but we have no dominant gender.
                    // We change the first opposite to none (so it gets filled) and all other to Same, so they will get
                    // the same gender like the first item that was changed to Same

                    for (let i = 0; i < playerSettings.length; i++) {
                        if (playerSettings[i] === "Opposite") {
                            if (!changed) {
                                playerSettings[i] = "None";
                                changed = true;
                            } else {
                                playerSettings[i] = "Same";
                            }
                            break;
                        }
                    }
                }

                continue;
            }

            for (let i = 0; i < playerSettings.length; i++) {
                const gender = playerSettings[i];

                switch (gender) {
                    case "Opposite":
                        if (dominant === "Female") {
                            playerSettings[i] = "Male";
                        } else {
                            playerSettings[i] = "Female";
                        }
                        break;
                    case "Same":
                        if (dominant === "Female") {
                            playerSettings[i] = "Female";
                        } else {
                            playerSettings[i] = "Male";
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        return result.map(x => x!);
    }

    public selectCard<TCard extends Card>(cardType: string): TCard {
        const weightedDecks = this.weightCards(this.status.decks, cardType);
        const weightedCards: Array<Weighted<Card>> = [];

        for (const deck of weightedDecks) {
            weightedCards.push(
                ...deck.cards.map(x => ({ value: x.value, weight: x.weight * deck.deck.weight })),
            );
        }

        const selected = this.selectRandomFromWeightedList(weightedCards);
        if (selected === undefined) {
            throw new Error("That should not actually happen");
        }

        return selected as TCard;
    }

    public selectNextSlide(availableSlides: SlideRegistration[]): string | undefined {
        const uniqueCardTypes: string[] = [];
        for (const slide of availableSlides) {
            for (const cardType of slide.requestedCards) {
                if (uniqueCardTypes.findIndex(x => x === cardType) === -1) {
                    uniqueCardTypes.push(cardType);
                }
            }
        }

        const cardTypeRatings: { [type: string]: number } = {};
        for (const cardType of uniqueCardTypes) {
            const weightedDecks = this.weightCards(this.status.decks, cardType);

            const allCards: Array<Weighted<Card>> = [];
            for (const cardDeck of weightedDecks) {
                allCards.push(...cardDeck.cards);
            }

            if (allCards.length === 0) {
                cardTypeRatings[cardType] = 0;
            } else {
                // relation ideal cards (1) to all cards
                cardTypeRatings[cardType] =
                    (allCards.filter(x => x.weight === 1).length + 1) / allCards.length;
            }
        }

        const weightedSlides: Array<Weighted<SlideRegistration>> = [];
        for (const slide of availableSlides) {
            const slideSettings = this.status.slides.find(x => x.value === slide.slideType);

            if (slideSettings === undefined || slideSettings.weight === 0) {
                continue;
            }

            let factor = 1;
            for (const cardType of slide.requestedCards) {
                factor = Math.min(cardTypeRatings[cardType], factor);
            }

            weightedSlides.push({ weight: factor * slideSettings.weight, value: slide });
        }

        const selected = this.selectRandomWeighted(weightedSlides, slide => slide.weight);
        if (selected === undefined) {
            return undefined;
        }

        return selected.value.slideType;
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
                    card.tags.length === 0 ||
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
                const willPowerRating = this.rateWillPower(card.willPower, willPower);
                const historyFactor = this.getHistoryFactor(
                    card.id,
                    this.status.history,
                    totalCards,
                );
                const tagsFactor = this.getTagsFactor(card.tags, this.status.tags);

                weightedCards.push({
                    value: card,
                    weight: exhaustionFactor * willPowerRating * historyFactor * tagsFactor,
                });
            }

            result.push({ deck, cards: weightedCards });
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
        if (specificationSame + 1 > Math.max(actualFemales, actualMales)) {
            return false;
        }

        return true;
    }
}
