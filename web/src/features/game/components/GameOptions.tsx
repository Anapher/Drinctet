import {
    createStyles,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    WithStyles,
    withStyles,
} from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import FeedbackIcon from "@material-ui/icons/Feedback";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SettingsIcon from "@material-ui/icons/Settings";
import { RootState } from "DrinctetTypes";
import React, { Component, ComponentType } from "react";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import { RouterProps, withRouter } from "react-router";

const styles = createStyles({
    button: {
        color: "white",
    },
});

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    LocalizeContextProps &
    WithStyles<typeof styles> &
    RouterProps;

const mapStateToProps = (state: RootState) => ({
    selectedSlide: state.game.selectedSlide,
    current: state.game.current,
    activeFollowUp: state.game.activeFollowUp,
});

const dispatchProps = {};

interface State {
    anchorEl: HTMLElement | null;
}

class GameOptions extends Component<Props, State> {
    readonly state: State = {
        anchorEl: null,
    };

    handleMenuOpenClick = (event: React.MouseEvent<HTMLElement>) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleNavigate = (path: string) => {
        this.handleClose();
        this.props.history.push(`/game/${path}`);
    };

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const isOpen = anchorEl !== null;

        return (
            <div>
                <IconButton
                    color="secondary"
                    className={classes.button}
                    onClick={this.handleMenuOpenClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={isOpen}
                    onClose={this.handleClose}
                    PaperProps={{
                        style: {
                            width: 200,
                        },
                    }}
                >
                    <MenuItem
                        onClick={() => this.handleNavigate("settings")}
                    >
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <Translate id="game.options.settings" />
                    </MenuItem>
                    <MenuItem onClick={() => this.handleNavigate("insights")}>
                        <ListItemIcon>
                            <DonutLargeIcon />
                        </ListItemIcon>
                        <Translate id="game.options.insights" />
                    </MenuItem>
                    <MenuItem onClick={this.handleClose}>
                        <ListItemIcon>
                            <FeedbackIcon />
                        </ListItemIcon>
                        <Translate id="game.options.reportCard" />
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

export default compose(
    withStyles(styles),
    withLocalize,
    connect(
        mapStateToProps,
        dispatchProps,
    ),
    withRouter,
)(GameOptions) as ComponentType;
