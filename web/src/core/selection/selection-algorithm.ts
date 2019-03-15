import { Card } from "../cards/card";
import { SlideRegistration } from "../slide-registration";

export interface SelectionAlgorithm {
    selectNextSlide(availableSlides: SlideRegistration[]): string;
    selectCard<TCard extends Card>(): TCard;

    selectRandomWeighted<T>(items: T[], getWeight: (item: T) => number): T | undefined;
}
