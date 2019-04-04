import { Button, Grid } from "@material-ui/core";
import React from "react";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import * as actions from "../../actions";

const dispatchProps = {
    resetWeights: actions.resetWeights,
    resetAll: actions.resetAll,
};

type Props = typeof dispatchProps

function ResetSettings({resetWeights, resetAll}: Props) {
    return (
        <Grid container spacing={16}>
            <Grid item>
                <Button color="secondary" variant="outlined" onClick={resetWeights}>
                    <Translate id="settings.configuration.resetWeights" />
                </Button>
            </Grid>
            <Grid item>
                <Button color="secondary" variant="contained" onClick={resetAll}>
                    <Translate id="settings.configuration.reset" />
                </Button>
            </Grid>
        </Grid>
    );
}

export default connect(null, dispatchProps)(ResetSettings);
