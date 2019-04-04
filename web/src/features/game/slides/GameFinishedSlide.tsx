import React from "react";
import { SlidePresenter } from "./base/slide-presenter";
import { RootAction } from "DrinctetTypes";
import * as actions from "../actions";
import { RouteComponentProps, withRouter } from "react-router";
import { Typography, Fab, createStyles, WithStyles, withStyles, Theme } from "@material-ui/core";
import { Translate } from "react-localize-redux";
import * as baseStyles from "./base/helper";

const styles = (theme: Theme) =>
    createStyles({
        root: baseStyles.rootStyle(),
        content: baseStyles.contentStyle(theme),
        button: {
            minWidth: 200,
        }
    });

type Props = RouteComponentProps & WithStyles<typeof styles>;

function GameFinishedComponent({ history, classes }: Props) {
    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <Typography color="inherit" variant="h2" gutterBottom>
                    <Translate id="slides.gamefinished.title" />
                </Typography>
                <Fab className={classes.button} variant="extended" color="primary" onClick={() => history.push("/")}>
                    <Translate id="slides.gamefinished.goBack" />
                </Fab>
            </div>
        </div>
    );
}

const Component = withRouter(withStyles(styles)(GameFinishedComponent));

export class GameFinishedSlide implements SlidePresenter {
    slideType = "GameFinishedSlide";
    requiredCards = [];
    backgroundColor = "#000000";

    initialize(): RootAction[] {
        return [actions.setSlideState({ state: {}, insights: null })];
    }
    initializeFollowUp(): RootAction[] {
        throw new Error("Method not implemented.");
    }
    render(): React.ReactNode {
        return <Component />;
    }
}
