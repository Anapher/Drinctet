import { AppBar, Button, createStyles, Slide, Toolbar, Typography, WithStyles, withStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import withMobileDialog, { InjectedProps } from "@material-ui/core/withMobileDialog";
import { WithWidth } from "@material-ui/core/withWidth";
import React from "react";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import { RouterProps, withRouter } from "react-router";
import { compose } from "redux";
import SettingsView from "../../settings/components/SettingsView";

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
    content: {
        flexGrow: 1,
    },
    dialogPaper: {
        height: "80vh"
    },
    fullscreenPaper: {
        height: "100vh"
    }
});

interface Props
    extends InjectedProps,
        Partial<WithWidth>,
        WithStyles<typeof styles>,
        LocalizeContextProps,
        RouterProps {}

function SettingsDialog({ fullScreen, classes, history }: Props) {
    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={true}
                onClose={() => history.push("/game")}
                TransitionComponent={Transition}
                fullWidth={true}
                maxWidth="md"
                classes={{paperScrollPaper: classes.dialogPaper, paperFullScreen: classes.fullscreenPaper}}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={classes.flex}>
                            <Translate id="game.options.settings" />
                        </Typography>
                        <Button color="inherit" onClick={() => history.push("/game")}>
                            <Translate id="game.close" />
                        </Button>
                    </Toolbar>
                </AppBar>
                <div className={classes.content}>
                    <SettingsView />
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
)(SettingsDialog) as React.ComponentType;
