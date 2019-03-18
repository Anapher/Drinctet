import { createStyles, Theme, Typography, withStyles, WithStyles } from "@material-ui/core";
import { RootState } from "DrinctetTypes";
import React from "react";
import { LocalizeContextProps, withLocalize } from "react-localize-redux";
import { connect } from "react-redux";
import { compose } from "redux";
import { FactCard } from "../../../impl/cards/fact-card";
import { setSlideState } from "../actions";
import { nextSlide } from "../game-engine";
import { getRootStyles } from "./base/helper";
import { TextCardComponent } from "./base/TextCardComponent";

const styles = (theme: Theme) =>
    createStyles({
        root: {
            ...getRootStyles(),
            backgroundColor: "#34495e",
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

class DownSlide extends TextCardComponent<FactCard, Props> {
    constructor(props: Props) {
        super(props, "DownCard");
    }

    renderSlide(textComponent: JSX.Element) {
        //, selection: SelectionAlgorithm
        const { classes } = this.props;

        const header = (
            <Typography className={classes.header} variant="h3">
                Auf Ex'
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
)(withLocalize(DownSlide)) as React.ComponentType;
