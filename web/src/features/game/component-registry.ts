import { DownSlide } from "./slides/DownSlide";
import { SlidePresenter } from "./slides/base/slide-presenter";
import { TranslateFunc } from "./slides/base/text-slide-presenter";
import { FactSlide } from "./slides/FactSlide";

type SlideComponent = { [type: string]: (translate: TranslateFunc) => SlidePresenter };

export const slideComponents: SlideComponent = {
    DownSlide: x => new DownSlide(x),
    FactSlide: x => new FactSlide(x),
};
