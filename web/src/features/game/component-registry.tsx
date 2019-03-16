import FactSlide from "./slides/FactSlide";
import * as React from "react";

type SlideComponent = { [type: string]: { component: () => any } };

export const slideComponents: SlideComponent = {
    FactSlide: { component: () => <FactSlide /> },
};
