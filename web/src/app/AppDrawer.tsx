import {
    createStyles,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Theme,
    WithStyles,
    withStyles,
    Typography,
} from "@material-ui/core";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
import LayersIcon from "@material-ui/icons/Layers";
import PersonIcon from "@material-ui/icons/Person";
import ReceiptIcon from "@material-ui/icons/Receipt";
import SettingsIcon from "@material-ui/icons/Settings";
import React from "react";
import { LocalizeContextProps, withLocalize } from "react-localize-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { compose } from "redux";

const styles = (theme: Theme) =>
    createStyles({
        toolbar: { ...theme.mixins.toolbar, paddingLeft: 20, display: "flex", alignItems: "center" },
    });

type Props = WithStyles<typeof styles> & RouteComponentProps & LocalizeContextProps;

interface Route {
    path: string;
    icon: JSX.Element;
}

const drinctetRoutes: Route[] = [
    {
        path: "/play",
        icon: <FlightTakeoffIcon />,
    },
    {
        path: "/sources",
        icon: <LayersIcon />,
    },
    {
        path: "/configuration",
        icon: <SettingsIcon />,
    },
];

const secondaryRoutes: Route[] = [
    {
        path: "/drinkingGames",
        icon: <ReceiptIcon />,
    },
    {
        path: "/about",
        icon: <PersonIcon />,
    },
];

function renderRoutes({ translate, history }: Props, routes: Route[]) {
    return routes.map(route => (
        <ListItem
            key={route.path}
            button
            selected={history.location.pathname.startsWith(route.path)}
            onClick={() => history.push(route.path)}
        >
            <ListItemIcon>{route.icon}</ListItemIcon>
            <ListItemText primary={translate(`menu.${route.path.substring(1)}`)} />
        </ListItem>
    ));
}

function MainDrawer(props: Props) {
    const { classes } = props;
    return (
        <div>
            <div className={classes.toolbar}>
                <div>
                    <Typography variant="h6">Drinctet</Typography>
                    <Typography>The goal is to drink that!</Typography>
                </div>
            </div>
            <Divider />
            <List>
                {renderRoutes(props, drinctetRoutes)}
                <Divider />
                {renderRoutes(props, secondaryRoutes)}
            </List>
        </div>
    );
}

export default compose(
    withStyles(styles),
    withRouter,
    withLocalize,
)(MainDrawer) as React.ComponentType;
