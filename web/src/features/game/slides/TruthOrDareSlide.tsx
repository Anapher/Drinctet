import { PlayerSetting } from "@core/cards/player-setting";
import { TextCard } from "@core/cards/text-card";
import { PlayerInfo } from "@core/player-info";
import { PlayerSelectionInsights } from "@core/selection/insights";
import { MelinaAlgorithm } from "@core/selection/melina-algorithm";
import {
    Button,
    createStyles,
    Paper,
    Theme,
    Typography,
    WithStyles,
    withStyles,
} from "@material-ui/core";
import { cardMarkdownOptions } from "@utils/material-markdown";
import { RootAction, RootState } from "DrinctetTypes";
import { Translator } from "GameModels";
import Markdown from "markdown-to-jsx";
import * as React from "react";
import { ReactNode } from "react";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import { connect } from "react-redux";
import { animated, useSpring } from "react-spring";
import { compose } from "redux";
import * as actions from "../actions";
import * as gameEngine from "../game-engine";
import { getRandomSelectionAlgorithm } from "../game-engine";
import { toTranslator } from "../utils";
import * as baseStyles from "./base/helper";
import { SlidePresenter } from "./base/slide-presenter";
import { formatText, selectText } from "./base/text-slide-presenter";
import colors from "./colors";
import { CardRef } from "@core/cards/card-ref";

const mapStateToProps = (state: RootState) => ({
    state: state.game.slideState as TruthOrDareSlideState,
    players: state.play.players,
});

const dispatchProps = {
    nextSlide: actions.requestSlideAsync.request,
    setState: actions.setSlideState,
    applyCard: actions.applyCard,
};

const styles = (theme: Theme) =>
    createStyles({
        root: {
            ...baseStyles.rootStyle(),
            cursor: "default",
        },
        clickableRoot: {
            ...baseStyles.rootStyle(),
        },
        content: baseStyles.contentStyle(theme),
        header: {
            marginBottom: 15,
            [theme.breakpoints.down("sm")]: {
                fontSize: "1.5em",
            },
        },
        spaceHeader: {
            visibility: "hidden",
            marginTop: 15,
        },
        questionPaper: {
            padding: theme.spacing.unit * 2,
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing.unit * 50,
            },
            [theme.breakpoints.down("xs")]: {
                width: "80vw",
                margin: theme.spacing.unit,
            },
        },
        questionButtonsContainer: {
            display: "flex",
            justifyContent: "flex-end",
            marginTop: theme.spacing.unit,
        },
        refuseMessage: {
            opacity: 0.8,
            marginTop: 10,
        },
    });

type MappedActions = typeof dispatchProps;

type Props = MappedActions &
    ReturnType<typeof mapStateToProps> &
    WithStyles<typeof styles> &
    LocalizeContextProps;

function QuestionComponent(props: Props) {
    const { state, players, nextSlide, classes } = props;
    const player = players.find(x => x.id === state.selectedPlayer);
    if (player === undefined) {
        nextSlide(toTranslator(props));
        return <div />;
    }

    const select = (decision: TruthOrDare) =>
        new TruthOrDareSlide(toTranslator(props)).select(decision, props, player);

    const springProps = useSpring({
        opacity: 1,
        transform: "scale(1, 1)",
        from: { opacity: 0, transform: "scale(2.5, 2.5)" },
    });

    return (
        <animated.div style={springProps}>
            <Paper className={classes.questionPaper}>
                <Typography style={{ fontSize: 17, fontWeight: 500 }}>
                    <Translate
                        id="slides.truthordare.playerTruthordare"
                        data={{ name: player.name }}
                    />
                </Typography>
                <div className={classes.questionButtonsContainer}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginRight: 15 }}
                        onClick={() => select("Truth")}
                    >
                        <Translate id="slides.truthordare.truth" />
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => select("Dare")}>
                        <Translate id="slides.truthordare.dare" />
                    </Button>
                </div>
            </Paper>
        </animated.div>
    );
}

