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
import { compose } from "redux";
import { WouldYouRatherCard } from "src/impl/cards/would-you-rather-card";
import { requestSlideAsync } from "../actions";
import { toTranslator } from "../utils";
import * as baseStyles from "./base/helper";
import { TextSlidePresenter, TextSlideState } from "./base/text-slide-presenter";
import colors from "./colors";

const mapStateToProps = (state: RootState) => ({
    state: state.game.slideState as WouldYouRatherSlideState,
});

const dispatchProps = {
    nextSlide: requestSlideAsync.request,
};

const styles = (theme: Theme) =>
    createStyles({
        root: baseStyles.rootStyle(),
        content: baseStyles.contentStyle(theme),
        header: baseStyles.smallHeaderStyle(theme),
    });

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    WithStyles<typeof styles> &
    LocalizeContextProps;

function WouldYouRatherSlideComponent(props: Props) {
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
            <Translate id="slides.wouldyourather.title" />
        </Typography>
    );

    return (
        <div className={classes.root} onClick={() => nextSlide(toTranslator(props))}>
            <div className={classes.content}>
                {header}
                <Markdown children={state.markdownContent} options={cardMarkdownOptions} />
                <div style={{ position: "relative" }}>
                    <Typography style={{ marginTop: 20 }} color="inherit" variant="subtitle1">
                        <Translate
                            id="slides.wouldyourather.instruction"
                            data={{ sips: state.sips }}
                        />
                    </Typography>
                </div>
            </div>
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
)(WouldYouRatherSlideComponent) as React.ComponentType;

interface WouldYouRatherSlideState extends TextSlideState {
    sips: number;
    isFollowUp: boolean;
}

export class WouldYouRatherSlide extends TextSlidePresenter<
    WouldYouRatherSlideState,
    WouldYouRatherCard
> {
    backgroundColor = colors.wouldYouRather;
    constructor(translator: Translator) {
        super(translator, "WyrCard", "WouldYouRatherSlide");
    }

    public render(): ReactNode {
        return <Component />;
    }

    selectText(selection: SelectionAlgorithm, selectedCard: TextCard): string {
        return "..." + super.selectText(selection, selectedCard);
    }

    protected initializeState(
        markdownContent: string,
        _card: WouldYouRatherCard,
        _players: SelectedPlayer[],
        selection: SelectionAlgorithm,
    ): WouldYouRatherSlideState {
        return {
            markdownContent: markdownContent,
            sips: selection.getSips(2), // at least two sips so the text can be plural
            isFollowUp: false,
        };
    }

    protected initializeFollowUpState(markdownContent: string): WouldYouRatherSlideState {
        return {
            markdownContent: markdownContent,
            sips: 0,
            isFollowUp: true,
        };
    }
}
