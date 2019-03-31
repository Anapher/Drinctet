import {
    AppBar,
    Button,
    createStyles,
    IconButton,
    Theme,
    Toolbar,
    Typography,
    withStyles,
    WithStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import { Route, RouteComponentProps, withRouter } from "react-router";
import PeopleIcon from "@material-ui/icons/People";
import { getRootPath } from "@utils/path";
import { RootState } from "DrinctetTypes";
import * as actions from "../features/game/actions";
import { connect } from "react-redux";

const styles = (theme: Theme) =>
    createStyles({
        menuButton: {
            marginLeft: -12,
            marginRight: 20,
            [theme.breakpoints.up("md")]: {
                display: "none",
            },
        },
        grow: {
            flexGrow: 1,
        },
        appbar: {},
    });

const mapStateToProps = (state: RootState) => ({
    sources: state.settings.sources,
    players: state.play.players,
});

const dispatchProps = {
    startGame: actions.startGame,
};

interface HandlerProps {
    handleToggleDrawer(): void;
}

type Props = WithStyles<typeof styles> &
    HandlerProps &
    LocalizeContextProps &
    RouteComponentProps &
    ReturnType<typeof mapStateToProps> &
    typeof dispatchProps;

function MainAppBar({ classes, handleToggleDrawer, history, sources, players, startGame }: Props) {
    const arePlayersSelected = players.length > 1;
    const areSourcesAdded = sources.filter(x => x.cards !== undefined).length > 0;
    const areSourcesLoading = sources.filter(x => x.isLoading).length > 0;

    const canPlay = arePlayersSelected && areSourcesAdded && !areSourcesLoading;

    return (
        <AppBar position="fixed" className={classes.appbar}>
            <Toolbar>
                <IconButton
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="Menu"
                    onClick={handleToggleDrawer}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" className={classes.grow} noWrap>
                    <Translate id={`menu.${getRootPath(history.location.pathname)}`} />
                </Typography>
                <Route
                    path="/play"
                    render={() => (
                        <React.Fragment>
                            <IconButton
                                color="inherit"
                                onClick={() => history.push("/play/arrangements")}
                            >
                                <PeopleIcon />
                            </IconButton>
                            <Button color="inherit" disabled={!canPlay} onClick={() => startGame(history)}>
                                <Translate id="play.start" />
                            </Button>
                        </React.Fragment>
                    )}
                />
            </Toolbar>
        </AppBar>
    );
}

export default withStyles(styles)(
    withLocalize(
        withRouter(
            connect(
                mapStateToProps,
                dispatchProps,
            )(MainAppBar),
        ),
    ),
);