function DareComponent(props: Props) {
    const { classes, nextSlide, state } = props;

    const header = (
        <Typography className={classes.header} variant="h5" color="inherit">
            <Translate id="slides.truthordare.truth" /> <Translate id="slides.truthordare.or" />{" "}
            <b>
                <Translate id="slides.truthordare.dare" />
            </b>
        </Typography>
    );

    return (
        <div className={classes.clickableRoot} onClick={() => nextSlide(toTranslator(props))}>
            <div className={classes.content}>
                {header}
                <Markdown children={state.markdownContent!} options={cardMarkdownOptions} />
                <Typography className={classes.refuseMessage} color="inherit">
                    <Translate id="slides.truthordare.refuseDare" />
                </Typography>
                <div className={classes.spaceHeader}>{header}</div>
            </div>
        </div>
    );
}

function TruthComponent(props: Props) {
    const { classes, nextSlide, state } = props;
    const header = (
        <Typography className={classes.header} variant="h4" color="inherit">
            <b>
                <Translate id="slides.truthordare.truth" />
            </b>{" "}
            <Translate id="slides.truthordare.or" /> <Translate id="slides.truthordare.dare" />
        </Typography>
    );

    return (
        <div className={classes.clickableRoot} onClick={() => nextSlide(toTranslator(props))}>
            <div className={classes.content}>
                {header}
                <Markdown children={state.markdownContent!} options={cardMarkdownOptions} />
                <Typography className={classes.refuseMessage} color="inherit">
                    <Translate id="slides.truthordare.refuseTruth" />
                </Typography>
                <div className={classes.spaceHeader}>{header}</div>
            </div>
        </div>
    );
}

function TruthOrDareComponent(props: Props) {
    const { classes, state } = props;
    if (state === null) {
        return <div className={classes.root} />;
    }

    if (state.isDeciding) {
        return <div className={classes.root}>{QuestionComponent(props)}</div>;
    }

    if (state.decision === "Dare") {
        return DareComponent(props);
    } else {
        return TruthComponent(props);
    }
}

const Component = compose(
    connect(
        mapStateToProps,
        dispatchProps,
    ),
    withStyles(styles),
    withLocalize,
)(TruthOrDareComponent) as React.ComponentType;

type TruthOrDare = "Truth" | "Dare";

interface TruthOrDareSlideState {
    selectedPlayer: string;
    isDeciding: boolean;
    decision?: TruthOrDare;
    markdownContent?: string;
}

export class TruthOrDareSlide implements SlidePresenter {
    backgroundColor = colors.truthOrDare;

    constructor(private translator: Translator) {}

    public slideType = "TruthOrDareSlide";
    public requiredCards = ["TaskCard", "QuestionCard"];

    public select(decision: TruthOrDare, actions: MappedActions, player: PlayerInfo) {
        const selection = gameEngine.getRandomSelectionAlgorithm() as MelinaAlgorithm;
        const cardType = decision === "Dare" ? "TaskCard" : "QuestionCard";

        let formatted: string | null = null;
        let cardRef: CardRef;

        for (let i = 0; i < 5; i++) {
            cardRef = selection.selectCard(cardType);
            const card = cardRef.card as TextCard;

            const selectedText = selectText(selection, card, this.translator);
            const text = `#### ${this.translator.translate(
                "slides.truthordare.instruction",
            )}\n${selectedText}`;

            try {
                const result = formatText(
                    text,
                    card,
                    [{ index: 99, player }],
                    selection,
                    this.translator,
                );

                formatted = result.formatted;
            } catch (error) {
                // likely not enough players
                continue;
            }
        }

        if (formatted === null) {
            actions.nextSlide(this.translator);
            return;
        }

        actions.applyCard(cardRef!);

        const state: TruthOrDareSlideState = {
            isDeciding: false,
            selectedPlayer: player.id,
            markdownContent: formatted,
            decision,
        };
        actions.setState({ state, insights: selection.insights.playerSelection });
    }

    initialize(): RootAction[] {
        const selection = getRandomSelectionAlgorithm() as MelinaAlgorithm;
        const player = gameEngine.selectPlayers(
            selection,
            [new PlayerSetting(1, "None")],
            [],
            [],
        )[0].player;

        return [
            this.setState(
                { isDeciding: true, selectedPlayer: player.id },
                selection.insights.playerSelection,
            ),
        ];
    }

    private setState(
        state: TruthOrDareSlideState,
        insights: PlayerSelectionInsights | null = null,
    ): RootAction {
        return actions.setSlideState({ state, insights });
    }

    initializeFollowUp(): RootAction[] {
        throw new Error("Method not supported.");
    }

    render(): ReactNode {
        return <Component />;
    }
}
