import * as React from "react";
import Typography from "@material-ui/core/Typography";
import { AppBar, Tabs, Tab, Theme, Grid } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { Direction, withStyles } from "@material-ui/core/styles";
import AddPlayerForm from "./AddPlayerForm";
import PlayerList from "./PlayerList";
import AddSourceForm from "./AddSourceForm";
import SourcesList from "./SourcesList";
import { withLocalize, LocalizeContextProps } from "react-localize-redux";

function TabContainer({ children, dir }: { children: any; dir: Direction }) {
    return (
        <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

interface Props extends LocalizeContextProps {
    classes: { root: string };
    theme: Theme;
}
interface State {
    value: number;
}

const styles = (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        height: "100%",
    },
});

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
            <div
                style={{ display: "flex", flexDirection: "column", height: "100%" }}
                className={classes.root}
            >
                <AppBar position="static" color="default">
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label={translate("settings.players")} />
                        <Tab label="Sources" />
                        <Tab label="Algorithm" />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                    index={this.state.value}
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
                        <div style={{ flexGrow: 1, height: 0, overflow: "auto", margin: 24 }}>
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
                    <TabContainer dir={theme.direction}>Sources</TabContainer>
                </SwipeableViews>
            </div>
        );
    }
}

export default withLocalize(withStyles(styles, { withTheme: true })(SettingsView));
