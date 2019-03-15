import { CardDeck } from "../card-deck";
import { Card } from "../cards/card";

type CardDictionary = { [id: string]: { card: Card; deck: CardDeckInfo } };
type CardsWillPowerDistribution = { willPower: number | undefined; count: number };

export class CardsStore {
    public totalCards: number;
    public dictionary: CardDictionary;
    public decks: CardDeckInfo[] = [];

    update(decks: CardDeck[]) {
        // check if anything has changed
        for (const deck of decks) {
            const existingIndex = this.decks.findIndex(x => x.url === deck.url);
            if (existingIndex > -1) {
                const existingDeck = this.decks[existingIndex];
                if (existingDeck.cards.length === deck.cards.length) {
                    existingDeck.weight = deck.weight; // the only thing that can change without needing an invalidate
                    continue;
                }
            }

            this.invalidate(decks);
            return;
        }

        if (decks.length !== this.decks.length) {
            this.invalidate(decks);
        }
    }

    protected invalidate(decks: CardDeck[]) {
        // to stay deterministic
        decks.sort((a, b) => {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        });

        const result: CardDictionary = {};
        const deckInfos: CardDeckInfo[] = [];

        for (const deck of decks) {
            const deckInfo = new CardDeckInfo(deck);

            for (const card of deck.cards) {
                if (!(card.id in result)) {
                    result[card.id] = { card, deck: deckInfo };
                    deckInfo.actualCards++;

                    const distIndex = deckInfo.willPowerDistribution.findIndex(
                        x => x.willPower === card.willPower,
                    );
                    if (distIndex > -1) {
                        deckInfo.willPowerDistribution[distIndex].count++;
                    } else {
                        deckInfo.willPowerDistribution.push({
                            count: 1,
                            willPower: card.willPower,
                        });
                    }
                }
            }

            deckInfos.push(deckInfo);
        }

        this.dictionary = result;
        this.decks = deckInfos;
    }
}

class CardDeckInfo implements CardDeck {
    public cards: Card[];
    public weight: number;
    public url: string;
    public actualCards: number = 0;
    public willPowerDistribution: CardsWillPowerDistribution[] = [];

    constructor(deck: CardDeck) {
        this.cards = deck.cards;
        this.weight = deck.weight;
        this.url = deck.url;
    }
}
