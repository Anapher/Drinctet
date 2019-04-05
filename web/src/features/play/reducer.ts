import { PlayerArrangement } from "@core/player-arrangement";
import { PlayerInfo } from "@core/player-info";
import { combineReducers } from "redux";
import { RootAction } from "DrinctetTypes";
import * as actions from "./actions";
import { getType } from "typesafe-actions";

export type PlayState = Readonly<{
    players: PlayerInfo[];
    arrangements: PlayerArrangement[];
}>;

export default combineReducers<PlayState, RootAction>({
    players: (state = [], action) => {
        switch (action.type) {
            case getType(actions.addPlayer):
                return [...state, action.payload];
            case getType(actions.removePlayer):
                return state.filter(x => x.id !== action.payload);
            case getType(actions.updatePlayer):
                return state.map(player =>
                    player.id === action.payload.id ? action.payload : player,
                );
            default:
                return state;
        }
    },
    arrangements: (state = [], action) => {
        switch (action.type) {
            case getType(actions.addPlayerArrangment):
                return [...state, action.payload];
            case getType(actions.removePlayerArrangment):
                return state.filter(x => x.p1 !== action.payload);
            case getType(actions.removePlayer):
                return state.filter(x => x.p1 !== action.payload && x.p2 !== action.payload);
            default:
                return state;
        }
    },
});
