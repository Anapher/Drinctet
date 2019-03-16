import { Typography } from "@material-ui/core";
import { RootState } from "DrinctetTypes";
import React, { Component, ComponentType } from "react";
import { connect } from "react-redux";
import { slideComponents } from "../component-registry";
import { nextSlide } from "../game-engine";

const mapStateToProps = (state: RootState) => ({
    selectedSlide: state.game.selectedSlide,
});

const dispatchProps = {};

type State = {
    displayedSlide: string | undefined;
    slide: ComponentType | undefined;
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

class GameComponent extends Component<Props, State> {
    readonly state = { displayedSlide: undefined, slide: undefined };

    public componentDidMount() {
        nextSlide();
    }

    public render() {
        if (this.props.selectedSlide === null) {
            return <Typography variant="h3">Loading game...</Typography>;
        }

        const slideComponent = slideComponents[this.props.selectedSlide].component();
        return slideComponent;
    }
}

export default connect(
    mapStateToProps,
    dispatchProps,
)(GameComponent);
