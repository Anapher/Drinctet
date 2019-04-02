import {
    AppBar,
    Button,
    createStyles,
    Slide,
    Toolbar,
    Typography,
    WithStyles,
    withStyles,
    Theme,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import withMobileDialog, { InjectedProps } from "@material-ui/core/withMobileDialog";
import { WithWidth } from "@material-ui/core/withWidth";
import React from "react";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { compose } from "redux";
import PlayerArrangements from "./PlayerArrangements";

function Transition(props: any) {
    return <Slide direction="up" {...props} />;
}

const styles = (theme: Theme) =>
    createStyles({
        appBar: {
            position: "relative",
        },
        flex: {
            flex: 1,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing.unit * 2,
            overflowX: "auto",
        },
        dialogPaper: {
            height: "80vh",
        },
        fullscreenPaper: {
            height: "100vh",
        },
    });

interface Props
    extends InjectedProps,
        Partial<WithWidth>,
        WithStyles<typeof styles>,
        LocalizeContextProps,
        RouteComponentProps {}

function PlayerArrangementsDialog({ fullScreen, classes, history }: Props) {
    return (
        <Dialog
            fullScreen={fullScreen}
            open={true}
            onClose={() => history.goBack()}
            TransitionComponent={Transition}
            fullWidth={true}
            maxWidth="md"
            classes={{
                paperScrollPaper: classes.dialogPaper,
                paperFullScreen: classes.fullscreenPaper,
            }}
        >
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" color="inherit" className={classes.flex}>
                        <Translate id="play.playerArrangements" />
                    </Typography>
                    <Button color="inherit" onClick={() => history.goBack()}>
                        <Translate id="close" />
                    </Button>
                </Toolbar>
            </AppBar>
            <div className={classes.content}>
                <PlayerArrangements />
            </div>
        </Dialog>
    );
}

export default compose(
    withMobileDialog({ breakpoint: "sm" }),
    withStyles(styles),
    withLocalize,
    withRouter,
)(PlayerArrangementsDialog) as React.ComponentType;
