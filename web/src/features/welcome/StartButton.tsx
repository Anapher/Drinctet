import * as React from "react";
import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core";

const styles = {
  root: {
    color: "white",
    width: "100%",
    backgroundColor: "#e74c3c",
    '&:hover': {
        backgroundColor: "#c0392b"
    }
  },
};

interface Props {
  classes: { root: string };
}

function StartButton(props: Props) {
  const { classes } = props;
  return <Fab variant="extended" size="large" classes={{ root: classes.root }}>Start Game</Fab>;
}

export default withStyles(styles)(StartButton);
