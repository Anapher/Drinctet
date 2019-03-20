import { ReactNode } from "react";
import { Card } from "@core/cards/card";
import { RootAction } from "DrinctetTypes";

export interface SlidePresenter {
    slideType: string;
    requiredCards: string[];

    initialize(): RootAction[];
    initializeFollowUp(card: Card | null, param: any): RootAction[];
    render(): ReactNode;
}
