import React from "react";
import games from "./registrations";
import { ListItem, ListItemText } from "@material-ui/core";
import { LocalizeContextProps, withLocalize } from "react-localize-redux";
import { compose } from "redux";
import { withRouter, RouteComponentProps } from "react-router";

type Props = LocalizeContextProps & RouteComponentProps;

function MenuItems({ activeLanguage, history }: Props) {
    const lang = activeLanguage === undefined ? null : activeLanguage.code;

    return games.map(game => {
        const translation =
            game.translations.find(x => x.lang === lang) ||
            game.translations.find(x => x.lang === "en") ||
            game.translations[0];
        const path = `/drinkingGames/${game.name}`;

        return (
            <ListItem
                key={game.name}
                button
                onClick={() => history.push(path)}
                selected={history.location.pathname === path}
            >
                <ListItemText primary={translation.name} />
            </ListItem>
        );
    });
}

export default compose(
    withLocalize,
    withRouter,
)(MenuItems) as React.ComponentType;
