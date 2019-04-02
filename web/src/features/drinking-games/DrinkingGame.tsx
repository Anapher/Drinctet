import { CircularProgress, createStyles, Fade, Paper, Theme, withStyles, WithStyles } from "@material-ui/core";
import { markdownOptions } from "@utils/material-markdown";
import Axios from "axios";
import Markdown from "markdown-to-jsx";
import React from "react";
import { LocalizeContextProps, withLocalize } from "react-localize-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { DrinkingGame } from "./registrations";

const styles = (theme: Theme) => createStyles({
    paper: {
        ...theme.mixins.gutters(),
        padding: theme.spacing.unit * 2,
        margin: theme.spacing.unit * 2,
        maxWidth: 800
    }
});

interface Props extends RouteComponentProps, LocalizeContextProps, WithStyles<typeof styles> {
    game: DrinkingGame;
}

interface State {
    isLoadingLang: string | null;
    content: string | null;
}

class DrinkingGameComponent extends React.Component<Props, State> {
    readonly state: State = {
        isLoadingLang: null,
        content: null,
    };

    getLang(): string | null {
        const { history, activeLanguage, game } = this.props;

        const path = history.location.pathname;
        if (path !== `/drinkingGames/${game.name}`) {
            return null;
        }

        const lang = activeLanguage === undefined ? null : activeLanguage.code;

        const translation =
            game.translations.find(x => x.lang === lang) ||
            game.translations.find(x => x.lang === "en") ||
            game.translations[0];

        return translation.lang;
    }

    render() {
        const { content, isLoadingLang } = this.state;
        const { game, classes } = this.props;

        const lang = this.getLang();
        if (lang === null) {
            return null;
        }

        if (content !== null && isLoadingLang === lang) {
            return (
                <Paper className={classes.paper}>
                    <Markdown children={content} options={markdownOptions} />
                </Paper>
            );
        }

        if (isLoadingLang !== lang) {
            Axios.get(`${process.env.PUBLIC_URL}/explanations/${game.name}.${lang}.md`).then(response => {
                const currentLang = this.getLang();

                if (currentLang !== lang) {
                    return;
                }

                this.setState({
                    content: response.data,
                    isLoadingLang: currentLang
                });
            });
        }

        return (
            <Fade
                in={true}
                style={{
                    transitionDelay: "800ms",
                    margin: 20,
                }}
                unmountOnExit
            >
                <CircularProgress />
            </Fade>
        );
    }
}

export default withRouter(withLocalize(withStyles(styles)(DrinkingGameComponent)));
