import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import { cardMarkdownOptions } from "@utils/material-markdown";
import { RootState } from "DrinctetTypes";
import { Translator } from "GameModels";
import Markdown from "markdown-to-jsx";
import * as React from "react";
import { ReactNode } from "react";
import { LocalizeContextProps, withLocalize } from "react-localize-redux";
import { connect } from "react-redux";
import { compose } from "redux";
import { DrinkCard } from "src/impl/cards/drink-card";
import { requestSlideAsync } from "../actions";
import { toTranslator } from "../utils";
import * as baseStyles from "./base/helper";
import { TextSlidePresenter, TextSlideState } from "./base/text-slide-presenter";
import colors from "./colors";

const mapStateToProps = (state: RootState) => ({
    state: state.game.slideState as DrinkSlideState,
});

const dispatchProps = {
    nextSlide: requestSlideAsync.request,
};

const styles = (theme: Theme) =>
    createStyles({
        root: baseStyles.rootStyle(),
        content: baseStyles.contentStyle(theme),
    });

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    WithStyles<typeof styles> &
    LocalizeContextProps;

function DrinkSlideComponent(props: Props) {
    const { classes, nextSlide, state } = props;
    if (state === null) {
        return <div className={classes.root} />;
    }

    return (
        <div className={classes.root} onClick={() => nextSlide(toTranslator(props))}>
            <div className={classes.content}>
                <Markdown children={state.markdownContent} options={cardMarkdownOptions} />
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
)(DrinkSlideComponent) as React.ComponentType;

interface DrinkSlideState extends TextSlideState {}
export class DrinkSlide extends TextSlidePresenter<DrinkSlideState, DrinkCard> {
    backgroundColor = colors.drink;

    constructor(translator: Translator) {
        super(translator, "DrinkCard", "DrinkSlide");
    }

    public render(): ReactNode {
        return <Component />;
    }

    protected initializeState(markdownContent: string): DrinkSlideState {
        return {
            markdownContent: markdownContent,
        };
    }

    protected initializeFollowUpState(markdownContent: string): DrinkSlideState {
        return {
            markdownContent: markdownContent,
        };
    }
}
