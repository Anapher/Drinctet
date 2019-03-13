import { RootAction, RootState, Services } from "DrinctetTypes";
import { Epic } from "redux-observable";
import { from, of } from "rxjs";
import { filter, switchMap, catchError, map } from "rxjs/operators";
import { isActionOf } from "typesafe-actions";

import { loadCardsAsync } from "./actions";

export const loadCardsDataEpic: Epic<RootAction, RootAction, RootState, Services>
    = (action$, _state$, { api }) =>
        action$.pipe(
            filter(isActionOf(loadCardsAsync.request)),
            switchMap(() =>
                from(api.cardsClient.loadCards).pipe(
                    map(loadCardsAsync.success),
                    catchError((message: string) => of(loadCardsAsync.failure(message)))
                )
            )
        );
