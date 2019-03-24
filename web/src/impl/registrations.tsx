import { CardParser } from "../core/parsing/card-parser";
import { FactCardParser } from "./parsing/fact-card-parser";
import { DownCardParser } from "./parsing/down-card-parser";
import { NeverEverCardParser } from "./parsing/never-ever-card-parser";
import { JokeCardParser } from "./parsing/joke-card-parser";
import { QuestionCardParser } from "./parsing/question-card-parser";
import { TaskCardParser } from "./parsing/task-card-parser";

type ParserRegistration = { [type: string]: new () => CardParser };

export const parsers: ParserRegistration = {
    FactCard: FactCardParser,
    DownCard: DownCardParser,
    NeverEverCard: NeverEverCardParser,
    JokeCard: JokeCardParser,
    QuestionCard: QuestionCardParser,
    TaskCard: TaskCardParser,
};
