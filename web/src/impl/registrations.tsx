import { CardParser } from "../core/parsing/card-parser";
import { FactCardParser } from "./parsing/fact-card-parser";
import { DownCardParser } from "./parsing/down-card-parser";
import { NeverEverCardParser } from "./parsing/never-ever-card-parser";

type ParserRegistration = { [type: string]: new () => CardParser };

export const parsers: ParserRegistration = {
    FactCard: FactCardParser,
    DownCard: DownCardParser,
    NeverEverCard: NeverEverCardParser,
};
