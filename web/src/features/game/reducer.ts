import { RootAction } from "DrinctetTypes";
import { combineReducers } from "redux";
import { getType } from "typesafe-actions";
import { Card } from "../../core/cards/card";
import * as actions from "./actions";

export type GameState = Readonly<{
    isStarted: boolean;

    selectedSlide: string | null;
    selectedCard: Card | null;
    // selectedPlayers: PlayerInfo[];

    // currentWillPower: number;
    // isWillPowerLocked: boolean;

    // startTime: string;

    cardsHistory: string[];
}>;

export default combineReducers<GameState, RootAction>({
    cardsHistory: (state = [], action) => {
        switch (action.type) {
            case getType(actions.applyCard):
                return [action.payload.id, ...state];
            default:
                return state;
        }
    },
    isStarted: (state = false, action) => {
        switch (action.type) {
            case getType(actions.startGame):
                return true;
            case getType(actions.cancelGame):
                return false;
            default:
                return state;
        }
    },
    selectedCard: (state = null, action) => {
        switch (action.type) {
            case getType(actions.applyCard):
                return action.payload;
            case getType(actions.applyCard):
                return null;
        }
        return state;
    },
    selectedSlide: (state = null, action) => {
        switch (action.type) {
            case getType(actions.nextSlide):
                return action.payload;
        }

        return state;
    },
});
