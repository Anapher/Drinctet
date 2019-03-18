import { RootAction } from "DrinctetTypes";
import { combineReducers } from "redux";
import { getType } from "typesafe-actions";
import { Card } from "../../core/cards/card";
import * as actions from "./actions";
import { FollowUpSlide, SelectedPlayer } from "GameModels";

export type GameState = Readonly<{
    isStarted: boolean;

    selectedSlide: string | null;
    selectedCard: Card | null;

    selectedPlayers: SelectedPlayer[];
    slideState: any | null;
    currentSeed: string;

    // currentWillPower: number;
    // isWillPowerLocked: boolean;

    // startTime: string;

    cardsHistory: string[];
    slidesHistory: string[];
    followUp: FollowUpSlide[];
    activeFollowUp: string | null;
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
    slidesHistory: (state = [], action) => {
        if (action.type === getType(actions.nextSlide)) {
            return [action.payload, ...state];
        }
        return state;
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
            case getType(actions.nextSlide):
                return null;
            case getType(actions.activateFollowUp):
                return action.payload.selectedCard;
        }
        return state;
    },
    selectedSlide: (state = null, action) => {
        switch (action.type) {
            case getType(actions.nextSlide):
                return action.payload;
            case getType(actions.activateFollowUp):
                return action.payload.slideType;
            default:
                return state;
        }
    },
    slideState: (state = null, action) => {
        switch (action.type) {
            case getType(actions.nextSlide):
            case getType(actions.enqueueFollowUp):
                return null;
            case getType(actions.setSlideState):
                return action.payload;
            default:
                return state;
        }
    },
    selectedPlayers: (state = [], action) => {
        switch (action.type) {
            case getType(actions.nextSlide):
                return [];
            case getType(actions.activateFollowUp):
                return action.payload.selectedPlayers;
            case getType(actions.selectPlayers):
                return [...state, ...action.payload];
            default:
                return state;
        }
    },
    currentSeed: (state = "", action) => {
        switch (action.type) {
            case getType(actions.nextSlide):
            case getType(actions.activateFollowUp):
                return "";
            case getType(actions.setCurrentSeed):
                return action.payload;
            default:
                return state;
        }
    },
    followUp: (state = [], action) => {
        switch (action.type) {
            case getType(actions.enqueueFollowUp):
                return [...state, action.payload];
            case getType(actions.activateFollowUp):
                return state.filter(x => x.id !== action.payload.id);
            default:
                return state;
        }
    },
    activeFollowUp: (state = null, action) => {
        switch (action.type) {
            case getType(actions.nextSlide):
                return null;
            case getType(actions.activateFollowUp):
                return action.payload.id;
            default:
                return state;
        }
    },
});
