import { combineReducers } from "redux";
import { getType } from "typesafe-actions";
import * as actions from "./actions";
import { RootAction } from "DrinctetTypes";


export type GameState = Readonly<{
    isStarted: boolean;

    // selectedSlide: string;
    // selectedCard: string;
    // selectedPlayers: PlayerInfo[];

    // currentWillPower: number;
    // isWillPowerLocked: boolean;

    // startTime: string;

    // slidesHistory: string[];
    // cardsHistory: string[];
}>;

export default combineReducers<GameState, RootAction>({
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
    
});
