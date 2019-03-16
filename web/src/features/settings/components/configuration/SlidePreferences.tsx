import { RootState } from "DrinctetTypes";
import { setSlideWeight } from "../../actions";
import { LocalizeContextProps, withLocalize, Translate } from "react-localize-redux";
import { Typography } from "@material-ui/core";
import ItemPreferences from "./ItemPreferences";
import { connect } from "react-redux";
import * as React from "react";

const mapStateToProps = (state: RootState) => ({
    slides: state.settings.slides,
});

const dispatchProps = {
    setSlideWeight,
};

type Props = LocalizeContextProps & ReturnType<typeof mapStateToProps> & typeof dispatchProps;

function SlidePreferences({ slides, setSlideWeight }: Props) {
    return (
        <div>
            <Typography gutterBottom variant="h5"><Translate id="settings.configuration.slides"/></Typography>
            <ItemPreferences items={slides} onChangeWeight={x => setSlideWeight(x)} />
        </div>
    );
}

export default connect(
    mapStateToProps,
    dispatchProps,
)(withLocalize(SlidePreferences));
