import MoreVertIcon from "@material-ui/icons/MoreVert";
import { RootState } from "DrinctetTypes";
import React, { Component, ComponentType } from "react";
import { withLocalize, LocalizeContextProps, Translate } from "react-localize-redux";
import {
    createStyles,
    withStyles,
    IconButton,
    WithStyles,
    Menu,
    MenuItem,
    ListItemIcon,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import { compose } from "redux";
import { connect } from "react-redux";

const styles = createStyles({
    button: {
        color: "white",
    },
});

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    LocalizeContextProps &
    WithStyles<typeof styles>;

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
                    <MenuItem onClick={this.handleClose}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <Translate id="game.options.settings" />
                    </MenuItem>
                    <MenuItem onClick={this.handleClose}>
                        <Translate id="game.options.insights" />
                    </MenuItem>
                    <MenuItem onClick={this.handleClose}>
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
)(GameOptions) as ComponentType;
