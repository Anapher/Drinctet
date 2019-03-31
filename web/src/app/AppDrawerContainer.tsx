import React from "react";
import {
    createStyles,
    WithStyles,
    WithTheme,
    Theme,
    Hidden,
    Drawer,
    withStyles,
    SwipeableDrawer,
} from "@material-ui/core";
import MainDrawer from "./AppDrawer";
import MainAppBar from "./MainAppBar";

const drawerWidth = 240;

const styles = (theme: Theme) =>
    createStyles({
        drawer: {
            [theme.breakpoints.up("md")]: {
                width: drawerWidth,
                flexShrink: 0,
            },
        },
        drawerPaper: {
            width: drawerWidth,
        },
        appBar: {
            marginLeft: drawerWidth,
            [theme.breakpoints.up("md")]: {
                width: `calc(100% - ${drawerWidth}px)`,
            },
        },
    });

type Props = WithStyles<typeof styles> & WithTheme;
interface State {
    mobileOpen: boolean;
}

class AppDrawerContainer extends React.Component<Props, State> {
    readonly state: State = {
        mobileOpen: false,
    };

    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };

    setDrawerOpen = (isOpen: boolean) => {
        this.setState({ mobileOpen: isOpen });
    };

    render() {
        const { classes, theme } = this.props;
        const { mobileOpen } = this.state;

        return (
            <div>
                <MainAppBar
                    classes={{ appbar: classes.appBar }}
                    handleToggleDrawer={this.handleDrawerToggle}
                />
                <nav className={classes.drawer}>
                    <Hidden mdUp implementation="css">
                        <SwipeableDrawer
                            variant="temporary"
                            anchor={theme.direction === "rtl" ? "right" : "left"}
                            open={mobileOpen}
                            onClose={() => this.setDrawerOpen(false)}
                            onOpen={() => this.setDrawerOpen(true)}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                        >
                            <div
                                tabIndex={0}
                                role="button"
                                onClick={() => this.setDrawerOpen(false)}
                                onKeyDown={() => this.setDrawerOpen(false)}
                            >
                                <MainDrawer />
                            </div>
                        </SwipeableDrawer>
                    </Hidden>
                    <Hidden smDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            <MainDrawer />
                        </Drawer>
                    </Hidden>
                </nav>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(AppDrawerContainer);
