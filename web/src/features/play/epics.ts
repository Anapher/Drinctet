import { PlayerArrangement } from "@core/player-arrangement";
import { RootAction, RootState, Services } from "DrinctetTypes";
import { Epic } from "redux-observable";
import { of } from "rxjs";
import { filter, mergeMap } from "rxjs/operators";
import { isActionOf } from "typesafe-actions";
import { automaticArrangements } from "../../preferences";
import * as actions from "./actions";

export const nextSlideEpic: Epic<RootAction, RootAction, RootState, Services> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.addPlayer)),
        mergeMap(action => {
            const arrangements: PlayerArrangement[] = [];

            for (const key in automaticArrangements) {
                if (automaticArrangements.hasOwnProperty(key)) {
                    const matches = automaticArrangements[key];

                    // if the added player is listed as key in preferences
                    if (action.payload.name.toUpperCase() == key.toUpperCase()) {
                        for (const matchName of matches) {
                            const matchedPlayer = state$.value.play.players.find(
                                x => x.name.toUpperCase() === matchName.toUpperCase(),
                            );
                            if (matchedPlayer === undefined) {
                                continue;
                            }

                            arrangements.push(
                                new PlayerArrangement(matchedPlayer.id, action.payload.id),
                            );
                        }
                    }

                    // if the player is listed as value preferences
                    const existingPlayer = state$.value.play.players.find(
                        x => x.name.toUpperCase() === key.toUpperCase(),
                    );
                    if (existingPlayer !== undefined) {
                        const addedMatch = matches.find(
                            x => x.toUpperCase() === action.payload.name.toUpperCase(),
                        );
                        if (addedMatch !== undefined) {
                            arrangements.push(
                                new PlayerArrangement(action.payload.id, existingPlayer.id),
                            );
                        }
                    }
                }
            }

            const addActions = new Array<RootAction>();
            for (const arrangement of arrangements) {
                if (
                    state$.value.play.arrangements.find(
                        x =>
                            (x.p1 === arrangement.p1 || x.p2 === arrangement.p2) ||
                            (x.p1 === arrangement.p2 || x.p2 === arrangement.p1),
                    ) !== undefined
                ) {
                    continue;
                }

                addActions.push(actions.addPlayerArrangment(arrangement));
            }

            return of(...addActions);
        }),
    );
