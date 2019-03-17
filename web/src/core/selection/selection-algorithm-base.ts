import { Card } from "../cards/card";
import { GameStatus } from "../game-status";
import { SlideRegistration } from "../slide-registration";
import { SelectionAlgorithm } from "./selection-algorithm";

// tslint:disable-next-line: max-classes-per-file
export abstract class SelectionAlgorithmBase implements SelectionAlgorithm {
    constructor(protected readonly status: GameStatus) {
    }

    public abstract selectNextSlide(availableSlides: SlideRegistration[]): string | undefined;
    public abstract selectCard<TCard extends Card>(cardType: string): TCard;
}
