import React from "react";
import {
    Typography,
    WithStyles,
    Grid,
    FormControl,
    InputLabel,
    Select,
    Input,
    MenuItem,
    createStyles,
    withStyles,
    Theme,
} from "@material-ui/core";
import { addPlayerArrangment, removePlayerArrangment } from "../actions";
import { RootState } from "DrinctetTypes";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import { compose } from "redux";
import { connect } from "react-redux";

const styles = (theme: Theme) =>
    createStyles({
        arrangmentItem: {
            borderBottom: "1px solid #d8d8d8",
            paddingBottom: 5,
        },
        arrangementSelect: {
            width: 200,
            [theme.breakpoints.down("xs")]: {
                width: "100%",
            },
        },
    });

const mapStateToProps = (state: RootState) => ({
    players: state.play.players,
    arrangements: state.play.arrangements,
});

const dispatchProps = {
    addPlayerArrangment,
    removePlayerArrangment,
};

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    LocalizeContextProps &
    WithStyles<typeof styles>;

function PlayerArrangements({
    classes,
    players,
    arrangements,
    addPlayerArrangment,
    removePlayerArrangment,
}: Props) {
    return (
        <div>
            <Typography variant="subtitle2">
                <Translate id="settings.configuration.arrangements" />
            </Typography>
            <Typography>
                <Translate id="settings.configuration.arrangements.description" />
            </Typography>
            <Grid container>
                {players
                    .filter(player => arrangements.findIndex(x => x.p2 === player.id) === -1)
                    .map(player => {
                        const arrangment = arrangements.find(x => x.p1 === player.id);
                        const arrangedPlayerId = arrangment === undefined ? "" : arrangment.p2;
                        return (
                            <Grid
                                item
                                container
                                alignItems="flex-end"
                                className={classes.arrangmentItem}
                                key={player.id}
                            >
                                <Grid item xs={6} lg={4}>
                                    <Typography variant="subtitle1">{player.name}</Typography>
                                </Grid>
                                <Grid item xs={6} lg={4}>
                                    <FormControl className={classes.arrangementSelect}>
                                        <InputLabel htmlFor="player-selection">
                                            <Translate id="settings.configuration.arrangements.pairWith" />
                                        </InputLabel>
                                        <Select
                                            value={arrangedPlayerId}
                                            onChange={ev => {
                                                const value = ev.target.value;
                                                if (value === "") {
                                                    removePlayerArrangment(player.id);
                                                } else {
                                                    addPlayerArrangment({
                                                        p1: player.id,
                                                        p2: value,
                                                    });
                                                }
                                            }}
                                            input={<Input id="player-selection" />}
                                        >
                                            <MenuItem value="">
                                                <em>
                                                    <Translate id="settings.configuration.arrangements.none" />
                                                </em>
                                            </MenuItem>
                                            {players
                                                .filter(
                                                    x =>
                                                        x.id !== player.id &&
                                                        arrangements.findIndex(
                                                            y =>
                                                                (y.p1 === x.id || y.p2 === x.id) &&
                                                                y.p1 !== player.id,
                                                        ) === -1,
                                                )
                                                .map(x => (
                                                    <MenuItem key={x.id} value={x.id}>
                                                        {x.name}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        );
                    })}
            </Grid>
        </div>
    );
}

export default compose(
    connect(
        mapStateToProps,
        dispatchProps,
    ),
    withStyles(styles),
    withLocalize,
)(PlayerArrangements) as React.ComponentType;
