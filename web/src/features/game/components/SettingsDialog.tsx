import {
    AppBar,
    Button,
    createStyles,
    IconButton,
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
import PeopleIcon from "@material-ui/icons/People";
import React from "react";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { compose } from "redux";
import SettingsView from "./SettingsView";

function Transition(props: any) {
    return <Slide direction="up" {...props} />;
}

const styles = (theme: Theme) => createStyles({
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
        [theme.breakpoints.up("md")]: {
            height: "80vh",
        }
    },
});

interface Props
    extends InjectedProps,
        Partial<WithWidth>,
        WithStyles<typeof styles>,
        LocalizeContextProps,
        RouteComponentProps {}

function SettingsDialog({ fullScreen, classes, history }: Props) {
    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={true}
                onClose={() => history.push("/play/game")}
                TransitionComponent={Transition}
                fullWidth={true}
                maxWidth="md"
                classes={{
                    paperScrollPaper: classes.dialogPaper,
                }}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={classes.flex}>
                            <Translate id="game.options.settings" />
                        </Typography>
                        <IconButton
                            color="inherit"
                            onClick={() => history.push("/play/game/settings/arrangements")}
                        >
                            <PeopleIcon />
                        </IconButton>
                        <Button color="inherit" onClick={() => history.goBack()}>
                            <Translate id="close" />
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
