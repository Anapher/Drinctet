import { BaseCard } from "./base-card";
import { TextElement } from "./text-element";
import { GameStatus } from "../game-status";
import _ from "underscore";

export abstract class TextCard extends BaseCard {
    /** the propability (0-1) that this card follows up */
    public followUpPropability: number = 1;

    /** the delay of the follow up in seconds */
    public followUpDelay!: number;

    public content!: TextElement[];
    public followUp!: TextElement[];

    public condition: (status: GameStatus) => boolean = status => {
        return _.any(this.content, x => _.any(x.translations, y => y.lang === status.language));
    };
}
