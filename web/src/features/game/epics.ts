import { SlideRegistration } from "@core/slide-registration";
import { RootAction, RootState, Services } from "DrinctetTypes";
import { Epic } from "redux-observable";
import { filter, map } from "rxjs/operators";
import { isActionOf } from "typesafe-actions";
import _ from "lodash";
import store from "../../store/index";
import * as actions from "./actions";
import { getRandomSelectionAlgorithm } from "./game-engine";
import { slides } from "../../impl/registrations";
import { push } from "connected-react-router";

export const nextSlideEpic: Epic<RootAction, RootAction, RootState, Services> = action$ =>
    action$.pipe(
        filter(isActionOf(actions.requestSlideAsync.request)),
        map(() => nextSlide()),
    );

export const redirectOnGameStartedEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    Services
> = action$ =>
    action$.pipe(filter(isActionOf(actions.startGame)), map(() => <any> push("/game")));

const registeredSlides = compileSlideRegistrations();

function nextSlide() {
    const now = new Date();
    const state = store.getState();

    const dueFollowUps = state.game.followUp.filter(x => x.due < now);
    if (dueFollowUps.length > 0) {
        const followUp = _.sortBy(dueFollowUps, x => x.due.getSeconds())[0];
        return actions.activateFollowUp(followUp);
    }

    const selection = getRandomSelectionAlgorithm();
    const slideType = selection.selectNextSlide(registeredSlides);
    if (slideType === undefined) {
        // TODO: end game
        throw new Error("Game Finished");
    }

    return actions.requestSlideAsync.success(slideType);
}

function compileSlideRegistrations(): SlideRegistration[] {
    const result: SlideRegistration[] = [];

    for (const [type, info] of Object.entries(slides)) {
        result.push({ slideType: type, requestedCards: info.cards });
    }

    return result;
}
