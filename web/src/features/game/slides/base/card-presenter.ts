import { SlidePresenter } from "./slide-presenter";
import { Card } from "@core/cards/card";
import * as gameEngine from "../../game-engine";
import { ReactNode } from "react";
import * as actions from "../../actions";
import { ActionType } from "typesafe-actions";

export abstract class CardPresenter<TCard extends Card> implements SlidePresenter {
    requiredCards: string[];

    constructor(protected cardType: string, public slideType: string) {
        this.requiredCards = [cardType];
    }

    initialize(): ActionType<any>[] {
        const selection = gameEngine.getRandomSelectionAlgorithm();
        const card = selection.selectCard(this.cardType) as TCard;

        return [actions.applyCard(card), ...this.initializeCard(card)];
    }

    initializeFollowUp(card: Card | null, param: any): ActionType<any>[] {
        return this.initializeFollowUpCard(card as TCard, param);
    }

    abstract render(): ReactNode;
    protected abstract initializeCard(card: TCard): ActionType<any>[];
    protected abstract initializeFollowUpCard(card: TCard, param: any): ActionType<any>[];
}
