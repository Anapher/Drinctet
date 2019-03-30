import { AppBar, Grid, Tab, Tabs, Theme } from "@material-ui/core";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import * as React from "react";
import { LocalizeContextProps, withLocalize } from "react-localize-redux";
import AddPlayerForm from "./AddPlayerForm";
import AddSourceForm from "./AddSourceForm";
import Configuration from "./Configuration";
import PlayerList from "./PlayerList";
import SourcesList from "./SourcesList";

const styles = (theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.paper,
            height: "100%",
            display: "flex",
            flexDirection: "column",
        },
        tabContainer: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
        },
        firstChildMargins: {
            marginTop: 24,
            marginLeft: 24,
            marginRight: 24,
        },
        fillRemaining: {
            flexGrow: 1,
            height: 0,
        },
    });

interface Props extends LocalizeContextProps, WithStyles<typeof styles> {
    theme: Theme;
}

interface State {
    value: number;
}

function PlayersTab({ classes }: Props) {
    return (
        <Grid className={classes.tabContainer}>
            <div className={classes.firstChildMargins}>
                <AddPlayerForm />
            </div>
            <div
                className={classes.fillRemaining}
                style={{
                    overflow: "auto",
                    margin: "24px 24px 0 24px",
                }}
            >
                <PlayerList />
            </div>
        </Grid>
    );
}

function SourcesTab({ classes }: Props) {
    return (
        <Grid className={classes.tabContainer}>
            <div className={classes.firstChildMargins}>
                <AddSourceForm />
            </div>
            <div className={classes.fillRemaining} style={{ overflow: "auto" }}>
                <SourcesList />
            </div>
        </Grid>
    );
}

function SettingsTab({ classes }: Props) {
    return (
        <Grid className={classes.tabContainer}>
            <div className={classes.fillRemaining} style={{ overflowX: "hidden" }}>
                <Configuration />
            </div>
        </Grid>
    );
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
        const { classes, translate } = this.props;
        const { value } = this.state;

        return (
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
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
                {value === 0 && PlayersTab(this.props)}
                {value === 1 && SourcesTab(this.props)}
                {value === 2 && SettingsTab(this.props)}
            </div>
        );
    }
}

export default withLocalize(withStyles(styles, { withTheme: true })(SettingsView));
