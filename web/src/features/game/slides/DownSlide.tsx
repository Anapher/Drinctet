import { createStyles, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import { RootState } from "DrinctetTypes";
import { Translator } from "GameModels";
import Markdown from "markdown-to-jsx";
import * as React from "react";
import { ReactNode } from "react";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import { connect } from "react-redux";
import { Spring, config } from "react-spring/renderprops";
import { compose } from "redux";
import { DownCard } from "src/impl/cards/down-card";
import { requestSlideAsync } from "../actions";
import { toTranslator } from "../utils";
import * as baseStyles from "./base/helper";
import { TextSlidePresenter, TextSlideState } from "./base/text-slide-presenter";
import colors from "./colors";
import { cardMarkdownOptions } from "@utils/material-markdown";

const mapStateToProps = (state: RootState) => ({
    state: state.game.slideState as DownSlideState,
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
            marginBottom: 15,
        },
        hidden: baseStyles.hidden()
    });

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    WithStyles<typeof styles> &
    LocalizeContextProps;

function DownSlideComponent(props: Props) {
    const { classes, nextSlide, state } = props;
    if (state === null) {
        return <div className={classes.root} />;
    }

    const header = (
        <Typography className={classes.header} variant="h3" color="inherit">
            <Translate id="slides.down.title" />
        </Typography>
    );

    return (
        <div className={classes.root} onClick={() => nextSlide(toTranslator(props))}>
            <div className={classes.content}>
                <Spring
                    config={config.wobbly}
                    from={{ transform: "translate(-100px, 0px)" }}
                    to={{ transform: "translate(0px, 0px)" }}
                >
                    {props => (
                        <div style={props as any}>
                            {header}
                            <Markdown
                                children={state.markdownContent}
                                options={cardMarkdownOptions}
                            />
                            <div className={classes.hidden}>{header}</div>
                        </div>
                    )}
                </Spring>
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
)(DownSlideComponent) as React.ComponentType;

interface DownSlideState extends TextSlideState {}
export class DownSlide extends TextSlidePresenter<DownSlideState, DownCard> {
    backgroundColor = colors.down;

    constructor(translator: Translator) {
        super(translator, "DownCard", "DownSlide");
    }

    public render(): ReactNode {
        return <Component />;
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
