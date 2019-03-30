import { createStyles, Theme, WithStyles, withStyles, Typography } from "@material-ui/core";
import { RootState } from "DrinctetTypes";
import { Translator } from "GameModels";
import Markdown from "markdown-to-jsx";
import * as React from "react";
import { ReactNode } from "react";
import { LocalizeContextProps, withLocalize, Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { compose } from "redux";
import { GroupGameCard } from "src/impl/cards/group-game-card";
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

const mapStateToProps = (state: RootState) => ({
    state: state.game.slideState as GroupGameSlideState,
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

function GroupGameSlideComponent(props: Props) {
    const { classes, nextSlide, state } = props;
    if (state === null) {
        return <div className={classes.root} />;
    }

    const header = (
        <Typography className={classes.header} variant="h3">
            <Translate id="slides.groupgame.title" />
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
)(GroupGameSlideComponent) as React.ComponentType;

interface GroupGameSlideState extends TextSlideState {}
export class GroupGameSlide extends TextSlidePresenter<GroupGameSlideState, GroupGameCard> {
    backgroundColor = colors.groupGame;

    constructor(translator: Translator) {
        super(translator, "GroupGameCard", "GroupGameSlide");
    }

    public render(): ReactNode {
        return <Component />;
    }

    protected initializeState(markdownContent: string): GroupGameSlideState {
        return {
            markdownContent: markdownContent,
        };
    }

    protected initializeFollowUpState(markdownContent: string): GroupGameSlideState {
        return {
            markdownContent: markdownContent,
        };
    }
}
