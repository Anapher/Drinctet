import { CardDeck } from "@core/card-deck";
import { Card } from "@core/cards/card";
import { GameStatus } from "@core/game-status";
import { MelinaAlgorithm } from "@core/selection/melina-algorithm";
import { SlideRegistration } from "@core/slide-registration";
import { slides } from "../../impl/registrations";
import store from "../../store/index";
import * as actions from "./actions";
import { SelectionAlgorithm } from "@core/selection/selection-algorithm";
import { RootState } from "DrinctetTypes";
import seedrandom from "seedrandom";
import { PlayerSetting } from "@core/cards/player-setting";
import _ from "underscore";
import { SelectedPlayer } from "GameModels";
import cuid from "cuid";

const registeredSlides = compileSlideRegistrations();

export function drawCard<TCard extends Card>(cardType: string): TCard {
    const selection = getRandomSelectionAlgorithm();
    const card = selection.selectCard<TCard>(cardType);

    store.dispatch(actions.applyCard(card));
    return card;
}

export function nextSlide() {
    const now = new Date();
    const state = store.getState();

    const dueFollowUps = state.game.followUp.filter(x => x.due < now);
    if (dueFollowUps.length > 0) {
        const followUp = _.sortBy(dueFollowUps, x => x.due.getSeconds())[0];
        store.dispatch(actions.activateFollowUp(followUp));
        return;
    }

    const selection = getRandomSelectionAlgorithm();
    const slideType = selection.selectNextSlide(registeredSlides);
    if (slideType === undefined) {
        // TODO: end game
        throw new Error("Game Finished");
    }

    store.dispatch(actions.nextSlide(slideType));
}

export function enqueueFollowUp(
    due: Date,
    card: Card | null,
    players: SelectedPlayer[],
    param: any = null,
) {
    const state = store.getState();

    store.dispatch(
        actions.enqueueFollowUp({
            slideType: state.game.selectedSlide!,
            selectedCard: card,
            due: due,
            selectedPlayers: players,
            id: cuid(),
            param,
        }),
    );
}

export function generateSeed(): string {
    // use seed from seedrandom
    const seed = (seedrandom as any)(undefined, {
        pass: (_: any, seed: string) => {
            return seed;
        },
    }) as string;

    store.dispatch(actions.setCurrentSeed(seed));
    return seed;
}

export function getStateBasedSelectionAlgorithm(seed: string | null = null): SelectionAlgorithm {
    const state = store.getState();
    const status = extractGameStatus(state);
    const random = seedrandom(seed || state.game.currentSeed);

    return new MelinaAlgorithm(status, random);
}

export function selectPlayers(players: PlayerSetting[], card: Card): SelectedPlayer[] {
    const selection = getRandomSelectionAlgorithm();
    const result = selection.selectPlayers(players.map(x => x.gender), card);
    const selected = result.map((x, i) => ({ index: players[i].playerIndex, player: x }));

    store.dispatch(actions.selectPlayers(selected));
    return selected;
}

function getRandomSelectionAlgorithm(): SelectionAlgorithm {
    const random = seedrandom();
    return new MelinaAlgorithm(extractGameStatus(store.getState()), random);
}

function extractGameStatus(state: RootState): GameStatus {
    const currentStatus: GameStatus = {
        decks: state.settings.sources
            .filter(x => x.cards !== undefined)
            .map(item => {
                const result: CardDeck = { ...item, cards: item.cards || [] };
                return result;
            }),
        history: state.game.cardsHistory,
        language: state.localize.languages.find(x => x.active)!.code,
        players: state.settings.players,
        slides: state.settings.slides,
        tags: state.settings.tags,
        arrangements: state.settings.arrangements,
        preferOppositeGenders: state.settings.preferOppositeGenders,
    };

    return currentStatus;
}

function compileSlideRegistrations(): SlideRegistration[] {
    const result: SlideRegistration[] = [];

    for (const [type, info] of Object.entries(slides)) {
        result.push({ slideType: type, requestedCards: info.cards });
    }

    return result;
}
