import { createStyles, withStyles, WithStyles, Typography, Theme } from "@material-ui/core";
import { RootState } from "DrinctetTypes";
import React from "react";
import { LocalizeContextProps, withLocalize } from "react-localize-redux";
import { connect } from "react-redux";
import { compose } from "redux";
import { FactCard } from "../../../impl/cards/fact-card";
import { setSlideState } from "../actions";
import { TextCardComponent } from "./base/TextCardComponent";
import { SelectionAlgorithm } from "@core/selection/selection-algorithm";
import { TextCard } from "@core/cards/text-card";
import { nextSlide, enqueueFollowUp } from "../game-engine";
import { getRootStyles } from "./base/helper";
import { SelectedPlayer } from "GameModels";

const styles = (theme: Theme) =>
    createStyles({
        root: {
            ...getRootStyles(),
            backgroundColor: "#3498db",
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
        },
    });

const mapStateToProps = (state: RootState) => ({
    selectedCard: state.game.selectedCard,
    selectedPlayers: state.game.selectedPlayers,
    followUp: state.game.activeFollowUp,
    currentSeed: state.game.currentSeed,
});

const dispatchProps = {
    setSlideState,
};

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    WithStyles<typeof styles> &
    LocalizeContextProps;

class FactSlide extends TextCardComponent<FactCard, Props> {
    constructor(props: Props) {
        super(props, "FactCard");
    }

    selectText(selection: SelectionAlgorithm, selectedCard: TextCard): string {
        const cardText = super.selectText(selection, selectedCard);

        const rand = selection.getRandom();

        const availableInstructions = ["singleplayer", "multiplayer"];
        const selectedInstruction = availableInstructions[Math.floor(rand * availableInstructions.length)];
        const instruction = this.props.translate(`slides.fact.${selectedInstruction}`) as string;

        return `### ${instruction}\n${cardText}`;
    }

    didInitialize(card: FactCard, players: SelectedPlayer[]) {
        enqueueFollowUp(new Date(), card, players);
    }

    selectFollowUpText(_selection: SelectionAlgorithm, card: FactCard) {
        if (card.isTrueFact) {
            return "Der Fakt ist **wahr**. Wenn du falsch geraten hast, trink [sips]";
        } else {
            return "Der Fakt ist **falsch**. Wenn du falsch geraten hast, trink [sips]";
        }
    }

    renderSlide(textComponent: JSX.Element) {
        //, selection: SelectionAlgorithm
        const { classes } = this.props;

        const header = (
            <Typography className={classes.header} variant="h3">
                Fakt?!
            </Typography>
        );

        return (
            <div className={classes.root} onClick={() => nextSlide()}>
                <div className={classes.content}>
                    {header}
                    {textComponent}
                    <div style={{ opacity: 0 }}>{header}</div>
                </div>
            </div>
        );
    }
}

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        dispatchProps,
    ),
)(withLocalize(FactSlide)) as React.ComponentType;
