import {
    createStyles,
    CssBaseline,
    WithStyles,
    withStyles,
    WithTheme,
    Theme,
} from "@material-ui/core";
import { RootState } from "DrinctetTypes";
import React from "react";
import { connect } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { compose } from "redux";
import AppDrawerContainer from "./AppDrawerContainer";
import PlayRoute from "../routes/PlayRoute";
import SourcesRoute from "../routes/SourcesRoute";
import ConfigurationRoute from "../routes/ConfigurationRoute";
import GameComponent from "../features/game/components/GameComponent";
import DrinkingGameRoute from "../routes/DrinkingGameRoute";

const styles = (theme: Theme) =>
    createStyles({
        menuButton: {
            marginLeft: -12,
            marginRight: 20,
        },
        grow: {
            flexGrow: 1,
        },
        root: {
            height: "100%",
            display: "flex",
        },
        content: {
            flexGrow: 1,
            display: "flex",
            flexFlow: "column",
        },
        toolbar: {
            ...theme.mixins.toolbar,
            flex: "0 1 auto",
        },
    });

const mapStateToProps = (state: RootState) => ({
    isStarted: state.game.isStarted,
});

type Props = ReturnType<typeof mapStateToProps> & WithStyles<typeof styles> & WithTheme;

function App(props: Props) {
    const { classes, isStarted } = props;
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <div className={classes.root}>
                <Switch>
                    <Route
                        path="/play/game"
                        render={() => (!isStarted ? <Redirect to="/play" /> : <GameComponent />)}
                    />
                    <Route
                        path="/"
                        render={() => (
                            <React.Fragment>
                                <CssBaseline />
                                <AppDrawerContainer />
                                <main className={classes.content}>
                                    <div className={classes.toolbar} />
                                    <div style={{ flex: "1 1 auto" }}>
                                        <Switch>
                                            <Route
                                                exact
                                                path="/"
                                                render={() => <Redirect to="/play" />}
                                            />
                                            <Route path="/play" component={PlayRoute} />
                                            <Route path="/sources" component={SourcesRoute} />
                                            <Route
                                                path="/configuration"
                                                component={ConfigurationRoute}
                                            />
                                            <Route
                                                path="/drinkingGames"
                                                component={DrinkingGameRoute}
                                            />
                                        </Switch>
                                    </div>
                                </main>
                            </React.Fragment>
                        )}
                    />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default compose(
    connect(mapStateToProps),
    withStyles(styles, { withTheme: true }),
)(App) as React.ComponentType;
