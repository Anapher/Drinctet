import * as React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, Theme, withStyles } from "@material-ui/core";

const styles = (theme: Theme) =>
    createStyles({
        responsiveHeader: {
            fontSize: "4rem",
            [theme.breakpoints.down("sm")]: {
                fontSize: "2rem",
            },
        },
        responsiveSubTitle: {
            fontSize: "1.5rem",
            [theme.breakpoints.down("sm")]: {
                fontSize: "1rem",
            },
        },
    });

type Props = { classes: any };

function DrinctetHeader({ classes }: Props) {
    return (
        <div>
            <Typography variant="h2" className={classes.responsiveHeader}>
                Drinctet
            </Typography>
            <Typography variant="h6" className={classes.responsiveSubTitle}>
                The goal is to drink that!
            </Typography>
        </div>
    );
}

export default withStyles(styles)(DrinctetHeader);
