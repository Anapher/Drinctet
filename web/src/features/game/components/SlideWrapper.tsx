import { Typography } from "@material-ui/core";
import { RootState } from "DrinctetTypes";
import React from "react";
import { LocalizeContextProps, withLocalize } from "react-localize-redux";
import { connect } from "react-redux";
import { compose } from "redux";
import { slideComponents } from "../component-registry";
import { toTranslator } from "../utils";
import { useSpring, animated } from "react-spring";

const mapStateToProps = (state: RootState) => ({
    selectedSlide: state.game.selectedSlide,
});

type Props = ReturnType<typeof mapStateToProps> & LocalizeContextProps;

function SlideWrapper(props: Props) {
    const { selectedSlide } = props;

    if (selectedSlide === null) {
        return <Typography variant="h3">Loading game...</Typography>;
    }

    const factory = slideComponents[selectedSlide];
    const slideInitalizer = new factory(toTranslator(props));
    const springProps = useSpring({backgroundColor: slideInitalizer.backgroundColor, height: "100%"});

    return <animated.div style={springProps}>{slideInitalizer.render()}</animated.div>;
}

export default compose(
    connect(mapStateToProps),
    withLocalize,
)(SlideWrapper) as React.ComponentType;
