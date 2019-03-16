import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import {
    Typography,
    Switch,
    FormControlLabel,
    createStyles,
    withStyles,
    Grid,
    FormControl,
    InputLabel,
    Select,
    Input,
    MenuItem,
    Theme,
    WithStyles,
} from "@material-ui/core";
import * as React from "react";
import { RootState } from "DrinctetTypes";
import {
    setPreferOppositeGenders,
    addPlayerArrangment,
    removePlayerArrangment,
} from "../../actions";
import { connect } from "react-redux";

const mapStateToProps = (state: RootState) => ({
    preferOppositeGenders: state.settings.preferOppositeGenders,
    players: state.settings.players,
    arrangements: state.settings.arrangements,
});

const dispatchProps = {
    setPreferOppositeGenders,
    addPlayerArrangment,
    removePlayerArrangment,
};

const styles = (theme: Theme) =>
    createStyles({
        section: {
            marginTop: 10,
        },
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

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    LocalizeContextProps &
    WithStyles<typeof styles>;

function PlayerSettings({
    preferOppositeGenders,
    setPreferOppositeGenders,
    classes,
    players,
    arrangements,
    addPlayerArrangment,
    removePlayerArrangment,
}: Props) {
    return (
        <div>
            <Typography variant="h5">
                <Translate id="settings.configuration.playerSettings" />
            </Typography>
            <FormControlLabel
                control={
                    <Switch
                        checked={preferOppositeGenders}
                        onChange={(_, c) => setPreferOppositeGenders(c)}
                    />
                }
                label={<Translate id="settings.configuration.playerSettings.pairOppositeGenders" />}
            />
            <Typography className={classes.section} variant="subtitle2">
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

export default connect(
    mapStateToProps,
    dispatchProps,
)(withStyles(styles)(withLocalize(PlayerSettings)));
