import { RootAction } from "DrinctetTypes";
import { combineReducers } from "redux";
import { getType } from "typesafe-actions";
import { Card } from "@core/cards/card";
import * as actions from "./actions";
import { FollowUpSlide } from "GameModels";
import cuid from "cuid";

export type GameState = Readonly<{
    isStarted: boolean;

    selectedSlide: string | null;
    selectedCard: Card | null;

    slideState: any | null;

    // currentWillPower: number;
    // isWillPowerLocked: boolean;

    // startTime: string;

    cardsHistory: string[];
    slidesHistory: string[];
    followUp: FollowUpSlide[];
    activeFollowUp: FollowUpSlide | null;
    current: string;
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
        if (action.type === getType(actions.requestSlideAsync.success)) {
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
            case getType(actions.requestSlideAsync.success):
                return null;
            case getType(actions.activateFollowUp):
                return action.payload.selectedCard;
        }
        return state;
    },
    selectedSlide: (state = null, action) => {
        switch (action.type) {
            case getType(actions.requestSlideAsync.success):
                return action.payload;
            case getType(actions.activateFollowUp):
                return action.payload.slideType;
            default:
                return state;
        }
    },
    slideState: (state = null, action) => {
        switch (action.type) {
            case getType(actions.requestSlideAsync.success):
            case getType(actions.activateFollowUp):
                return null;
            case getType(actions.setSlideState):
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
                return state.filter(x => x !== action.payload);
            default:
                return state;
        }
    },
    activeFollowUp: (state = null, action) => {
        switch (action.type) {
            case getType(actions.requestSlideAsync.success):
                return null;
            case getType(actions.activateFollowUp):
                return action.payload;
            default:
                return state;
        }
    },
    current: (state = "", action) => {
        switch (action.type) {
            case getType(actions.requestSlideAsync.success):
            case getType(actions.activateFollowUp):
                return cuid();
            default:
                return state;
        }
    }
});
