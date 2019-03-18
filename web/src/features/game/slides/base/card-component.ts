import { Card } from "@core/cards/card";
import { Component } from "react";
import { drawCard } from "../../game-engine";

export interface CardComponentProps {
    selectedCard: Card | null;
    followUp: string | null;
}

export abstract class CardComponent<
    TCard extends Card,
    TProps extends CardComponentProps,
    TState = {}
> extends Component<TProps, TState> {
    private currentCard: Card | null = null;
    private currentFollowUp: string | null = null;

    constructor(props: TProps, private type: string) {
        super(props);
    }

    checkIfInitializationRequired(): boolean {
        const { selectedCard, followUp } = this.props;
        if (followUp !== null) {
            if (this.currentFollowUp === followUp) {
                return false;
            }

            this.currentFollowUp = this.props.followUp;
            this.currentCard = null;
        } else {
            this.currentFollowUp = null;
        }

        if (this.currentCard !== selectedCard || selectedCard === null) {
            if (this.currentFollowUp !== null) {
                this.initializeFollowUp(selectedCard as TCard);
            } else {
                const card = drawCard(this.type) as TCard;
                this.currentCard = card;

                this.initialize(card);
            }

            return true;
        }

        return false;
    }

    protected abstract initialize(card: TCard): void;
    protected abstract initializeFollowUp(card: TCard): void;
}
