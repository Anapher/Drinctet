import { RootState } from "DrinctetTypes";
import React, { Component } from "react";
import { LocalizeContextProps, withLocalize } from "react-localize-redux";
import { connect, DispatchProp } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";
import { compose } from "redux";
import { OpeningSlide } from "../slides/OpeningSlide";
import GameOptions from "./GameOptions";
import InsightsDialog from "./InsightsDialog";
import SettingsDialog from "./SettingsDialog";
import SlideWrapper from "./SlideWrapper";
import * as actions from "../actions";

const mapStateToProps = (state: RootState) => ({
    current: state.game.currentSlideStatus,
});

type Props = LocalizeContextProps & ReturnType<typeof mapStateToProps> & DispatchProp;

class GameComponent extends Component<Props> {
    public componentDidMount() {
        const openingSlide = new OpeningSlide();
        const slideActions = openingSlide.initialize();

        this.props.dispatch(
            actions.requestSlideAsync.success({
                slide: openingSlide.slideType,
                insights: null,
            }),
        );

        for (const action of slideActions) {
            this.props.dispatch(action);
        }
    }

    public render() {
        return (
            <div
                style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}
            >
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
    connect(mapStateToProps),
    withLocalize,
)(GameComponent) as React.ComponentType;
