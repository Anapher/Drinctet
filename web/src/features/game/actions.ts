import { PlayerSelectionInsights } from './../../core/selection/insights';
import { Card } from '@core/cards/card';
import { createStandardAction, createAsyncAction } from "typesafe-actions";
import { FollowUpSlide, Translator } from 'GameModels';
import { History } from 'history';
import { SlideSelectionInsights } from '@core/selection/insights';

export const startGame = createStandardAction("START_GAME")<History>();

export const cancelGame = createStandardAction("CANCEL_GAME")();

export const requestSlideAsync = createAsyncAction(
    "NEXT_SLIDE_REQUEST",
    "NEXT_SLIDE_SUCCESS",
    "NEXT_SLIDE_FAILURE",
)<Translator, {slide: string, insights: SlideSelectionInsights | null}, string>();

export const applyCard = createStandardAction("APPLY_CARD")<Card>();

export const setSlideState = createStandardAction("SET_SLIDE_STATE")<{state: any, insights: PlayerSelectionInsights | null}>();

export const enqueueFollowUp = createStandardAction("ADD_FOLLOW_UP")<FollowUpSlide>();
export const activateFollowUp = createStandardAction("ACTIVATE_FOLLOW_UP")<FollowUpSlide>();

export const setWillPowerLocked = createStandardAction("SET_WILL_POWER_LOCKED")<boolean>();
export const setWillPower = createStandardAction("SET_WILL_POWER")<number>();
export const addWillPowerMemory = createStandardAction("ADD_WILL_POWER_MEMORY")<string[]>();
