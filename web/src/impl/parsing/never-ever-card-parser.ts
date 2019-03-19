import { TextCardParser } from "@core/parsing/text-card-parser";
import { NeverEverCard } from "../cards/never-ever-card";

export class NeverEverCardParser extends TextCardParser<NeverEverCard> {
    protected createCard(): NeverEverCard {
        return new NeverEverCard();
    }
}
