import { TextCardParser } from "@core/parsing/text-card-parser";
import { DrinkCard } from "../cards/drink-card";

export class DrinkCardParser extends TextCardParser<DrinkCard> {
    protected createCard(): DrinkCard {
        return new DrinkCard();
    }
}
