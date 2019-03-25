import { TextCardParser } from "@core/parsing/text-card-parser";
import { WouldYouRatherCard } from "../cards/would-you-rather-card";

export class WouldYouRatherCardParser extends TextCardParser<WouldYouRatherCard> {
    protected createCard(): WouldYouRatherCard {
        return new WouldYouRatherCard();
    }
}
