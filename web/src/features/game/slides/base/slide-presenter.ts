import { ReactNode } from "react";
import { Card } from "@core/cards/card";

export interface SlidePresenter {
    initialize(): ReactNode;
    initializeFollowUp(card: Card | null, param: any): ReactNode;
}
