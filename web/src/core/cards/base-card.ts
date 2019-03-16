import { GameStatus } from "../game-status";
import { Card } from "./card";
import { PlayerSetting } from "./player-setting";

/** A very basic implementation of Card  */
export abstract class BaseCard implements Card {
  public id!: string;
  public willPower!: number | undefined;
  public players!: PlayerSetting[];
  public tags!: string[];
  public condition!: (status: GameStatus) => boolean;

  public readonly abstract type: string;
}
