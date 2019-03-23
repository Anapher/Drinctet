import React, { Component } from "react";
import InsightsCurrentSlide from "./InsightsCurrentSlide";
import InsightsWillPowerView from "./InsightsWillPowerView";
import { Grid } from "@material-ui/core";
import InsightsCards from "./InsightsCards";

export default class InsightsView extends Component {
    render() {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <InsightsWillPowerView />
                </Grid>
                <Grid item xs={12} style={{marginTop: 10}}>
                    <InsightsCurrentSlide />
                </Grid>
                <Grid item xs={12} style={{marginTop: 10}}>
                    <InsightsCards />
                </Grid>
            </Grid>
        );
    }
}
