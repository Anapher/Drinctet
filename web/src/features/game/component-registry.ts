import { DownSlide } from "./slides/DownSlide";
import { SlidePresenter } from "./slides/base/slide-presenter";
import { TranslateFunc } from "./slides/base/text-slide-presenter";
import { FactSlide } from "./slides/FactSlide";
import { NeverEverSlide } from "./slides/NeverEverSlide";

type SlideComponent = { [type: string]: new(translate: TranslateFunc) => SlidePresenter };

export const slideComponents: SlideComponent = {
    DownSlide,
    FactSlide,
    NeverEverSlide
};
