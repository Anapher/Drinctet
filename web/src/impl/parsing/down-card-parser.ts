import { TextCardParser } from "@core/parsing/text-card-parser";
import { DownCard } from "../cards/down-card";

export class DownCardParser extends TextCardParser<DownCard> {
    protected createCard(): DownCard {
        return new DownCard();
    }
}
