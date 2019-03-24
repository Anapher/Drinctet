import { JokeCard } from './../cards/joke-card';
import { TextCardParser } from "@core/parsing/text-card-parser";

export class JokeCardParser extends TextCardParser<JokeCard> {
    protected createCard(): JokeCard {
        return new JokeCard();
    }
}
