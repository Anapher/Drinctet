import { createStyles, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import { RootState } from "DrinctetTypes";
import { Translator } from "GameModels";
import Markdown from "markdown-to-jsx";
import * as React from "react";
import { ReactNode } from "react";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import { connect } from "react-redux";
import { compose } from "redux";
import { WouldYouRatherCard } from "src/impl/cards/would-you-rather-card";
import { requestSlideAsync } from "../actions";
import { toTranslator } from "../utils";
import {
    defaultMarkdownOptions,
    getContentStyles,
    getRootStyles,
    spaceHeaderStyles,
} from "./base/helper";
import { TextSlidePresenter, TextSlideState } from "./base/text-slide-presenter";
import { SelectionAlgorithm } from "@core/selection/selection-algorithm";
import { TextCard } from "@core/cards/text-card";

const mapStateToProps = (state: RootState) => ({
    state: state.game.slideState as WouldYouRatherSlideState,
});

const dispatchProps = {
    nextSlide: requestSlideAsync.request,
};

const styles = (theme: Theme) =>
    createStyles({
        root: {
            ...getRootStyles(),
            backgroundColor: "#16a085",
        },
        content: getContentStyles(theme),
        header: {
            color: "white",
            marginBottom: 15,
        },
        spaceHeader: spaceHeaderStyles(theme),
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

    const header = (
        <Typography className={classes.header} variant="h3">
            <Translate id="slides.wouldyourather.title" />
        </Typography>
    );

    return (
        <div className={classes.root} onClick={() => nextSlide(toTranslator(props))}>
            <div className={classes.content}>
                {header}
                <Markdown children={state.markdownContent} options={defaultMarkdownOptions} />
                <div className={classes.spaceHeader}>{header}</div>
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

interface WouldYouRatherSlideState extends TextSlideState {}
export class WouldYouRatherSlide extends TextSlidePresenter<
    WouldYouRatherSlideState,
    WouldYouRatherCard
> {
    constructor(translator: Translator) {
        super(translator, "WyrCard", "WouldYouRatherSlide");
    }

    public render(): ReactNode {
        return <Component />;
    }

    selectText(selection: SelectionAlgorithm, selectedCard: TextCard): string {
        return "..." + super.selectText(selection, selectedCard);
    }

    protected initializeState(markdownContent: string): WouldYouRatherSlideState {
        return {
            markdownContent: markdownContent,
        };
    }

    protected initializeFollowUpState(markdownContent: string): WouldYouRatherSlideState {
        return {
            markdownContent: markdownContent,
        };
    }
}
