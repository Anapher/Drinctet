import { createStyles, Grid, WithStyles, withStyles, Theme } from "@material-ui/core";
import React from "react";
import AddPlayerForm from "../features/play/components/AddPlayerForm";
import PlayerList from "../features/play/components/PlayerList";
import { Route, withRouter } from "react-router-dom";
import { compose } from "redux";
import PlayerArrangementsDialog from "../features/play/components/PlayerArrangementsDialog";

const styles = (theme: Theme) =>
    createStyles({
        tabContainer: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            maxWidth: 800,
        },
        headerMargin: {
            paddingTop: theme.spacing.unit * 2,
            paddingLeft: theme.spacing.unit * 2,
            paddingRight: theme.spacing.unit * 2,
        },
        fillRemaining: {
            flexGrow: 1,
            height: 0,
            overflowY: "auto",
        },
    });

type Props = WithStyles<typeof styles>;

function PlayComponent({ classes }: Props) {
    return (
        <React.Fragment>
            <Grid className={classes.tabContainer}>
                <div className={classes.headerMargin}>
                    <AddPlayerForm />
                </div>
                <div className={classes.fillRemaining}>
                    <PlayerList />
                </div>
            </Grid>

            <Route path="/play/arrangements" component={PlayerArrangementsDialog} />
        </React.Fragment>
    );
}

export default compose(
    withStyles(styles),
    withRouter,
)(PlayComponent) as React.ComponentType;
