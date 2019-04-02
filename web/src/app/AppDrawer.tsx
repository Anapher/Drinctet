import {
    Collapse,
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
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
import LayersIcon from "@material-ui/icons/Layers";
import PersonIcon from "@material-ui/icons/Person";
import ReceiptIcon from "@material-ui/icons/Receipt";
import SettingsIcon from "@material-ui/icons/Settings";
import React from "react";
import { LocalizeContextProps, withLocalize } from "react-localize-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { compose } from "redux";
import DrinkingGameItems from "../features/drinking-games/DrinkingGameItems";

const styles = (theme: Theme) =>
    createStyles({
        toolbar: {
            ...theme.mixins.toolbar,
            paddingLeft: 20,
            display: "flex",
            alignItems: "center",
        },
        nested: {
            paddingLeft: theme.spacing.unit * 4,
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

interface ExpandableItemState {
    isOpen: boolean;
}

class DrinkingGamesMenu extends React.Component<Props, ExpandableItemState> {
    readonly state = { isOpen: false };

    componentDidMount() {
        if (this.props.location.pathname.startsWith("/drinkingGames")) {
            this.setState({ isOpen: true });
        }
    }

    handleClick = (event: React.SyntheticEvent) => {
        this.setState(state => ({ isOpen: !state.isOpen }));
        event.stopPropagation();
    };

    render() {
        const { translate, classes } = this.props;
        const { isOpen } = this.state;
        const name = "drinkingGames";
        return (
            <React.Fragment>
                <ListItem button onClick={this.handleClick} selected={false}>
                    <ListItemIcon>
                        <ReceiptIcon />
                    </ListItemIcon>
                    <ListItemText primary={translate(`menu.${name}`)} />
                    {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        <div className={classes.nested}>
                            <DrinkingGameItems />
                        </div>
                    </List>
                </Collapse>
            </React.Fragment>
        );
    }
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
            <List>{renderRoutes(props, drinctetRoutes)}</List>
            <Divider />
            <List>
                <DrinkingGamesMenu {...props} />
                <List>{renderRoutes(props, secondaryRoutes)}</List>
            </List>
        </div>
    );
}

export default compose(
    withStyles(styles),
    withRouter,
    withLocalize,
)(MainDrawer) as React.ComponentType;
