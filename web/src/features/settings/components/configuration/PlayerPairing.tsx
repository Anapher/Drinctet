import { FormControlLabel, Switch, Typography } from "@material-ui/core";
import { RootState } from "DrinctetTypes";
import * as React from "react";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import { connect } from "react-redux";
import { compose } from "redux";
import { setPreferOppositeGenders } from "../../actions";

const mapStateToProps = (state: RootState) => ({
    preferOppositeGenders: state.settings.preferOppositeGenders,
});

const dispatchProps = {
    setPreferOppositeGenders,
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & LocalizeContextProps;

function PlayerSettings({ preferOppositeGenders, setPreferOppositeGenders }: Props) {
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
        </div>
    );
}

export default compose(
    connect(
        mapStateToProps,
        dispatchProps,
    ),
    withLocalize,
)(PlayerSettings) as React.ComponentType;
