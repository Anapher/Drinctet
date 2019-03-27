import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import { RootState } from "DrinctetTypes";
import { Translator } from "GameModels";
import Markdown from "markdown-to-jsx";
import * as React from "react";
import { ReactNode } from "react";
import { LocalizeContextProps, withLocalize } from "react-localize-redux";
import { connect } from "react-redux";
import { compose } from "redux";
import { NoIdeaLosesCard } from "src/impl/cards/no-idea-loses-card";
import { requestSlideAsync } from "../actions";
import { toTranslator } from "../utils";
import { defaultMarkdownOptions, getContentStyles, getRootStyles, spaceHeaderStyles } from "./base/helper";
import { TextSlidePresenter, TextSlideState } from "./base/text-slide-presenter";
import colors from "./colors";

const mapStateToProps = (state: RootState) => ({
    state: state.game.slideState as NoIdeaLosesSlideState,
});

const dispatchProps = {
    nextSlide: requestSlideAsync.request,
};

const styles = (theme: Theme) =>
    createStyles({
        root: getRootStyles(),
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

function NoIdeaLosesSlideComponent(props: Props) {
    const { classes, nextSlide, state } = props;
    if (state === null) {
        return <div className={classes.root} />;
    }

    return (
        <div className={classes.root} onClick={() => nextSlide(toTranslator(props))}>
            <div className={classes.content}>
                <Markdown children={state.markdownContent} options={defaultMarkdownOptions} />
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
)(NoIdeaLosesSlideComponent) as React.ComponentType;

interface NoIdeaLosesSlideState extends TextSlideState {}
export class NoIdeaLosesSlide extends TextSlidePresenter<NoIdeaLosesSlideState, NoIdeaLosesCard> {
    backgroundColor = colors.noIdeaLoses;

    constructor(translator: Translator) {
        super(translator, "NoIdeaLosesCard", "NoIdeaLosesSlide");
    }

    public render(): ReactNode {
        return <Component />;
    }

    protected initializeState(markdownContent: string): NoIdeaLosesSlideState {
        return {
            markdownContent: markdownContent,
        };
    }

    protected initializeFollowUpState(markdownContent: string): NoIdeaLosesSlideState {
        return {
            markdownContent: markdownContent,
        };
    }
}
