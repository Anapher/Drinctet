import { SlidePresenter } from "./slide-presenter";
import { Card } from "@core/cards/card";
import * as gameEngine from "../../game-engine";
import { ReactNode } from "react";
import store from "../../../../store/index";
import * as actions from "../../actions";

export abstract class CardPresenter<TCard extends Card> implements SlidePresenter {
    constructor(protected cardType: string) {}

    initialize(): ReactNode {
        const selection = gameEngine.getRandomSelectionAlgorithm();
        const card = selection.selectCard(this.cardType) as TCard;
        store.dispatch(actions.applyCard(card));

        return this.initializeCard(card);
    }

    initializeFollowUp(card: Card | null, param: any): ReactNode {
        return this.initializeFollowUpCard(card as TCard, param);
    }

    protected abstract initializeCard(card: TCard): ReactNode;
    protected abstract initializeFollowUpCard(card: TCard, param: any): ReactNode;
}
