import { TruthOrDareSlide } from './slides/TruthOrDareSlide';
import { DownSlide } from "./slides/DownSlide";
import { SlidePresenter } from "./slides/base/slide-presenter";
import { FactSlide } from "./slides/FactSlide";
import { NeverEverSlide } from "./slides/NeverEverSlide";
import { Translator } from "GameModels";
import { WouldYouRatherSlide } from './slides/WouldYouRatherSlide';
import { DrinkSlide } from './slides/DrinkSlide';
import { VirusSlide } from './slides/VirusSlide';
import { NoIdeaLosesSlide } from './slides/NoIdeaLosesSlide';
import { GroupGameSlide } from './slides/GroupGameSlide';
import { TaskSlide } from './slides/TaskSlide';
import { OpeningSlide } from './slides/OpeningSlide';
import { GameFinishedSlide } from './slides/GameFinishedSlide';

export type SlideComponents = { [type: string]: new(translator: Translator) => SlidePresenter };

export const slideComponents: SlideComponents = {
    DownSlide,
    FactSlide,
    NeverEverSlide,
    TruthOrDareSlide,
    WouldYouRatherSlide,
    DrinkSlide,
    VirusSlide,
    NoIdeaLosesSlide,
    GroupGameSlide,
    TaskSlide,
    OpeningSlide,
    GameFinishedSlide
};
