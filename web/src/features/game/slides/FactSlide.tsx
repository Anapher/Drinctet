import { TextCard } from "@core/cards/text-card";
import { SelectionAlgorithm } from "@core/selection/selection-algorithm";
import { createStyles, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import { RootAction, RootState } from "DrinctetTypes";
import { SelectedPlayer, Translator } from "GameModels";
import Markdown from "markdown-to-jsx";
import * as React from "react";
import { ReactNode } from "react";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import { connect } from "react-redux";
import { compose } from "redux";
import { FactCard } from "src/impl/cards/fact-card";
import * as actions from "../actions";
import { requestSlideAsync } from "../actions";
import { toTranslator } from "../utils";
import { defaultMarkdownOptions, getContentStyles, getRootStyles, spaceHeaderStyles } from "./base/helper";
import { TextSlidePresenter, TextSlideState } from "./base/text-slide-presenter";
import { CardRef } from "@core/cards/card-ref";

const mapStateToProps = (state: RootState) => ({
    state: state.game.slideState as FactSlideState,
});

const dispatchProps = {
    nextSlide: requestSlideAsync.request,
};

const styles = (theme: Theme) =>
    createStyles({
        root: {
            ...getRootStyles(),
            backgroundColor: "#3498db",
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

function FactSlideComponent(props: Props) {
    const { classes, nextSlide, state } = props;
    if (state === null) {
        return <div className={classes.root} />;
    }

    const header = (
        <Typography className={classes.header} variant="h3">
            <Translate id={`slides.fact.title${state.isFollowUp ? ".follow" : ""}`} />
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

interface FactSlideFollowUpParam {
    mode: FactSlideMode;
    players: SelectedPlayer[];
}

const Component = compose(
    connect(
        mapStateToProps,
        dispatchProps,
    ),
    withStyles(styles),
    withLocalize
)(FactSlideComponent) as React.ComponentType;

type FactSlideMode = "singleplayer" | "multiplayer";
const availableFactSlideModes: FactSlideMode[] = ["singleplayer", "multiplayer"];

interface FactSlideState extends TextSlideState {
    isFollowUp: boolean;
    mode: FactSlideMode;
}

export class FactSlide extends TextSlidePresenter<FactSlideState, FactCard> {
    private selectedMode: FactSlideMode;
    private players?: SelectedPlayer[];

    constructor(translator: Translator) {
        super(translator, "FactCard", "FactSlide");

        this.selectedMode =
            availableFactSlideModes[Math.floor(availableFactSlideModes.length * Math.random())];
    }

    render(): ReactNode {
        return <Component />;
    }

    selectText(selection: SelectionAlgorithm, selectedCard: TextCard): string {
        const cardText = super.selectText(selection, selectedCard);
        const instruction = this.translator.translate(`slides.fact.${this.selectedMode}`);

        return `#### ${instruction}\n${cardText}`;
    }

    selectFollowUpText(
        _selection: SelectionAlgorithm,
        selectedCard: FactCard,
        param: any,
    ): { text: string; players?: SelectedPlayer[] } {
        const { mode, players } = param as FactSlideFollowUpParam;
        const { isTrueFact } = selectedCard;

        const text = this.translator.translate(`slides.fact.${mode}.${isTrueFact}`);
        return { text, players };
    }

    protected initializeState(
        markdownContent: string,
        _card: FactCard,
        players: SelectedPlayer[],
    ): FactSlideState {
        this.players = players;

        return {
            isFollowUp: false,
            markdownContent: markdownContent,
            mode: this.selectedMode,
        };
    }

    protected initializeFollowUpState(markdownContent: string, param: any): FactSlideState {
        const { mode } = param as FactSlideFollowUpParam;
        return {
            isFollowUp: true,
            markdownContent: markdownContent,
            mode,
        };
    }

    protected initializeCard(card: FactCard, cardRef: CardRef): RootAction[] {
        return [...super.initializeCard(card, cardRef), actions.enqueueFollowUp({
            due: new Date(),
            selectedCard: cardRef,
            slideType: "FactSlide",
            param: {
                mode: this.selectedMode,
                players: this.players,
            } as FactSlideFollowUpParam,
        })];
    }
}
