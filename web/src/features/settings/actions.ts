import { PlayerInfo, Gender } from "../../core/player-info";
import { createStandardAction, createAsyncAction } from "typesafe-actions";
import cuid from "cuid";

export const addPlayer = createStandardAction("ADD_PLAYER").map(
    (playerInfo: {name: string, gender: Gender}): {payload: PlayerInfo} => ({
        payload: {
            name: playerInfo.name,
            gender: playerInfo.gender,
            id: cuid()
        },
    })
);

export const updatePlayer = createStandardAction("UPDATE_PLAYER")<PlayerInfo>();

export const removePlayer = createStandardAction("REMOVE_PLAYER")<string>();

export const loadCardsAsync = createAsyncAction(
    'LOAD_CARDS_REQUEST',
    'LOAD_CARDS_SUCCESS',
    'LOAD_CARDS_FAILURE'
)<undefined, string, string>();
