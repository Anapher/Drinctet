import { createStandardAction } from "typesafe-actions";
import { CardIdentifier } from "GameModels";

export const startGame = createStandardAction("START_GAME")();

export const cancelGame = createStandardAction("CANCEL_GAME")();

export const nextSlide = createStandardAction("APPLY_SLIDE")<string>();

export const applyCard = createStandardAction("APPLY_CARD")<string>();
