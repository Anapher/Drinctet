import { ReactNode } from "react";
import { RootAction } from "DrinctetTypes";
import { CardRef } from "@core/cards/card-ref";

export interface SlidePresenter {
    slideType: string;
    requiredCards: string[];

    initialize(): RootAction[];
    initializeFollowUp(card: CardRef | null, param: any): RootAction[];
    render(): ReactNode;
}
