import { ConnectedRouter } from "connected-react-router";
import { RootState } from "DrinctetTypes";
import React from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import WelcomeView from "./features/welcome/components/WelcomeView";
import { history } from "./store/root-reducer";
import GameComponent from "./features/game/components/GameComponent";

const mapStateToProps = (state: RootState) => ({
    isStarted: state.game.isStarted,
});

type Props = ReturnType<typeof mapStateToProps>;

function App({ isStarted }: Props) {
    return (
        <ConnectedRouter history={history}>
            <Switch>
                <Route exact path="/" component={WelcomeView} />
                <Route
                    path="/game"
                    render={() => (!isStarted ? <Redirect to="/" /> : (<GameComponent />))}
                />
            </Switch>
        </ConnectedRouter>
    );
}

export default connect(mapStateToProps)(App);
