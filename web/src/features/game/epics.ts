import { RootAction, RootState, Services } from "DrinctetTypes";
import { Epic } from "redux-observable";
import { filter, map, mergeMap } from "rxjs/operators";
import { isActionOf } from "typesafe-actions";
import _ from "lodash";
import store from "../../store/index";
import * as actions from "./actions";
import { getRandomSelectionAlgorithm } from "./game-engine";
import { push } from "connected-react-router";
import { slideComponents } from "./component-registry";
import { of } from "rxjs";
import { Translator } from "GameModels";
import {getSlideRegistrations} from "./slides-processor";

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
        map(() => <any>push("/game")),
    );

function nextSlide(translator: Translator): RootAction[] {
    const now = new Date();
    const state = store.getState();

    const dueFollowUps = state.game.followUp.filter(x => x.due < now);
    if (dueFollowUps.length > 0) {
        const followUp = _.sortBy(dueFollowUps, x => x.due.getSeconds())[0];

        const factory = slideComponents[followUp.slideType];
        const slideInitalizer = new factory(translator);
        const slideActions = slideInitalizer.initializeFollowUp(followUp.selectedCard, followUp.param);

        return [actions.activateFollowUp(followUp), ...slideActions];
    }

    const selection = getRandomSelectionAlgorithm();
    const slides = getSlideRegistrations(slideComponents);
    
    const slideType = selection.selectNextSlide(slides);
    if (slideType === undefined) {
        // TODO: end game
        throw new Error("Game Finished");
    }

    const factory = slideComponents[slideType];
    const slideInitalizer = new factory(translator);
    const slideActions = slideInitalizer.initialize();

    return [actions.requestSlideAsync.success(slideType), ...slideActions];
}
