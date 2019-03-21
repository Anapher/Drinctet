import * as React from "react";
import { Typography, Switch, FormGroup, FormControlLabel } from "@material-ui/core";
import { Translate, withLocalize } from "react-localize-redux";
import { Slider } from "@material-ui/lab";
import { RootState } from "DrinctetTypes";
import { setWillPower, setWillPowerLocked } from "../actions";
import { compose } from "redux";
import { connect } from "react-redux";

const mapStateToProps = (state: RootState) => ({
    currentWillPower: state.game.currentWillPower,
    isLocked: state.game.isWillPowerLocked,
});

const dispatchProps = {
    setWillPower,
    setWillPowerLocked,
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

function InsightsWillPowerView({
    currentWillPower,
    isLocked,
    setWillPower,
    setWillPowerLocked,
}: Props) {
    return (
        <div>
            <Typography variant="h5" gutterBottom>
                <Translate id="insights.willPower" />
            </Typography>
            <Slider min={1} max={5} value={currentWillPower} onChange={(_, x) => setWillPower(x)} />
            <FormGroup row>
                <FormControlLabel
                    control={
                        <Switch checked={isLocked} onChange={(_, x) => setWillPowerLocked(x)} />
                    }
                    label={<Translate id="insights.lockWillPower" />}
                />
            </FormGroup>
        </div>
    );
}

export default compose(
    connect(mapStateToProps, dispatchProps),
    withLocalize
)(InsightsWillPowerView) as React.ComponentType;
