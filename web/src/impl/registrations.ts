import { ComponentType } from "react";
import { CardParser } from "../core/parsing/card-parser";
import FactSlide from "../features/game/slides/FactSlide";
import { FactCardParser } from "./parsing/fact-card-parser";

type ParserRegistration = { [type: string]: new () => CardParser };
type SlideRegistration = { [type: string]: { component: ComponentType; cards: string[] } };

export const parsers: ParserRegistration = {
    FactCard: FactCardParser,
};

export const slides: SlideRegistration = {
    FactSlide: { cards: ["FactCard"], component: FactSlide },
};
