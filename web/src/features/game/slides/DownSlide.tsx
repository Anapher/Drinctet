import { TextSlidePresenter, TextSlideState } from "./base/text-slide-presenter";
import { DownCard } from "src/impl/cards/down-card";
import { getRootStyles, defaultMarkdownOptions, getContentStyles, spaceHeaderStyles } from "./base/helper";
import { RootState } from "DrinctetTypes";
import { requestSlideAsync } from "../actions";
import { ReactNode } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { createStyles, Theme, WithStyles, Typography, withStyles } from "@material-ui/core";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import Markdown from "markdown-to-jsx";
import * as React from "react";
import { toTranslator } from "../utils";
import { Translator } from "GameModels";

const mapStateToProps = (state: RootState) => ({
    state: state.game.slideState as DownSlideState,
});

const dispatchProps = {
    nextSlide: requestSlideAsync.request,
};

const styles = (theme: Theme) =>
    createStyles({
        root: {
            ...getRootStyles(),
            backgroundColor: "#34495e"
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

function DownSlideComponent(props: Props) {
    const {classes, nextSlide, state} = props;
    if (state === null) {
        return <div className={classes.root} />;
    }

    const header = (
        <Typography className={classes.header} variant="h3">
            <Translate id="slides.down.title" />
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
    );}

const Component =
    compose(
        connect(
            mapStateToProps,
            dispatchProps,
        ),
        withStyles(styles),
        withLocalize
    )(DownSlideComponent) as React.ComponentType;

interface DownSlideState extends TextSlideState {}
export class DownSlide extends TextSlidePresenter<DownSlideState, DownCard> {
    constructor(translator: Translator) {
        super(translator, "DownCard", "DownSlide");
    }

    public render(): ReactNode {
        return (<Component />);
    }

    protected initializeState(markdownContent: string): DownSlideState {
        return {
            markdownContent: markdownContent,
        };
    }

    protected initializeFollowUpState(markdownContent: string): DownSlideState {
        return {
            markdownContent: markdownContent,
        };
    }
}
