import { Typography } from "@material-ui/core";
import { RootState } from "DrinctetTypes";
import React, { Component, ComponentType } from "react";
import { connect } from "react-redux";
import { slideComponents } from "../component-registry";
import { requestSlideAsync } from "../actions";
import { withLocalize, LocalizeContextProps } from "react-localize-redux";

const mapStateToProps = (state: RootState) => ({
    selectedSlide: state.game.selectedSlide,
    current: state.game.current,
    activeFollowUp: state.game.activeFollowUp,
});

const dispatchProps = {
    requestSlide: requestSlideAsync.request,
};

type State = {
    displayedSlide: string | undefined;
    slide: ComponentType | undefined;
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & LocalizeContextProps;

class GameComponent extends Component<Props, State> {
    readonly state = { displayedSlide: undefined, slide: undefined };

    public componentDidMount() {
        this.props.requestSlide();
    }

    public render() {
        const { selectedSlide, translate, current, activeFollowUp } = this.props;

        if (selectedSlide === null) {
            return <Typography variant="h3">Loading game...</Typography>;
        }

        const factory = slideComponents[selectedSlide];
        const slideInitalizer = factory(x => translate(x) as string);
        let component: React.ReactNode;
        if (activeFollowUp === null) {
            component = slideInitalizer.initialize();
        } else {
            component = slideInitalizer.initializeFollowUp(activeFollowUp.selectedCard, activeFollowUp.param);
        }

        return (
            <div style={{ width: "100%", height: "100%" }} key={current}>
                {component}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    dispatchProps,
)(withLocalize(GameComponent));
