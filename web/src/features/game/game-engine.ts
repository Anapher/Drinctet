import { CardDeck } from "../../core/card-deck";
import { Card } from "../../core/cards/card";
import { GameStatus } from "../../core/game-status";
import { MelinaAlgorithm } from "../../core/selection/melina-algorithm";
import { SlideRegistration } from "../../core/slide-registration";
import { slides } from "../../impl/registrations";
import store from "../../store/index";
import { applyCard, nextSlide as nextSlideAction } from "./actions";

let selection: MelinaAlgorithm;
let selectionStatusHash: string;

const registeredSlides = compileSlideRegistrations();

export function drawCard<TCard extends Card>(cardType: string): TCard {
    invalidateAlgorithm();

    const card = selection.selectCard<TCard>(cardType);

    store.dispatch(applyCard(card));
    return card;
}

export function nextSlide() {
    invalidateAlgorithm();

    const slideType = selection.selectNextSlide(registeredSlides);
    if (slideType === undefined) {
        // TODO: end game
        throw new Error("Game Finished");
    }

    store.dispatch(nextSlideAction(slideType));
}

function invalidateAlgorithm() {
    const state = store.getState();

    const currentStatus: GameStatus = {
        decks: state.settings.sources
            .filter(x => x.cards !== undefined)
            .map(item => {
                const result: CardDeck = { ...item, cards: item.cards || [] };
                return result;
            }),
        history: state.game.cardsHistory,
        language: state.settings.language,
        players: state.settings.players,
        slides: state.settings.slides,
        tags: state.settings.tags,
    };

    const currentStatusHash = hashGameStatus(currentStatus);
    if (selection === undefined || currentStatusHash !== selectionStatusHash) {
        selection = new MelinaAlgorithm(currentStatus);
        selectionStatusHash = currentStatusHash;
    }
}

function hashGameStatus(status: GameStatus): string {
    return JSON.stringify({
        decks: status.decks.map(x => {
            return { url: x.url, cardsCount: x.cards.length, weight: x.weight };
        }),
        language: status.language,
        players: status.players,
        slides: status.slides,
    });
}

function compileSlideRegistrations(): SlideRegistration[] {
    const result: SlideRegistration[] = [];

    for (const [type, info] of Object.entries(slides)) {
        result.push({ slideType: type, requestedCards: info.cards });
    }

    return result;
}
