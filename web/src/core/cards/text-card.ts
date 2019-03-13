import { Card } from "./card";
import { BaseCard } from "./base-card";
import { PlayerSetting } from "./player-setting";

export abstract class TextCard extends BaseCard {
    /** the propability (0-1) that this card follows up */
    public followUpPropability: number = 1;

    /** the delay of the follow up in seconds */
    public followUpDelay!: number;

    public content!: TextElement[];
    public followUp!: TextElement[];
}

export class TextElement {
    public weight: number = 1;
    public translations!: TextTranslation[];
}

export class TextTranslation {
    constructor(public lang: string, public content: string) {}
}