import { TruthOrDareSlide } from './slides/TruthOrDareSlide';
import { DownSlide } from "./slides/DownSlide";
import { SlidePresenter } from "./slides/base/slide-presenter";
import { FactSlide } from "./slides/FactSlide";
import { NeverEverSlide } from "./slides/NeverEverSlide";
import { Translator } from "GameModels";

export type SlideComponents = { [type: string]: new(translator: Translator) => SlidePresenter };

export const slideComponents: SlideComponents = {
    DownSlide,
    FactSlide,
    NeverEverSlide,
    TruthOrDareSlide,
};
