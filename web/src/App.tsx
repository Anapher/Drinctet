import { RootState } from "DrinctetTypes";
import React from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import WelcomeView from "./features/welcome/components/WelcomeView";
import GameComponent from "./features/game/components/GameComponent";

const mapStateToProps = (state: RootState) => ({
    isStarted: state.game.isStarted,
});

type Props = ReturnType<typeof mapStateToProps>;

function App({ isStarted }: Props) {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={WelcomeView} />
                <Route
                    path="/game"
                    render={() => (!isStarted ? <Redirect to="/" /> : (<GameComponent />))}
                />
            </Switch>
        </BrowserRouter>
    );
}

export default connect(mapStateToProps)(App);
