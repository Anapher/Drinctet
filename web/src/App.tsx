import { RootState } from "DrinctetTypes";
import React from "react";
import { connect } from "react-redux";
import GameComponent from "./features/game/components/GameComponent";
import WelcomeView from "./features/welcome/components/WelcomeView";

const mapStateToProps = (state: RootState) => ({
    isStarted: state.game.isStarted,
});

type Props = ReturnType<typeof mapStateToProps>;

function App({ isStarted }: Props) {
    if (isStarted) {
        return <GameComponent />;
    }

    return <WelcomeView />;
}

export default connect(mapStateToProps)(App);
