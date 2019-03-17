import { Card } from '@core/cards/card';
import { createStandardAction } from "typesafe-actions";

export const startGame = createStandardAction("START_GAME")();

export const cancelGame = createStandardAction("CANCEL_GAME")();

export const nextSlide = createStandardAction("APPLY_SLIDE")<string>();

export const applyCard = createStandardAction("APPLY_CARD")<Card>();

export const setSlideState = createStandardAction("SET_SLIDE_STATE")<any>();
