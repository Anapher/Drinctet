import { RootAction } from "DrinctetTypes";
import { SourceInfo } from "SettingsModels";
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
    sources: SourceInfo[];
    language: string;
}>;

export default combineReducers<SettingsState, RootAction>({
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
    sources: (state = [], action) => {
        switch (action.type) {
            case getType(actions.addSource):
                return [...state, action.payload];
            case getType(actions.removeSource):
                return state.filter(x => x.url !== action.payload);
            case getType(actions.loadSourceAsync.request):
                return state.map(item =>
                    item.url === action.payload ? { ...item, isLoading: true } : item,
                );
            case getType(actions.loadSourceAsync.success):
                return state.map(item =>
                    item.url === action.payload.url
                        ? {
                              ...item,
                              cards: action.payload.cards,
                              errorMessage: undefined,
                              isLoading: false,
                          }
                        : item,
                );
            case getType(actions.loadSourceAsync.failure):
                return state.map(item =>
                    item.url === action.payload.url
                        ? { ...item, isLoading: false, errorMessage: action.payload.message }
                        : item,
                );
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
    socialMediaPlatform: (state = "Snapchat", _action) => {
        return state;
    },
    language: (state = "en", _action) => {
        return state;
    },
});
