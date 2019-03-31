import { AppBar, Tab, Tabs, Theme } from "@material-ui/core";
import { createStyles, withStyles, WithStyles, WithTheme } from "@material-ui/core/styles";
import * as React from "react";
import { LocalizeContextProps, withLocalize } from "react-localize-redux";
import { Route } from "react-router-dom";
import { compose } from "redux";
import PlayerArrangementsDialog from "../../play/components/PlayerArrangementsDialog";
import ConfigurationRoute from "../../../routes/ConfigurationRoute";
import PlayRoute from "../../../routes/PlayRoute";
import SourcesRoute from "../../../routes/SourcesRoute";

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

type Props = WithStyles<typeof styles> & WithTheme & LocalizeContextProps;

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
                {value === 0 && <PlayRoute />}
                {value === 1 && <SourcesRoute />}
                {value === 2 && <ConfigurationRoute />}

                <Route path="/play/game/settings/arrangements" component={PlayerArrangementsDialog} />
            </div>
        );
    }
}

export default compose(
    withLocalize,
    withStyles(styles, { withTheme: true }),
)(SettingsView) as React.ComponentType;
