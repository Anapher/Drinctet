import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import GameOptions from "./GameOptions";
import { Route, Switch, withRouter } from "react-router-dom";
import SettingsDialog from "./SettingsDialog";
import InsightsDialog from "./InsightsDialog";
import SlideWrapper from "./SlideWrapper";
import { requestSlideAsync } from "../actions";
import { withLocalize, LocalizeContextProps } from "react-localize-redux";
import { toTranslator } from "../utils";
import { RootState } from "DrinctetTypes";

const dispatchProps = {
    requestSlide: requestSlideAsync.request,
};

const mapStateToProps = (state: RootState) => ({
    current: state.game.currentSlideStatus,
});

type Props = typeof dispatchProps & LocalizeContextProps & ReturnType<typeof mapStateToProps>;

class GameComponent extends Component<Props> {
    public componentDidMount() {
        this.props.requestSlide(toTranslator(this.props));
    }

    public render() {
        return (
            <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
                <SlideWrapper />
                <div style={{ top: 10, right: 10, position: "absolute" }}>
                    <GameOptions />
                </div>
                <Switch>
                    <Route path="/game/settings" component={SettingsDialog} />
                    <Route path="/game/insights" component={InsightsDialog} />
                </Switch>
            </div>
        );
    }
}

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        dispatchProps,
    ),
    withLocalize,
)(GameComponent) as React.ComponentType;
