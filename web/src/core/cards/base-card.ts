import { Card } from "./card";
import { PlayerSetting } from "./player-setting";

/** A very basic implementation of Card  */
export abstract class BaseCard implements Card {
  public id!: string;
  public willPower!: number | undefined;
  public players!: PlayerSetting[];
  public tags!: string[];

  public abstract type: string;
}
