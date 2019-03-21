import { Card } from '@core/cards/card';
import { createStandardAction, createAsyncAction } from "typesafe-actions";
import { FollowUpSlide, Translator } from 'GameModels';
import { History } from 'history';

export const startGame = createStandardAction("START_GAME")<History>();

export const cancelGame = createStandardAction("CANCEL_GAME")();

export const requestSlideAsync = createAsyncAction(
    "NEXT_SLIDE_REQUEST",
    "NEXT_SLIDE_SUCCESS",
    "NEXT_SLIDE_FAILURE",
)<Translator, string, string>();

export const applyCard = createStandardAction("APPLY_CARD")<Card>();

export const setSlideState = createStandardAction("SET_SLIDE_STATE")<any>();

export const enqueueFollowUp = createStandardAction("ADD_FOLLOW_UP")<FollowUpSlide>();
export const activateFollowUp = createStandardAction("ACTIVATE_FOLLOW_UP")<FollowUpSlide>();
