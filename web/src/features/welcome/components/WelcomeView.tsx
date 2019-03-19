import { Grid, createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import * as React from "react";
import SettingsView from "../../settings/components/SettingsView";
import DrinctetHeader from "./DrinctetHeader";
import StartButton from "./StartButton";

const styles = (theme: Theme) =>
    createStyles({
        root: {
            height: "100vh",
            display: "flex",
            flexDirection: "column",
        },
        header: {
            margin: 20,
            marginBottom: 10,
            [theme.breakpoints.down("sm")]: {
                display: "none",
            },
        },
    });

function WelcomeView({ classes }: WithStyles<typeof styles>) {
    return (
        <div className={classes.root}>
            <Grid container justify="center">
                <Grid item xs={12} md={6} className={classes.header}>
                    <DrinctetHeader />
                </Grid>
            </Grid>
            <div style={{ flexGrow: 1, height: 0 }}>
                <Grid container justify="center" style={{ height: "100%" }}>
                    <Grid item xs={12} md={6}>
                        <SettingsView />
                    </Grid>
                </Grid>
            </div>
            <Grid container justify="center">
                <Grid item xs={12} md={6} container justify="center">
                    <Grid item xs={10} lg={8} style={{ padding: "10px 20px 20px 20px" }}>
                        <StartButton />
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default withStyles(styles)(WelcomeView);
