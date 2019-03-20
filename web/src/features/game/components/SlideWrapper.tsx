import React, { Component } from "react";

import { slideComponents } from "../component-registry";
import { Typography } from "@material-ui/core";
import { RootState } from "DrinctetTypes";
import { compose } from "redux";
import { connect } from "react-redux";
import { withLocalize, LocalizeContextProps } from "react-localize-redux";
import { toTranslator } from "../utils";

const mapStateToProps = (state: RootState) => ({
    selectedSlide: state.game.selectedSlide,
});

type Props = ReturnType<typeof mapStateToProps> & LocalizeContextProps;

class SlideWrapper extends Component<Props> {
    render() {
        const { selectedSlide } = this.props;

        if (selectedSlide === null) {
            return <Typography variant="h3">Loading game...</Typography>;
        }
        
        const factory = slideComponents[selectedSlide];
        const slideInitalizer = new factory(toTranslator(this.props));

        return slideInitalizer.render();
    }
}

export default compose(
    connect(mapStateToProps),
    withLocalize,
)(SlideWrapper) as React.ComponentType;
