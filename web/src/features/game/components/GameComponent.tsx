import { Typography } from "@material-ui/core";
import { RootState } from "DrinctetTypes";
import React, { Component } from "react";
import { connect } from "react-redux";
import { slideComponents } from "../component-registry";
import { requestSlideAsync } from "../actions";
import { withLocalize, LocalizeContextProps } from "react-localize-redux";
import { compose } from "redux";
import GameOptions from "./GameOptions";

const mapStateToProps = (state: RootState) => ({
    selectedSlide: state.game.selectedSlide,
    current: state.game.current,
    activeFollowUp: state.game.activeFollowUp,
});

const dispatchProps = {
    requestSlide: requestSlideAsync.request,
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & LocalizeContextProps;

class GameComponent extends Component<Props> {
    public componentDidMount() {
        this.props.requestSlide();
    }

    public render() {
        const { selectedSlide, translate, current, activeFollowUp } = this.props;

        if (selectedSlide === null) {
            return <Typography variant="h3">Loading game...</Typography>;
        }

        const factory = slideComponents[selectedSlide];
        const slideInitalizer = new factory(x => translate(x) as string);
        let component: React.ReactNode;
        if (activeFollowUp === null) {
            component = slideInitalizer.initialize();
        } else {
            component = slideInitalizer.initializeFollowUp(
                activeFollowUp.selectedCard,
                activeFollowUp.param,
            );
        }

        return (
            <div style={{ width: "100%", height: "100%", position: "relative" }} key={current}>
                {component}
                <div style={{top: 10, right: 10, position: "absolute"}}>
                    <GameOptions />
                </div>
            </div>
        );
    }
}

export default compose(
    connect(
        mapStateToProps,
        dispatchProps,
    ),
    withLocalize
)(GameComponent) as React.ComponentType;
