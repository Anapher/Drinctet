import { createStyles, Grid, WithStyles, withStyles, Theme } from "@material-ui/core";
import React from "react";
import AddSourceForm from "../features/settings/components/AddSourceForm";
import SourcesList from "../features/settings/components/SourcesList";

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
        },
        headerMargin: {
            paddingTop: theme.spacing.unit * 2,
            paddingLeft: theme.spacing.unit * 2,
            paddingRight: theme.spacing.unit * 2,
        },
    });

type Props = WithStyles<typeof styles>;

function SourcesComponent({ classes }: Props) {
    return (
        <Grid className={classes.tabContainer}>
            <div className={classes.headerMargin}>
                <AddSourceForm />
            </div>
            <div className={classes.fillRemaining}>
                <SourcesList />
            </div>
        </Grid>
    );
}

export default withStyles(styles)(SourcesComponent);
