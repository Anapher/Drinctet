import { Card } from "../cards/card";
import { SlideRegistration } from "../slide-registration";

export interface SelectionAlgorithm {
    /** select the next slide. Return undefined if no slide could be selected */
    selectNextSlide(availableSlides: SlideRegistration[]): string |undefined;

    selectCard<TCard extends Card>(cardType: string): TCard;

    selectRandomWeighted<T>(items: T[], getWeight: (item: T) => number): T | undefined;
}
