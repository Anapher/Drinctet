import { TextSlidePresenter, TextSlideState, TranslateFunc } from "./base/text-slide-presenter";
import { DownCard } from "src/impl/cards/down-card";
import { getRootStyles, defaultMarkdownOptions } from "./base/helper";
import { RootState } from "DrinctetTypes";
import { requestSlideAsync } from "../actions";
import { ReactNode } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { createStyles, Theme, WithStyles, Typography, withStyles } from "@material-ui/core";
import { LocalizeContextProps, Translate } from "react-localize-redux";
import Markdown from "markdown-to-jsx";
import * as React from "react";

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
            backgroundColor: "#34495e",
        },
        content: {
            textAlign: "center",
            [theme.breakpoints.down("sm")]: {
                width: "100%",
                margin: 0,
                fontSize: 20,
            },
            [theme.breakpoints.down("lg")]: {
                width: "80%",
            },
        },
        header: {
            color: "white",
            marginBottom: 15,
        },
    });

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    WithStyles<typeof styles> &
    LocalizeContextProps;

function DownSlideComponent({classes, nextSlide, state}: Props) {
    if (state === null) {
        return <Typography>Loading...</Typography>
    }

    const header = (
        <Typography className={classes.header} variant="h3">
            <Translate id="slides.down.title" />
        </Typography>
    );

    return (
        <div className={classes.root} onClick={() => nextSlide()}>
            <div className={classes.content}>
                {header}
                <Markdown children={state.markdownContent} options={defaultMarkdownOptions} />
                <div style={{ opacity: 0 }}>{header}</div>
            </div>
        </div>
    );}

const Component =
    compose(
        connect(
            mapStateToProps,
            dispatchProps,
        ),
        withStyles(styles)
    )(DownSlideComponent) as React.ComponentType;

interface DownSlideState extends TextSlideState {}
export class DownSlide extends TextSlidePresenter<DownSlideState, DownCard> {
    constructor(translate: TranslateFunc) {
        super(translate, "DownCard");
    }

    protected initializeSlide(): ReactNode {
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
