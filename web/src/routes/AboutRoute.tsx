import React from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    createStyles,
    Theme,
    WithStyles,
    withStyles,
} from "@material-ui/core";
import { Translate } from "react-localize-redux";

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing.unit * 2,
            maxWidth: theme.spacing.unit * 100,
        },
        header: {
            marginTop: theme.spacing.unit * 2,
        },
    });

type Props = WithStyles<typeof styles>;

function AboutRoute({ classes }: Props) {
    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" variant="subtitle2">
                                <Translate id="about.title" />
                            </Typography>
                            <Typography variant="h5" component="h2">
                                Drinctet - Drink That!
                            </Typography>
                            <Typography gutterBottom>
                                <Translate id="about.aboutText" />
                            </Typography>
                            <Typography variant="h6" className={classes.header}>
                                <Translate id="about.installation" />
                            </Typography>
                            <Typography gutterBottom>
                                <Translate id="about.installationText" />
                            </Typography>
                            <Typography variant="h6" className={classes.header}>
                                <Translate id="about.version" />
                            </Typography>
                            <Typography inline>{process.env.REACT_APP_GIT_COMMIT}</Typography>
                            <Typography inline color="textSecondary">
                                {process.env.REACT_APP_GIT_INFO}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default withStyles(styles)(AboutRoute);
