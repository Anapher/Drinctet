import { SlidePresenter } from "./slide-presenter";
import { Card } from "@core/cards/card";
import * as gameEngine from "../../game-engine";
import { ReactNode } from "react";
import * as actions from "../../actions";
import { ActionType } from "typesafe-actions";
import { CardRef } from "@core/cards/card-ref";

export abstract class CardPresenter<TCard extends Card> implements SlidePresenter {
    abstract backgroundColor: string;
    requiredCards: string[];

    constructor(protected cardType: string, public slideType: string) {
        this.requiredCards = [cardType];
    }

    initialize(): ActionType<any>[] {
        const selection = gameEngine.getRandomSelectionAlgorithm();
        const cardRef = selection.selectCard(this.cardType);

        return [actions.applyCard(cardRef), ...this.initializeCard(cardRef.card as TCard, cardRef)];
    }

    initializeFollowUp(card: CardRef | null, param: any): ActionType<any>[] {
        return this.initializeFollowUpCard(card!.card as TCard, param, card!);
    }

    abstract render(): ReactNode;
    protected abstract initializeCard(card: TCard, cardRef: CardRef): ActionType<any>[];
    protected abstract initializeFollowUpCard(card: TCard, param: any, cardRef: CardRef): ActionType<any>[];
}
