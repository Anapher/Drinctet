import { CardParser } from "../core/parsing/card-parser";
import { FactCardParser } from "./parsing/fact-card-parser";
import { DownCardParser } from "./parsing/down-card-parser";
import { NeverEverCardParser } from "./parsing/never-ever-card-parser";

type ParserRegistration = { [type: string]: new () => CardParser };
type SlideRegistration = { [type: string]: { cards: string[] } };

export const parsers: ParserRegistration = {
    FactCard: FactCardParser,
    DownCard: DownCardParser,
    NeverEverCard: NeverEverCardParser,
};

export const slides: SlideRegistration = {
    FactSlide: { cards: ["FactCard"] },
    DownSlide: { cards: ["DownCard"] },
    NeverEverSlide: { cards: ["NeverEverCard"] },
};
