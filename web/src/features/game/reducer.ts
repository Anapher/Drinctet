import { PlayerSelectionInsights, SlideSelectionInsights } from './../../core/selection/insights';
import { RootAction } from "DrinctetTypes";
import { combineReducers } from "redux";
import { getType } from "typesafe-actions";
import * as actions from "./actions";
import { FollowUpSlide } from "GameModels";
import cuid from 'cuid';
import { CardRef } from '@core/cards/card-ref';

export type GameState = Readonly<{
    isStarted: boolean;

    selectedSlide: string | null;
    selectedCard: CardRef | null;

    slideState: any | null;

    currentWillPower: number;
    isWillPowerLocked: boolean;
    willPowerMemory: string[];

    playerInsights: PlayerSelectionInsights | null;
    slideInsights: SlideSelectionInsights | null;

    startTime: Date | null;

    cardsHistory: CardRef[];
    slidesHistory: string[];
    followUp: FollowUpSlide[];
    activeFollowUp: FollowUpSlide | null;
    currentSlideStatus: string;
}>;

export default combineReducers<GameState, RootAction>({
    cardsHistory: (state = [], action) => {
        switch (action.type) {
            case getType(actions.applyCard):
                return [action.payload, ...state];
            default:
                return state;
        }
    },
    slidesHistory: (state = [], action) => {
        if (action.type === getType(actions.requestSlideAsync.success)) {
            return [action.payload.slide, ...state];
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
                return action.payload.slide;
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
                return action.payload.state;
            default:
                return state;
        }
    },
    followUp: (state = [], action) => {
        switch (action.type) {
            case getType(actions.enqueueFollowUp):
                return [...state, action.payload];
            case getType(actions.activateFollowUp):
                return state.filter(x => x.due !== action.payload.due);
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
    startTime: (state = null, action) => {
        if (action.type === getType(actions.startGame)) {
            return new Date();
        }
        return state;
    },
    isWillPowerLocked: (state = false, action) => {
        if (action.type === getType(actions.setWillPowerLocked)) {
            return action.payload;
        }

        return state;
    },
    currentWillPower: (state = 1, action) => {
        if (action.type === getType(actions.setWillPower)) {
            return action.payload;
        }

        return state;
    },
    willPowerMemory: (state = [], action) => {
        switch (action.type) {
            case getType(actions.addWillPowerMemory):
                return [...state, ...action.payload];
            case getType(actions.startGame):
                return [];
            default:
                return state;
        }
    },
    playerInsights: (state = null, action) => {
        if (action.type === getType(actions.setSlideState)) {
            return action.payload.insights;
        }

        return state;
    },
    slideInsights: (state = null, action) => {
        if (action.type === getType(actions.requestSlideAsync.success)) {
            return action.payload.insights;
        }

        return state;
    },
    currentSlideStatus: (state = "", action) => {
        if (action.type === getType(actions.requestSlideAsync.success)) {
            return cuid();
        }

        return state;
    },
});
