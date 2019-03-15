import { withStyles } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import { RootState } from "DrinctetTypes";
import * as React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { startGame } from "../../game/actions";

const styles = {
    root: {
        color: "white",
        width: "100%",
        backgroundColor: "#e74c3c",
        "&:hover": {
            backgroundColor: "#c0392b",
        },
    },
};

const mapStateToProps = (state: RootState) => ({
    settings: state.settings,
});

const dispatchProps = {
    startGame,
};

type StyleProps = {
    classes: { root: string };
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & StyleProps;

function StartButton(props: Props) {
    const { classes, startGame, settings } = props;

    const arePlayersSelected = settings.players.length > 0;
    const areSourcesAdded = settings.sources.filter(x => x.cards !== undefined).length > 0;
    const areSourcesLoading = settings.sources.filter(x => x.isLoading).length > 0;

    return (
        <Fab
            variant="extended"
            size="large"
            disabled={!arePlayersSelected || !areSourcesAdded || areSourcesLoading}
            classes={{ root: classes.root }}
            onClick={() => startGame()}
        >
            Start Game
        </Fab>
    );
}

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        dispatchProps,
    ),
)(StartButton) as React.ComponentType;
