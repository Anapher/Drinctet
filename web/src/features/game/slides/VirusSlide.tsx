import { createStyles, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import { cardMarkdownOptions } from "@utils/material-markdown";
import { RootState } from "DrinctetTypes";
import { Translator } from "GameModels";
import Markdown from "markdown-to-jsx";
import * as React from "react";
import { ReactNode } from "react";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import { connect } from "react-redux";
import { compose } from "redux";
import { VirusCard } from "src/impl/cards/virus-card";
import { requestSlideAsync } from "../actions";
import { toTranslator } from "../utils";
import * as baseStyles from "./base/helper";
import { TextSlidePresenter, TextSlideState } from "./base/text-slide-presenter";
import colors from "./colors";

const mapStateToProps = (state: RootState) => ({
    state: state.game.slideState as VirusSlideState,
});

const dispatchProps = {
    nextSlide: requestSlideAsync.request,
};

const styles = (theme: Theme) =>
    createStyles({
        root: baseStyles.rootStyle(),
        content: baseStyles.contentStyle(theme),
        header: {
            ...baseStyles.headerStyle(theme),
            marginBottom: 10,
        },
        hidden: baseStyles.hidden(),
    });

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    WithStyles<typeof styles> &
    LocalizeContextProps;

function VirusSlideComponent(props: Props) {
    const { classes, nextSlide, state } = props;
    if (state === null) {
        return <div className={classes.root} />;
    }

    const header = (
        <Typography className={classes.header} variant="h3" color="inherit">
            <Translate id="slides.virus.title" />
        </Typography>
    );

    return (
        <div className={classes.root} onClick={() => nextSlide(toTranslator(props))}>
            <div className={classes.content}>
                {header}
                <Markdown children={state.markdownContent} options={cardMarkdownOptions} />
                <div className={classes.hidden}>{header}</div>
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
)(VirusSlideComponent) as React.ComponentType;

interface VirusSlideState extends TextSlideState {}
export class VirusSlide extends TextSlidePresenter<VirusSlideState, VirusCard> {
    backgroundColor = colors.virus;

    constructor(translator: Translator) {
        super(translator, "VirusCard", "VirusSlide");
    }

    public render(): ReactNode {
        return <Component />;
    }

    protected initializeState(markdownContent: string): VirusSlideState {
        return {
            markdownContent: markdownContent,
        };
    }

    protected initializeFollowUpState(markdownContent: string): VirusSlideState {
        return {
            markdownContent: markdownContent,
        };
    }
}
