import { setSlideState } from './../actions';
import { CardComponent, CardComponentProps } from "./card-component";
import { TextCard } from "../../../core/cards/text-card";
import _ from "underscore";
import { selectRandomWeighted } from "../../../core/selection/utils";

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
            this.formatTextInternal();
        }
    }

    componentDidMount() {}

    protected formatText() {
    }

    private formatTextInternal() {
        console.log("test");
        
    }

    protected abstract createState(): TState;
}
