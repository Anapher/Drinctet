import { TextCard } from "@core/cards/text-card";
import { SelectionAlgorithm } from "@core/selection/selection-algorithm";
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
import { TaskCard } from "src/impl/cards/task-card";
import { requestSlideAsync } from "../actions";
import { toTranslator } from "../utils";
import * as baseStyles from "./base/helper";
import { TextSlidePresenter, TextSlideState } from "./base/text-slide-presenter";
import colors from "./colors";

const mapStateToProps = (state: RootState) => ({
    state: state.game.slideState as TaskSlideState,
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

function TaskSlideComponent(props: Props) {
    const { classes, nextSlide, state } = props;
    if (state === null) {
        return <div className={classes.root} />;
    }

    const header = (
        <Typography className={classes.header} variant="h3" color="inherit">
            <Translate id="slides.task.title" />
        </Typography>
    );

    return (
        <div className={classes.root} onClick={() => nextSlide(toTranslator(props))}>
            <div className={classes.content}>
                {header}
                <Markdown children={state.markdownContent} options={cardMarkdownOptions} />
                <Typography style={{ opacity: 0.8, marginTop: 10 }} color="inherit">
                    <Translate id="slides.task.instruction" />
                </Typography>
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
)(TaskSlideComponent) as React.ComponentType;

interface TaskSlideState extends TextSlideState {}
export class TaskSlide extends TextSlidePresenter<TaskSlideState, TaskCard> {
    backgroundColor = colors.task;

    constructor(translator: Translator) {
        super(translator, "TaskCard", "TaskSlide");
    }

    public render(): ReactNode {
        return <Component />;
    }

    selectText(selection: SelectionAlgorithm, selectedCard: TextCard): string {
        let task = super.selectText(selection, selectedCard);
        if (/[A-Z-a-z]$/g.test(task)) {
            task = task + ".";
        }

        return "[Player99]: " + task;
    }

    protected initializeState(markdownContent: string): TaskSlideState {
        return {
            markdownContent: markdownContent,
        };
    }

    protected initializeFollowUpState(markdownContent: string): TaskSlideState {
        return {
            markdownContent: markdownContent,
        };
    }
}
