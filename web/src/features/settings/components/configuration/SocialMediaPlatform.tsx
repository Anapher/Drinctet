import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import * as React from "react";
import { Typography, FormControl, Select, Input, MenuItem } from "@material-ui/core";
import { RootState } from "DrinctetTypes";
import { setSocialMediaPlatform } from "../../actions";
import { connect } from "react-redux";
import { socialMediaPlatforms } from "../../../../preferences";

const mapStateToProps = (state: RootState) => ({
    platform: state.settings.socialMediaPlatform,
});

const dispatchProps = {
    setSocialMediaPlatform,
};

type Props = LocalizeContextProps & ReturnType<typeof mapStateToProps> & typeof dispatchProps;

function ChangeLanguage({ platform, setSocialMediaPlatform }: Props) {
    return (
        <div>
            <Typography variant="h5">
                <Translate id="settings.configuration.socialMediaPlatform" />
            </Typography>
            <Typography gutterBottom>
                <Translate id="settings.configuration.socialMediaPlatform.description" />
            </Typography>
            <FormControl>
                <Select style={{width: 200, marginTop: 10}}
                    value={platform}
                    onChange={ev => setSocialMediaPlatform(ev.target.value)}
                    input={<Input />}
                >
                    {socialMediaPlatforms.map(x => (
                        <MenuItem key={x} value={x}>
                            {x}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default connect(
    mapStateToProps,
    dispatchProps,
)(withLocalize(ChangeLanguage));
