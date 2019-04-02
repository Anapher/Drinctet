import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import "tslib";
import "typeface-roboto";
import App from "./app/App";
import "./env";
import { addSource, loadSourceAsync } from "./features/settings/actions";
import { addPlayer } from "./features/play/actions";
import "./index.css";
import store from "./store";
import { initialize, LocalizeProvider, NamedLanguage } from "react-localize-redux";
import drinctetTranslations from "./loc/drinctet.json";
import { renderToStaticMarkup } from "react-dom/server";
import { defaultSources } from "./preferences";
import * as serviceWorker from "./serviceWorker";

const state = store.getState();

if (state.settings.sources.length === 0) {
    for (const src of defaultSources) {
        const url = `${process.env.PUBLIC_URL}/${src}`;
        store.dispatch(addSource(url));
        store.dispatch(loadSourceAsync.request(url));
    }
}
else {
    for (const src of state.settings.sources) {
        store.dispatch(loadSourceAsync.request(src.url));
    }
}

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    store.dispatch(addPlayer({ name: "Vincent", gender: "Male" }));
    store.dispatch(addPlayer({ name: "Melina", gender: "Female" }));
    store.dispatch(addPlayer({ name: "Bursod", gender: "Male" }));
    store.dispatch(addPlayer({ name: "Larny", gender: "Female" }));
    store.dispatch(addPlayer({ name: "Sven", gender: "Male" }));
    store.dispatch(addPlayer({ name: "Hufeld", gender: "Male" }));
}

var userLang = (navigator.language || ((navigator as any).userLanguage as string) || "en").split(
    "-",
)[0];

const languages: NamedLanguage[] = [
    { code: "en", name: "English" },
    { code: "de", name: "Deutsch" },
];
store.dispatch(
    initialize({
        languages,
        translation: drinctetTranslations,
        options: { renderToStaticMarkup, defaultLanguage: userLang },
    }),
);

const Root = () => (
    <div style={{ height: "100%" }}>
        <Provider store={store}>
            <LocalizeProvider store={store}>
                <App />
            </LocalizeProvider>
        </Provider>
    </div>
);

render(<Root />, document.getElementById("root"));

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
