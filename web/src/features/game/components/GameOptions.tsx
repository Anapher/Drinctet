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
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import { RootState } from "DrinctetTypes";
import React, { Component, ComponentType } from "react";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import Fullscreen from "@utils/fullscreen";

const styles = createStyles({
    button: {
        color: "white",
    },
});

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    LocalizeContextProps &
    WithStyles<typeof styles> &
    RouteComponentProps;

const mapStateToProps = (state: RootState) => ({
    selectedSlide: state.game.selectedSlide,
    activeFollowUp: state.game.activeFollowUp,
    selectedCard: state.game.selectedCard,
});

const dispatchProps = {};

interface State {
    anchorEl: HTMLElement | null;
    isFullscreen: boolean;
}

class GameOptions extends Component<Props, State> {
    readonly state: State = {
        anchorEl: null,
        isFullscreen: false,
    };

    componentDidMount() {
        Fullscreen.onfullscreenchange = () => {
            this.setState(state => ({ ...state, isFullscreen: Fullscreen.fullscreenElement }));
        };
    }

    componentWillUnmount() {
        Fullscreen.onfullscreenchange = null;
    }

    handleMenuOpenClick = (event: React.MouseEvent<HTMLElement>) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleNavigate = (path: string) => {
        this.handleClose();
        this.props.history.push(`/play/game/${path}`);
    };

    toggleFullscreen = () => {
        const { isFullscreen } = this.state;
        if (isFullscreen) {
            Fullscreen.exitFullscreen();
        } else {
            Fullscreen.requestFullscreen(window.document.documentElement);
        }

        this.handleClose();
    };

    render() {
        const { classes, selectedCard } = this.props;
        const { anchorEl, isFullscreen } = this.state;
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
                    <MenuItem onClick={() => this.handleNavigate("settings")}>
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
                    <MenuItem onClick={this.handleClose} disabled={selectedCard === null}>
                        <ListItemIcon>
                            <FeedbackIcon />
                        </ListItemIcon>
                        <Translate id="game.options.reportCard" />
                    </MenuItem>
                    <MenuItem onClick={this.toggleFullscreen}>
                        <ListItemIcon>
                            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                        </ListItemIcon>
                        <Translate id={isFullscreen ? "game.options.exitFullscreen" : "game.options.fullscreen"} />
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
