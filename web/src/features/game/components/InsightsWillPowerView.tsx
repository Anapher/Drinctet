import { createStyles, FormControlLabel, FormGroup, Switch, Typography, WithStyles, withStyles } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { RootState } from "DrinctetTypes";
import * as React from "react";
import { Translate, withLocalize } from "react-localize-redux";
import { connect } from "react-redux";
import { compose } from "redux";
import { setWillPower, setWillPowerLocked } from "../actions";

const mapStateToProps = (state: RootState) => ({
    currentWillPower: state.game.currentWillPower,
    isLocked: state.game.isWillPowerLocked,
});

const dispatchProps = {
    setWillPower,
    setWillPowerLocked,
};

const styles = 
    createStyles({
        toggleContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
        },
    });

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & WithStyles<typeof styles>;

function InsightsWillPowerView({
    currentWillPower,
    isLocked,
    setWillPower,
    setWillPowerLocked,
    classes,
}: Props) {
    return (
        <div>
            <Typography variant="h5" gutterBottom>
                <Translate id="insights.willPower" />
            </Typography>
            <div className={classes.toggleContainer}>
                <ToggleButtonGroup
                    exclusive
                    value={currentWillPower}
                    onChange={(_, y) => setWillPower(y)}
                    children={[1, 2, 3, 4, 5].map(x => (
                        <ToggleButton key={x} value={x}>
                            {x}
                        </ToggleButton>
                    ))}
                />
            </div>
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
    connect(
        mapStateToProps,
        dispatchProps,
    ),
    withLocalize,
    withStyles(styles),
)(InsightsWillPowerView) as React.ComponentType;
