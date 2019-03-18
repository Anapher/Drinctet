import { Card } from '@core/cards/card';
import { createStandardAction } from "typesafe-actions";
import { FollowUpSlide, SelectedPlayer } from 'GameModels';

export const startGame = createStandardAction("START_GAME")();

export const cancelGame = createStandardAction("CANCEL_GAME")();

export const nextSlide = createStandardAction("APPLY_SLIDE")<string>();

export const applyCard = createStandardAction("APPLY_CARD")<Card>();

export const setSlideState = createStandardAction("SET_SLIDE_STATE")<any>();

export const selectPlayers = createStandardAction("SELECT_PLAYERS")<SelectedPlayer[]>();

export const enqueueFollowUp = createStandardAction("ADD_FOLLOW_UP")<FollowUpSlide>();
export const activateFollowUp = createStandardAction("ACTIVATE_FOLLOW_UP")<FollowUpSlide>();

export const setCurrentSeed = createStandardAction("SET_CURRENT_SEED")<string>();