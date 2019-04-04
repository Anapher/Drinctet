import { RootAction, RootState, Services } from "DrinctetTypes";
import { Epic } from "redux-observable";
import { from, of } from "rxjs";
import { catchError, filter, map, mergeMap, ignoreElements, tap } from "rxjs/operators";
import { isActionOf } from "typesafe-actions";
import { loadSourceAsync, resetAll } from "./actions";
import { deleteSettings } from "../../store/storage";

export const loadSourceEpic: Epic<RootAction, RootAction, RootState, Services> = (
    action$,
    _state$,
    { api },
) =>
    action$.pipe(
        filter(isActionOf(loadSourceAsync.request)),
        mergeMap(action =>
            from(api.cardsLoader.loadCards(action.payload)).pipe(
                map(cards => loadSourceAsync.success({ url: action.payload, cards })),
                catchError((message: string) =>
                    of(loadSourceAsync.failure({ url: action.payload, message })),
                ),
            ),
        ),
    );

export const resetAllEpic: Epic<RootAction, RootAction, RootState, Services> = (
    action$, _state$, _services
) => action$.pipe(
    filter(isActionOf(resetAll)),
    tap(() => deleteSettings()),
    tap(() => window.location.reload()),
    ignoreElements()
)