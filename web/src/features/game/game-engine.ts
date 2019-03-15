import { CardDeck } from "../../core/card-deck";
import { GameStatus } from "../../core/game-status";
import { MelinaAlgorihtm } from "../../core/selection/melina-algorithm";
import { SlideRegistration } from "../../core/slide-registration";
import { slides } from "../../impl/registrations";
import store from "../../store/index";
import { nextSlide as nextSlideAction, applyCard } from "./actions";
import { Card } from "../../core/cards/card";

let selection: MelinaAlgorihtm;
let selectionStatusHash: string;

const registeredSlides = compileSlideRegistrations();

export function drawCard<TCard extends Card>(): TCard {
    invalidateAlgorithm();

    const card = selection.selectCard<TCard>();

    store.dispatch(applyCard(card.id));

    return card;
}

export function getCardById(id: string): TCard {
    
}

export function nextSlide() {
    invalidateAlgorithm();
    
    const slideType = selection.selectNextSlide(registeredSlides);
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
        language: state.settings.language,
        players: state.settings.players,
        slides: state.settings.slides,
    };

    const currentStatusHash = hashGameStatus(currentStatus);
    if (selection === undefined || currentStatusHash !== selectionStatusHash) {
        selection = new MelinaAlgorihtm(currentStatus);
        selectionStatusHash = currentStatusHash;
    }
}

function hashGameStatus(status: GameStatus): string {
    return JSON.stringify(
        {
            decks: status.decks.map(x => {
                return {url: x.url, cardsCount: x.cards.length, weight: x.weight};
            }),
            language: status.language,
            players: status.players,
            slides: status.slides,
        }
    );
}

function compileSlideRegistrations(): SlideRegistration[] {
    const result: SlideRegistration[] = [];

    for (const [type, info] of Object.entries(slides)) {
        result.push({ slideType: type, requestedCards: info.cards });
    }

    return result;
}
