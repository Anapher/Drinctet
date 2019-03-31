import { Gender, PlayerInfo } from "@core/player-info";
import cuid from "cuid";
import { PlayerArrangement } from "@core/player-arrangement";
import { createStandardAction } from "typesafe-actions";

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

export const addPlayerArrangment = createStandardAction("ADD_PLAYER_ARRANGEMENT")<
    PlayerArrangement
>();
export const removePlayerArrangment = createStandardAction("REMOVE_PLAYER_ARRANGEMENT")<string>();
