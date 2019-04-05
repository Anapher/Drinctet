import { TextCard } from "@core/cards/text-card";
import { SelectionAlgorithm } from "@core/selection/selection-algorithm";
import { createStyles, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import { cardMarkdownOptions } from "@utils/material-markdown";
import { RootState } from "DrinctetTypes";
import { SelectedPlayer, Translator } from "GameModels";
import Markdown from "markdown-to-jsx";
import * as React from "react";
import { ReactNode } from "react";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import { connect } from "react-redux";
import { animated, useSpring } from "react-spring";
import { compose } from "redux";
import { NeverEverCard } from "src/impl/cards/never-ever-card";
import { requestSlideAsync } from "../actions";
import { toTranslator } from "../utils";
import * as baseStyles from "./base/helper";
import { TextSlidePresenter, TextSlideState } from "./base/text-slide-presenter";
import colors from "./colors";

const mapStateToProps = (state: RootState) => ({
    state: state.game.slideState as State,
});

const dispatchProps = {
    nextSlide: requestSlideAsync.request,
};

const styles = (theme: Theme) =>
    createStyles({
        root: baseStyles.rootStyle(),
        content: baseStyles.contentStyle(theme),
        header: baseStyles.smallHeaderStyle(theme),
        hidden: baseStyles.hidden(),
    });

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    WithStyles<typeof styles> &
    LocalizeContextProps;

function NeverEverComponent(props: Props) {
    const { classes, nextSlide, state } = props;
    if (state === null) {
        return <div className={classes.root} />;
    }

    if (state.isFollowUp) {
        return (
            <div className={classes.root} onClick={() => nextSlide(toTranslator(props))}>
                <div className={classes.content}>
                    <Markdown children={state.markdownContent} options={cardMarkdownOptions} />
                </div>
            </div>
        );
    }

    const header = (
        <Typography className={classes.header} variant="h6" color="inherit">
            <Translate id="slides.neverever.title" />
        </Typography>
    );

    const springProps = useSpring({
        opacity: 1,
        transform: "rotate(0deg)",
        from: { opacity: 0, transform: "rotate(20deg)" },
    });

    return (
        <div className={classes.root} onClick={() => nextSlide(toTranslator(props))}>
            <animated.div style={springProps} className={classes.content}>
                {header}
                <Markdown children={state.markdownContent} options={cardMarkdownOptions} />
                <div style={{ position: "relative" }}>
                    <Typography style={{ marginTop: 20 }} color="inherit" variant="subtitle1">
                        <Translate id="slides.neverever.instruction" data={{ sips: state.sips }} />
                    </Typography>
                </div>
            </animated.div>
        </div>
    );
}

const Component = compose(
    connect(
        mapStateToProps,
        dispatchProps,
    ),
    withStyles(styles),
    withLocalize,
)(NeverEverComponent) as React.ComponentType;

interface State extends TextSlideState {
    sips: number;
    isFollowUp: boolean;
}

export class NeverEverSlide extends TextSlidePresenter<State, NeverEverCard> {
    backgroundColor = colors.neverEver;

    constructor(translator: Translator) {
        super(translator, "NeverEverCard", "NeverEverSlide");
    }

    render(): ReactNode {
        return <Component />;
    }

    protected initializeState(
        markdownContent: string,
        _card: NeverEverCard,
        _players: SelectedPlayer[],
        selection: SelectionAlgorithm,
    ): State {
        return {
            markdownContent: markdownContent,
            sips: selection.getSips(2), // at least two sips so the text can be plural
            isFollowUp: false,
        };
    }

    selectText(selection: SelectionAlgorithm, selectedCard: TextCard): string {
        return "..." + super.selectText(selection, selectedCard);
    }

    protected initializeFollowUpState(markdownContent: string): State {
        return {
            markdownContent: markdownContent,
            sips: 0,
            isFollowUp: true,
        };
    }
}
