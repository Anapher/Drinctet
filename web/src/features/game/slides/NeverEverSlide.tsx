import { TextSlidePresenter, TextSlideState } from "./base/text-slide-presenter";
import {
    getRootStyles,
    defaultMarkdownOptions,
    getContentStyles,
    spaceHeaderStyles,
} from "./base/helper";
import { RootState } from "DrinctetTypes";
import { requestSlideAsync } from "../actions";
import { ReactNode } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { createStyles, Theme, WithStyles, Typography, withStyles } from "@material-ui/core";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import Markdown from "markdown-to-jsx";
import * as React from "react";
import { NeverEverCard } from "src/impl/cards/never-ever-card";
import { SelectionAlgorithm } from "@core/selection/selection-algorithm";
import { SelectedPlayer, Translator } from "GameModels";
import { TextCard } from "@core/cards/text-card";
import { toTranslator } from "../utils";
import { useSpring, animated } from "react-spring";

const mapStateToProps = (state: RootState) => ({
    state: state.game.slideState as State,
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
        instruction: {
            color: "white",
        },
        spaceHeader: spaceHeaderStyles(theme),
    });

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    WithStyles<typeof styles> &
    LocalizeContextProps;

function NeverEverComponent(props: Props) {
    const { classes, nextSlide, state } = props;
    if (state === null) {
        return <div className={classes.root} />;
    }

    const header = (
        <Typography className={classes.header} variant="h5">
            <Translate id="slides.neverever.title" />
        </Typography>
    );

    const springProps = useSpring({
        opacity: 1,
        transform: "rotate(0deg)",
        from: { opacity: 0, transform: "rotate(20deg)" },
    });

    return (
        <div className={classes.root} onClick={() => nextSlide(toTranslator(props))}>
            <animated.div style={springProps} className={classes.content}>
                {header}
                <Typography variant="h5" className={classes.instruction}>
                    <Markdown children={state.markdownContent} options={defaultMarkdownOptions} />
                </Typography>
                <div style={{ position: "relative" }}>
                    <Typography
                        style={{ marginTop: 20 }}
                        className={classes.instruction}
                        variant="h6"
                    >
                        <Translate id="slides.neverever.instruction" data={{ sips: state.sips }} />
                    </Typography>
                </div>
            </animated.div>
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
)(NeverEverComponent) as React.ComponentType;

interface State extends TextSlideState {
    sips: number;
}

export class NeverEverSlide extends TextSlidePresenter<State, NeverEverCard> {
    backgroundColor = "#d35400";

    constructor(translator: Translator) {
        super(translator, "NeverEverCard", "NeverEverSlide");
    }

    render(): ReactNode {
        return <Component />;
    }

    protected initializeState(
        markdownContent: string,
        _card: NeverEverCard,
        _players: SelectedPlayer[],
        selection: SelectionAlgorithm,
    ): State {
        return {
            markdownContent: markdownContent,
            sips: selection.getSips(2),
        };
    }

    selectText(selection: SelectionAlgorithm, selectedCard: TextCard): string {
        return "..." + super.selectText(selection, selectedCard);
    }

    protected initializeFollowUpState(markdownContent: string): State {
        return {
            markdownContent: markdownContent,
            sips: 0,
        };
    }
}
