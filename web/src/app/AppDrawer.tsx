import {
    createStyles,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Theme,
    Typography,
    WithStyles,
    withStyles,
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
        toolbar: {
            ...theme.mixins.toolbar,
            paddingLeft: theme.spacing.unit,
        },
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
        <List>
            <div className={classes.toolbar}>
                <Typography variant="h6">Drinctet</Typography>
                <Typography>Drink That!</Typography>
            </div>
            <Divider />
            {renderRoutes(props, drinctetRoutes)}
            <Divider />
            {renderRoutes(props, secondaryRoutes)}
        </List>
    );
}

export default compose(
    withStyles(styles),
    withRouter,
    withLocalize,
)(MainDrawer) as React.ComponentType;
