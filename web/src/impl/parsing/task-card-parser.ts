import { TextCardParser } from "@core/parsing/text-card-parser";
import { TaskCard } from '../cards/task-card';

export class TaskCardParser extends TextCardParser<TaskCard> {
    protected createCard(): TaskCard {
        return new TaskCard();
    }
}
