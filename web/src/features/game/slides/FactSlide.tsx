import { withStyles } from "@material-ui/core";
import { RootState } from "DrinctetTypes";
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { FactCard } from "../../../impl/cards/fact-card";
import { nextSlide } from "../actions";
import { drawCard } from "../game-engine";

const styles = {
    root: {
        backgroundColor: "#3498db",
        height: "100%",
    },
};

const mapStateToProps = (state: RootState) => ({
    isInGame: state.game.isStarted,
    selectedCard: state.game.selectedCard,
    settings: state.settings,
});

const dispatchProps = {
    nextSlide,
};

type StyleProps = {
    classes: { root: string };
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & StyleProps;

class FactSlide extends Component<Props> {
    componentDidMount() {
        if (this.props.selectedCard === null) {
            drawCard("FactCard");
        }
    }

    render() {
        const { classes, selectedCard } = this.props;

        if (selectedCard === null) {
            return "Loading...";
        }

        const factCard = selectedCard as FactCard;

        return <div className={classes.root}>{factCard.content[0].translations[0].content}</div>;
    }
}

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        dispatchProps,
    ),
)(FactSlide) as React.ComponentType;
