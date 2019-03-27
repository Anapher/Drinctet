import { CardParser } from "../core/parsing/card-parser";
import { FactCardParser } from "./parsing/fact-card-parser";
import { VirusCardParser } from "./parsing/virus-card-parser";
import { DefaultTextCardParser } from "./parsing/default-text-card-parser";
import { DownCard } from "./cards/down-card";
import { NeverEverCard } from "./cards/never-ever-card";
import { JokeCard } from "./cards/joke-card";
import { QuestionCard } from "./cards/question-card";
import { TaskCard } from "./cards/task-card";
import { WouldYouRatherCard } from "./cards/would-you-rather-card";
import { DrinkCard } from "./cards/drink-card";
import { GroupGameCard } from "./cards/group-game-card";
import { NoIdeaLosesCard } from "./cards/no-idea-loses-card";

type ParserRegistration = { [type: string]: () => CardParser };

export const parsers: ParserRegistration = {
    FactCard: () => new FactCardParser(),
    VirusCard: () => new VirusCardParser(),
    DownCard: () => new DefaultTextCardParser<DownCard>(DownCard),
    NeverEverCard: () => new DefaultTextCardParser<NeverEverCard>(NeverEverCard),
    JokeCard: () => new DefaultTextCardParser<JokeCard>(JokeCard),
    QuestionCard: () => new DefaultTextCardParser<QuestionCard>(QuestionCard),
    TaskCard: () => new DefaultTextCardParser<TaskCard>(TaskCard),
    WyrCard: () => new DefaultTextCardParser<WouldYouRatherCard>(WouldYouRatherCard),
    DrinkCard: () => new DefaultTextCardParser<DrinkCard>(DrinkCard),
    GroupGameCard: () => new DefaultTextCardParser<GroupGameCard>(GroupGameCard),
    NoIdeaLosesCard: () => new DefaultTextCardParser<NoIdeaLosesCard>(NoIdeaLosesCard),
};
