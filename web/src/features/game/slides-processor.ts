import { SlideComponents } from "./component-registry";
import { SlideRegistration } from "@core/slide-registration";

export function getSlideRegistrations(components: SlideComponents): SlideRegistration[] {
    const result = new Array<SlideRegistration>();

    for (const component in components) {
        if (components.hasOwnProperty(component)) {
            const element = components[component];
            const slide = new element({ languageCode: "en", translate: () => "" });
            result.push({ slideType: slide.slideType, requestedCards: slide.requiredCards });
        }
    }

    return result;
}
