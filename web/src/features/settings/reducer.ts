import { RootAction } from "DrinctetTypes";
import { combineReducers } from "redux";
import { getType } from "typesafe-actions";
import { PlayerArrangement } from "../../core/player-arrangement";
import { PlayerInfo } from "../../core/player-info";
import { SlideSetting } from "../../core/slide-setting";
import * as actions from "./actions";

export type SettingsState = Readonly<{
    players: PlayerInfo[];
    arrangements: PlayerArrangement[];
    preferOppositeGenders: boolean;
    slides: SlideSetting[];
    socialMediaPlatform: string;
}>;

export default combineReducers<SettingsState, RootAction>({
    players: (state = [], action) => {
        switch (action.type) {
            case getType(actions.addPlayer):
                return [...state, action.payload];
            case getType(actions.removePlayer):
                return state.filter(x => x.id !== action.payload);
            case getType(actions.updatePlayer):
                const players = [...state];
                const index = players.findIndex(x => x.id === action.payload.id);
                players[index] = action.payload;
                return players;
            default:
                return state;
        }
    },
    arrangements: (state = [], _action) => {
        return state;
    },
    preferOppositeGenders: (state = false, _action) => {
        return state;
    },
    slides: (state = [], _action) => {
        return state;
    },
    socialMediaPlatform: (state = 'Snapchat', _action) => {
        return state;
    }
});
