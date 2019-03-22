import React from "react";
import Dialog from "@material-ui/core/Dialog";
import withMobileDialog, { InjectedProps } from "@material-ui/core/withMobileDialog";
import {
    AppBar,
    Slide,
    createStyles,
    WithStyles,
    withStyles,
    Toolbar,
    Button,
    Typography,
} from "@material-ui/core";
import { withLocalize, LocalizeContextProps, Translate } from "react-localize-redux";
import { withRouter, RouterProps } from "react-router";
import { compose } from "redux";
import { WithWidth } from "@material-ui/core/withWidth";
import InsightsView from "./InsightsView";

function Transition(props: any) {
    return <Slide direction="up" {...props} />;
}

const styles = createStyles({
    appBar: {
        position: "relative",
    },
    flex: {
        flex: 1,
    },
});

interface Props
    extends InjectedProps,
        Partial<WithWidth>,
        WithStyles<typeof styles>,
        LocalizeContextProps,
        RouterProps {}

function InsightsDialog({ fullScreen, classes, history }: Props) {
    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={true}
                onClose={() => history.push("/game")}
                TransitionComponent={Transition}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={classes.flex}>
                            <Translate id="game.options.insights" />
                        </Typography>
                        <Button color="inherit" onClick={() => history.push("/game")}>
                            <Translate id="game.close" />
                        </Button>
                    </Toolbar>
                </AppBar>
                <div style={{height: "60vh"}}>
                    <InsightsView />
                </div>
            </Dialog>
        </div>
    );
}

export default compose(
    withMobileDialog({ breakpoint: "sm" }),
    withStyles(styles),
    withLocalize,
    withRouter,
)(InsightsDialog) as React.ComponentType;
