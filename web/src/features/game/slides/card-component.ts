import { MelinaAlgorithm } from '@core/selection/melina-algorithm';
import { Card } from "@core/cards/card";
import { Component } from "react";
import { drawCard } from "../game-engine";

export interface CardComponentProps {
    selectedCard: Card | null;
    slideState: any | null;
}

export abstract class CardComponent<
    TCard extends Card,
    TProps extends CardComponentProps,
    TState
> extends Component<TProps, TState> {
    constructor(props: TProps, private type: string) {
        super(props);
    }

    componentDidMount() {
        if (this.props.selectedCard === null) {
            const card = drawCard(this.type) as TCard;
            const algorithm = new MelinaAlgorithm()
            this.initialize(card);
        }
    }

    protected abstract initialize(card: TCard): void;
}
