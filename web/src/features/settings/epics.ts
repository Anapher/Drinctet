import { RootAction, RootState, Services } from "DrinctetTypes";
import { Epic } from "redux-observable";
import { from, of } from "rxjs";
import { catchError, filter, map, concatMap } from "rxjs/operators";
import { isActionOf } from "typesafe-actions";
import { loadSourceAsync } from "./actions";

export const loadSourceEpic: Epic<RootAction, RootAction, RootState, Services> = (
    action$,
    _state$,
    { api },
) =>
    action$.pipe(
        filter(isActionOf(loadSourceAsync.request)),
        concatMap(action =>
            from(api.cardsLoader.loadCards(action.payload)).pipe(
                map(cards => loadSourceAsync.success({ url: action.payload, cards })),
                catchError((message: string) =>
                    of(loadSourceAsync.failure({ url: action.payload, message })),
                ),
            ),
        ),
    );
