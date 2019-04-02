import { CardRef } from "@core/cards/card-ref";
import _ from "lodash";
import { higherArrangementPropabilityTags } from "../../preferences";
import { CardDeck } from "../card-deck";
import { Card } from "../cards/card";
import { GenderRequirement, PlayerSetting } from "../cards/player-setting";
import { Gender, PlayerInfo } from "../player-info";
import { SlideRegistration } from "../slide-registration";
import { Weighted } from "../weighted";
import { CardsInsight, Insights, PlayerSelection, PlayerSelectionInsights } from "./insights";
import { SelectionAlgorithmBase } from "./selection-algorithm-base";

export class MelinaAlgorithm extends SelectionAlgorithmBase {
    /** the percentage of cards that were played from one deck once the cards get weighted much lower */
    private readonly deckExhaustionLimit = 0.1;

    public readonly insights: Insights = new Insights();

    public getAllCardDeckStatistics(cardType: string | null = null): CardsInsight {
        const weightedDecks = this.weightCards(this.status.decks, cardType);
        const deckWeights: { [deckUrl: string]: number } = {};
        const willPowerWeights: { [willPower: number]: number } = {};
        const willPowerCounter: { [willPower: number]: number } = {};

        const allCards = new Array<Weighted<CardRef>>();
        for (const deck of weightedDecks) {
            allCards.push(
                ...deck.cards.map(x => ({
                    value: { card: x.value, deckUrl: deck.deck.url },
                    weight: x.weight * deck.deck.weight,
                })),
            );
        }

        this.boostWillPower(allCards);

        for (const deck of this.status.decks) {
            deckWeights[deck.url] = 0;
        }

        for (const card of allCards) {
            const { value, weight } = card;

            const deck = this.status.decks.find(x => x.url === value.deckUrl)!;

            deckWeights[value.deckUrl] += weight * deck.weight;

            const willPower = value.card.willPower || 0;
            if (willPowerCounter[willPower] === undefined) {
                willPowerWeights[willPower] = 0;
                willPowerCounter[willPower] = 0;
            }

            willPowerWeights[willPower] += weight * deck.weight;
            willPowerCounter[willPower] += 1;
        }

        const willPowerWeightsArray: Weighted<{
            willPower: number | null;
            count: number;
        }>[] = Object.keys(willPowerWeights).map(propName => {
            const willPower = Number(propName);
            return {
                value: {
                    willPower: willPower === 0 ? null : willPower,
                    count: willPowerCounter[willPower],
                },
                weight: willPowerWeights[willPower],
            };
        });

        const decksArray = Object.keys(deckWeights).map(url => {
            const deck = this.status.decks.find(x => x.url === url)!;
            return { value: deck, weight: deckWeights[url] * deck.weight };
        });

        return { decks: decksArray, willPower: willPowerWeightsArray, totalCards: allCards.length };
    }

