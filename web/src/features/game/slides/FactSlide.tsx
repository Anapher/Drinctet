import { withStyles } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { RootState } from "DrinctetTypes";
import { nextSlide } from "../actions";

const styles = {
    root: {},
};

const mapStateToProps = (state: RootState) => ({
    game: state.game,
    settings: state.settings,
});

const dispatchProps = {
    nextSlide,
};

type StyleProps = {
    classes: { root: string };
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & StyleProps;

class FactSlide extends Component<Props> {
    componentDidMount() {
        this.;
    }

    render() {
        const { classes } = this.props;
        return <div />;
    }
}

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        dispatchProps,
    ),
)(FactSlide) as React.ComponentType;
