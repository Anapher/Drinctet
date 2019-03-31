import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    createStyles,
    withStyles,
    Grid,
    WithStyles,
} from "@material-ui/core";
import * as React from "react";

const styles = () =>
    createStyles({
        root: {
            width: "100%",
        },
    });

type Props = LocalizeContextProps & WithStyles<typeof styles>;

function ChangeLanguage({ activeLanguage, languages, setActiveLanguage, classes }: Props) {
    return (
        <Grid container>
            <Grid item xs={12} sm={10} md={8} lg={6}>
                <FormControl className={classes.root}>
                    <InputLabel htmlFor="language-input">
                        <Translate id="settings.configuration.language" />
                    </InputLabel>
                    <Select
                        inputProps={{
                            id: "language-input",
                        }}
                        style={{ width: "100%" }}
                        value={activeLanguage === undefined ? "en" : activeLanguage.code}
                        onChange={ev => setActiveLanguage(ev.target.value)}
                    >
                        {languages.map(lang => (
                            <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
}

export default withStyles(styles)(withLocalize(ChangeLanguage));
