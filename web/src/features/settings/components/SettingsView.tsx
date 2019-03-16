import * as React from "react";
import { AppBar, Tabs, Tab, Theme, Grid } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { withStyles, createStyles, WithStyles } from "@material-ui/core/styles";
import AddPlayerForm from "./AddPlayerForm";
import PlayerList from "./PlayerList";
import AddSourceForm from "./AddSourceForm";
import SourcesList from "./SourcesList";
import { withLocalize, LocalizeContextProps } from "react-localize-redux";
import Configuration from "./Configuration";

const styles = (theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.paper,
            height: "100%",
            display: "flex",
            flexDirection: "column",
        },
    });

interface Props extends LocalizeContextProps, WithStyles<typeof styles> {
    theme: Theme;
}

interface State {
    value: number;
}

class SettingsView extends React.Component<Props, State> {
    readonly state = {
        value: 0,
    };

    handleChange = (_event: any, value: number) => {
        this.setState({ value });
    };

    handleChangeIndex = (index: number) => {
        this.setState({ value: index });
    };

    render() {
        const { theme, classes, translate } = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label={translate("settings.players")} />
                        <Tab label={translate("settings.sources")} />
                        <Tab label={translate("settings.configuration")} />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                    index={this.state.value}
                    ignoreNativeScroll={true}
                    style={{ flexGrow: 1 }}
                    containerStyle={{ height: "100%" }}
                    onChangeIndex={this.handleChangeIndex}
                >
                    <Grid
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                        }}
                    >
                        <div style={{ marginTop: 24, marginLeft: 24, marginRight: 24 }}>
                            <AddPlayerForm />
                        </div>
                        <div
                            style={{
                                flexGrow: 1,
                                height: 0,
                                overflow: "auto",
                                margin: "24px 24px 0 24px",
                            }}
                        >
                            <PlayerList />
                        </div>
                    </Grid>
                    <Grid
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                        }}
                    >
                        <div style={{ marginTop: 24, marginLeft: 24, marginRight: 24 }}>
                            <AddSourceForm />
                        </div>
                        <div style={{ flexGrow: 1, height: 0, overflow: "auto" }}>
                            <SourcesList />
                        </div>
                    </Grid>
                    <Grid
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                        }}
                    >
                        <div style={{ flexGrow: 1, height: 0, overflowX: "hidden" }}>
                            <Configuration />
                        </div>
                    </Grid>
                </SwipeableViews>
            </div>
        );
    }
}

export default withLocalize(withStyles(styles, { withTheme: true })(SettingsView));
