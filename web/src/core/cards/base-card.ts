import { PlayerSetting } from "./player-setting";

/** A very basic implementation of Card  */
export abstract class BaseCard {
  public id!: string;
  public willPower!: number;
  public players!: PlayerSetting[];
  public tags!: string[];

  public abstract type: string;
}
