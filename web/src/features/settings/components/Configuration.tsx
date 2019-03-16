import * as React from "react";
import ChangeLanguage from "./configuration/ChangeLanguage";
import PlayerSettings from "./configuration/PlayerSettings";
import { Grid } from "@material-ui/core";
import SocialMediaPlatform from "./configuration/SocialMediaPlatform";
import SlidePreferences from "./configuration/SlidePreferences";
import TagsPerferences from "./configuration/TagsPerferences";

class Configuration extends React.Component {
    render() {
        return (
            <Grid style={{ padding: 24 }}>
                <Grid container spacing={32} direction="column">
                    <Grid item style={{ marginBottom: 20 }}>
                        <ChangeLanguage />
                    </Grid>
                    <Grid item>
                        <PlayerSettings />
                    </Grid>
                    <Grid item>
                        <SocialMediaPlatform />
                    </Grid>
                    <Grid item>
                        <SlidePreferences />
                    </Grid>
                    <Grid item>
                        <TagsPerferences />
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default Configuration;
