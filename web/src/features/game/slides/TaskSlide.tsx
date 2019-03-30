import { createStyles, Theme, WithStyles, withStyles, Typography } from "@material-ui/core";
import { RootState } from "DrinctetTypes";
import { Translator } from "GameModels";
import Markdown from "markdown-to-jsx";
import * as React from "react";
import { ReactNode } from "react";
import { LocalizeContextProps, withLocalize, Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { compose } from "redux";
import { TaskCard } from "src/impl/cards/task-card";
import { requestSlideAsync } from "../actions";
import { toTranslator } from "../utils";
import {
    defaultMarkdownOptions,
    getContentStyles,
    getRootStyles,
    spaceHeaderStyles,
    getHeaderStyles,
} from "./base/helper";
import { TextSlidePresenter, TextSlideState } from "./base/text-slide-presenter";
import colors from "./colors";
import { SelectionAlgorithm } from "@core/selection/selection-algorithm";
import { TextCard } from "@core/cards/text-card";

const mapStateToProps = (state: RootState) => ({
    state: state.game.slideState as TaskSlideState,
});

const dispatchProps = {
    nextSlide: requestSlideAsync.request,
};

const styles = (theme: Theme) =>
    createStyles({
        root: getRootStyles(),
        content: getContentStyles(theme),
        header: {
            ...getHeaderStyles(theme),
            marginBottom: 15,
        },
        spaceHeader: spaceHeaderStyles(theme),
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
        <Typography className={classes.header} variant="h3">
            <Translate id="slides.task.title" />
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

        return "[Player99]: " + task + " " + this.translator.translate("slides.task.instruction");
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