    public selectPlayers(
        playerSettings: GenderRequirement[],
        definedPlayers: (PlayerInfo | null)[],
        tags: string[],
    ): PlayerInfo[] {
        if (playerSettings.length === 0) {
            return [];
        }

        if (playerSettings.length > this.status.players.length) {
            throw new Error("More players were requested than available.");
        }

        const forArrangement = new Array<string>();
        const result: (PlayerInfo | null)[] = playerSettings.map((_, i) =>
            definedPlayers.length > i ? definedPlayers[i] : null,
        );

        for (const player of definedPlayers.filter(x => x !== null).map(x => x!)) {
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

        let resultCounter = 0;
        const insights: PlayerSelectionInsights = {
            predefined: definedPlayers.filter(x => x != null).map(x => x!.id),
            rounds: [],
        };

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

                const source = sourceList.filter(x => !_.includes(result, x));
                const malesCount = result.filter(x => x !== null && x.gender === "Male").length;
                const femalesCount = result.filter(x => x !== null && x.gender === "Female").length;

                const selectionRoundInsights = new Array<PlayerSelection>();
                const player = this.selectRandomWeighted(source, p => {
                    let weight = 1;

                    if (_.some(forArrangement, x => x === p.id)) {
                        if (
                            _.some(higherArrangementPropabilityTags, x =>
                                _.some(tags, y => x === y.toLowerCase()),
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

                    selectionRoundInsights.push({ playerId: p.id, weight, chosen: false });
                    return weight;
                })!;

                selectionRoundInsights.find(x => x.playerId === player.id)!.chosen = true;
                insights.rounds.push(selectionRoundInsights);

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

        this.insights.playerSelection = insights;
        return result.map(x => x!);
    }

    public selectCard(cardType: string): CardRef {
        const weightedDecks = this.weightCards(this.status.decks, cardType);

        const allCards = new Array<Weighted<CardRef>>();
        for (const deck of weightedDecks) {
            allCards.push(
                ...deck.cards.map(x => ({
                    value: { card: x.value, deckUrl: deck.deck.url },
                    weight: x.weight * deck.deck.weight,
                })),
            );
        }

        this.boostWillPower(allCards);

        for (const card of allCards) {
            const deck = this.status.decks.find(x => x.url === card.value.deckUrl)!;
            card.weight *= deck.weight;
        }

        const selected = this.selectRandomWeighted(allCards, x => x.weight);
        if (selected === undefined) {
            throw new Error("That should not actually happen");
        }

        return selected.value;
    }

    private boostWillPower(cards: Weighted<CardRef>[]): void {
        const willPower = this.status.willPower;

        const perfectCards = cards.filter(
            x => x.value.card.willPower === willPower || x.value.card.willPower === willPower - 1,
        );
        const unplayedCards = perfectCards.filter(
            x =>
                this.status.cardsHistory.findIndex(
                    y => y.deckUrl === x.value.deckUrl && y.card.id === x.value.card.id,
                ) === -1,
        );

        // played cards / all cards
        const percentage = (perfectCards.length - unplayedCards.length) / perfectCards.length;

        // console.log(
        //     `wp: ${willPower}, perfect: ${perfectCards.length}, unplayed: ${
        //         unplayedCards.length
        //     }, percentage: ${percentage}`,
        // );

        // we don't boost if we already played 10% (deckExhaustionLimit) of the cards
        if (this.deckExhaustionLimit > percentage && unplayedCards.length > 50) {
            const totalWeight = cards.reduce((x, y) => x + y.weight, 0);
            const unplayedWeight = unplayedCards.reduce((x, y) => x + y.weight, 0);

            console.log(`total: ${totalWeight}, unplayed: ${unplayedWeight}`);

            const targetPercentage = 0.7;
            if (totalWeight * targetPercentage > unplayedWeight) {
                const factor =
                    totalWeight * targetPercentage -
                    unplayedWeight +
                    unplayedWeight / unplayedWeight;

                // const diff = (totalWeight * targetPercentage - unplayedWeight);
                // const add = diff / unplayedCards.length;
                console.log("factor: " + factor);

                // const add = (totalWeight - unplayedWeight) / perfectCards.length;
                for (const perfectCard of unplayedCards) {
                    perfectCard.weight = perfectCard.weight * factor;
                }
            }
        }
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
            const weightedDecks = this.weightCards(
                this.status.decks.filter(x => x.weight !== 0),
                cardType,
            );

            const allCards: Array<Weighted<Card>> = [];
            for (const cardDeck of weightedDecks) {
                allCards.push(...cardDeck.cards);
            }

            if (allCards.length === 0) {
                cardTypeRatings[cardType] = 0;
            } else {
                cardTypeRatings[cardType] =
                    0.75 + (0.25 * allCards.reduce((x, y) => x + y.weight, 0)) / allCards.length;
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

        if (weightedSlides.length > 2 && this.status.slidesHistory.length > 0) {
            const lastSlideType = this.status.slidesHistory[0];
            const lastSlide = weightedSlides.find(x => x.value.slideType === lastSlideType);
            if (lastSlide !== undefined) {
                lastSlide.weight = 0;
            }
        }

        this.insights.slideWeights = {
            weights: weightedSlides.map(x => ({ weight: x.weight, value: x.value.slideType })),
        };

        const selected = this.selectRandomWeighted(weightedSlides, slide => slide.weight);
        if (selected === undefined) {
            return undefined;
        }

        return selected.value.slideType;
    }

    public getSips(min: number): number {
        min = Math.max(min, 1);

        return Math.max(min, Math.floor(this.getRandom() * 4) + 1);
    }

    protected weightCards(
        decks: CardDeck[],
        type: string | null,
    ): Array<{ cards: Array<Weighted<Card>>; deck: CardDeck }> {
        const filtered: CardDeck[] = decks.map(x => ({
            cards: x.cards.filter(card => {
                if (type !== null && card.type !== type) {
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

        const willPower = this.status.willPower;

        for (const deck of filtered) {
            // cards from this deck that were already played
            const cardsPlayed = this.status.cardsHistory.filter(x => x.deckUrl === deck.url);

            // compute the deck exhaustion factor
            let exhaustionFactor: number;

            const percentage = cardsPlayed.length / deck.cards.length;
            if (percentage > this.deckExhaustionLimit) {
                // cubic reduction
                exhaustionFactor = Math.pow(Math.max(1.1 - percentage, 0.1), 2) * 0.5;
            } else {
                exhaustionFactor = 1;
            }

            const weightedCards: Array<Weighted<Card>> = [];
            for (const card of deck.cards) {
                const willPowerRating = this.rateWillPower(card.willPower, willPower);
                const historyFactor = this.getHistoryFactor(card.id, cardsPlayed, totalCards);
                const tagsFactor = this.getTagsFactor(card.tags, this.status.tags);
                const weight = exhaustionFactor * willPowerRating * historyFactor * tagsFactor;
                if (weight === 0) {
                    continue;
                }

                weightedCards.push({
                    value: card,
                    weight: weight,
                });
            }

            result.push({ deck, cards: weightedCards });
        }

        return result;
    }

    public recomputeWillPower(memory: string[]): { willPower: number; memory: string[] } {
        const addedMemory = new Array<string>();
        const now = new Date();
        let result = this.status.willPower;

        if (!_.includes(memory, "AFTER_10") && (now.getHours() > 22 || now.getHours() < 8)) {
            result++;
            addedMemory.push("AFTER_10");
        }

        const slidesCount = this.status.slidesHistory.length;
        if (slidesCount % 12 === 0 && slidesCount !== 0) {
            const id = slidesCount / 12;
            if (!_.includes(memory, `SLIDES_${id}`)) {
                result++;
                addedMemory.push(`SLIDES_${id}`);
            }
        }

        if (result > 5) {
            result = 5;
        }

        return { willPower: result, memory: addedMemory };
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
    protected getHistoryFactor(id: string, history: CardRef[], totalCards: number) {
        const historyPosition = history.findIndex(x => x.card.id === id);
        if (historyPosition === -1) {
            return 1;
        }

        if (historyPosition > totalCards) {
            return 0;
        }

        return historyPosition / totalCards;
    }

    /** return a value between 0 and 1 for the given will power */
    protected rateWillPower(cardWillPower: number | undefined, willPower: number) {
        if (cardWillPower === undefined) {
            return 0.75;
        }

        // --- --- --- ||| --- --- --- ---
        // 0.5 .75 .75  1  .15  0   0   0

        if (cardWillPower === willPower) {
            return 1;
        }

        if (cardWillPower > willPower) {
            const result = 0.15 - (cardWillPower - willPower) * 0.1;
            return result < 0 ? 0 : result;
        }

        return 0.5;
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
