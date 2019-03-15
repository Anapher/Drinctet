import { PlayerSetting } from "./player-setting";
import { GameStatus } from "../game-status";

/** the interface every card has to implement */
export interface Card {
  /** a unique id to identify the card */
  id: string;

  /** the optimal will power that is required for this card.This should be a number between 1 and 5, or zero if it doesnt matter */
  willPower: number | undefined;

  /** the type of this card, e. g. "TaskCard", "DownCard", etc. */
  type: string;

  /** the players that are required for this card with their settings */
  players: PlayerSetting[];

  /** tags of this card */
  tags: string[];

  /** a condition that must be met to play the card */
  condition: (status: GameStatus) => boolean;
}
