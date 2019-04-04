import { MelinaAlgorithm } from "./../../core/selection/melina-algorithm";
import { RootAction, RootState, Services } from "DrinctetTypes";
import { Epic } from "redux-observable";
import { filter, mergeMap, tap, ignoreElements } from "rxjs/operators";
import { isActionOf } from "typesafe-actions";
import _ from "lodash";
import store from "../../store/index";
import * as actions from "./actions";
import { getRandomSelectionAlgorithm } from "./game-engine";
import { slideComponents } from "./component-registry";
import { of } from "rxjs";
import { Translator } from "GameModels";
import { getSlideRegistrations } from "./slides-processor";

export const nextSlideEpic: Epic<RootAction, RootAction, RootState, Services> = action$ =>
    action$.pipe(
        filter(isActionOf(actions.requestSlideAsync.request)),
        mergeMap(x => of(...nextSlide(x.payload))),
    );

export const redirectOnGameStartedEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    Services
> = action$ =>
    action$.pipe(
        filter(isActionOf(actions.startGame)),
        tap(action => action.payload.push("/play/game")),
        ignoreElements(),
    );

function nextSlide(translator: Translator): RootAction[] {
    const now = new Date();
    let state = store.getState();

    const dueFollowUps = state.game.followUp.filter(x => x.due < now);
    if (dueFollowUps.length > 0) {
        const followUp = _.sortBy(dueFollowUps, x => x.due.getSeconds())[0];

        const factory = slideComponents[followUp.slideType];
        const slideInitalizer = new factory(translator);
        const slideActions = slideInitalizer.initializeFollowUp(
            followUp.selectedCard,
            followUp.param,
        );

        return [actions.activateFollowUp(followUp), ...slideActions];
    }

    let selection = getRandomSelectionAlgorithm(state);
    const slides = getSlideRegistrations(slideComponents);

    const { willPower, memory } = selection.recomputeWillPower(state.game.willPowerMemory);
    const willPowerActions = new Array<RootAction>();

    if (willPower !== state.game.currentWillPower) {
        if (!state.game.isWillPowerLocked) {
            willPowerActions.push(actions.setWillPower(willPower));
            state = { ...state, game: { ...state.game, currentWillPower: willPower } };
            selection = getRandomSelectionAlgorithm(state);
        }
    }

    if (memory.length > 0) {
        willPowerActions.push(actions.addWillPowerMemory(memory));
    }

    let slideType = selection.selectNextSlide(slides);
    if (slideType === undefined) {
        // TODO: end game
        slideType = "GameFinishedSlide";
    }

    const factory = slideComponents[slideType];
    const slideInitalizer = new factory(translator);
    const slideActions = slideInitalizer.initialize();

    return [
        actions.requestSlideAsync.success({
            slide: slideType,
            insights: (selection as MelinaAlgorithm).insights.slideWeights!,
        }),
        ...slideActions,
        ...willPowerActions
    ];
}
