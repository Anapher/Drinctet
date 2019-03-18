import FactSlide from "./slides/FactSlide";
import DownSlide from "./slides/DownSlide";
import * as React from "react";

type SlideComponent = { [type: string]: { component: () => any } };

export const slideComponents: SlideComponent = {
    FactSlide: { component: () => <FactSlide /> },
    DownSlide: { component: () => <DownSlide /> },
};
