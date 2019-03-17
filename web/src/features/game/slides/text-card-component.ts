import { setSlideState } from './../actions';
import { Card } from "./../../../core/cards/card";
import { CardComponent, CardComponentProps } from "./card-component";
import { TextCard } from "../../../core/cards/text-card";
import _ from "underscore";
import { selectRandomWeighted } from "../../../core/selection/utils";
import { TextElement } from "../../../core/cards/text-element";

interface TextCardComponentProps extends CardComponentProps {
    lang: string;
    setSlideState: typeof setSlideState;
}

export abstract class TextCardComponent<
    TCard extends TextCard,
    TProps extends TextCardComponentProps,
    TState
> extends CardComponent<TCard, TProps, TState> {
    readonly state: TState = this.createState();

    initialize(card: TCard) {
        const viableContents = card.content.filter(x =>
            _.any(x.translations, y => y.lang === this.props.lang),
        );
        const content = selectRandomWeighted(viableContents, x => x.weight);
        const index = card.content.findIndex(x => x === content);

        this.props.setSlideState(index);

        if (card.followUp.length !== 0) {

        }
    }

    componentDidMount() {}

    private memoize() {

    }

    protected formatText() {
        const translation = this.props.selectedCard!.
    }

    private readonly memoizedformatTextInternal = _.memoize(this.formatTextInternal);

    private formatTextInternal() {

    }

    protected abstract createState(): TState;
}
