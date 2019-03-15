import cuid from "cuid";
import { SourceInfo } from "SettingsModels";
import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { Card } from "../../core/cards/card";
import { Gender, PlayerInfo } from "../../core/player-info";

export const addPlayer = createStandardAction("ADD_PLAYER").map(
    (playerInfo: { name: string; gender: Gender }): { payload: PlayerInfo } => ({
        payload: {
            name: playerInfo.name,
            gender: playerInfo.gender,
            id: cuid(),
        },
    }),
);
export const updatePlayer = createStandardAction("UPDATE_PLAYER")<PlayerInfo>();
export const removePlayer = createStandardAction("REMOVE_PLAYER")<string>();

export const addSource = createStandardAction("ADD_SOURCE").map(
    (url: string): {payload: SourceInfo} => ({
        payload: {
            url,
            isLoading: false,
            errorMessage: undefined,
            cards: undefined,
        },
    }),
)
export const removeSource = createStandardAction("REMOVE_SOURCE")<string>();

export const loadSourceAsync = createAsyncAction(
    "LOAD_SOURCE_REQUEST",
    "LOAD_SOURCE_SUCCESS",
    "LOAD_SOURCE_FAILURE",
)<string, { url: string; cards: Card[] }, { url: string; message: string }>();
