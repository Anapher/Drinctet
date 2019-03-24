import { QuestionCard } from './../cards/question-card';
import { TextCardParser } from "@core/parsing/text-card-parser";

export class QuestionCardParser extends TextCardParser<QuestionCard> {
    protected createCard(): QuestionCard {
        return new QuestionCard();
    }
}
