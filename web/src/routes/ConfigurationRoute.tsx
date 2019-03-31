import { createStyles, Grid, WithStyles, withStyles, Theme } from "@material-ui/core";
import React from "react";
import Configuration from "../features/settings/components/Configuration";

const styles = (theme: Theme) =>
    createStyles({
        tabContainer: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
        },
        fillRemaining: {
            flexGrow: 1,
            height: 0,
            overflowY: "auto",
            overflowX: "hidden",
            padding: theme.spacing.unit * 2,
        },
    });

type Props = WithStyles<typeof styles>;

function ConfigurationComponent({ classes }: Props) {
    return (
        <Grid className={classes.tabContainer}>
            <div className={classes.fillRemaining} style={{ overflowX: "hidden" }}>
                <Configuration />
            </div>
        </Grid>
    );
}

export default withStyles(styles)(ConfigurationComponent);
