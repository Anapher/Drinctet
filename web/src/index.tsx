import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import "tslib";
import "typeface-roboto";
import App from "./App";
import "./env";
import { addPlayer, addSource, loadSourceAsync } from "./features/settings/actions";
import "./index.css";
import store from "./store";
import { initialize, LocalizeProvider } from "react-localize-redux";
import drinctetTranslations from "./loc/drinctet.json";
import { renderToStaticMarkup } from "react-dom/server";

const defaultSources = [
    "https://raw.githubusercontent.com/Anapher/Drinctet/master/web/public/bullshitfact.xml",
];

for (const src of defaultSources) {
    store.dispatch(addSource(src));
    store.dispatch(loadSourceAsync.request(src));
}

store.dispatch(addPlayer({ name: "Vincent", gender: "Male" }));
store.dispatch(addPlayer({ name: "Melina", gender: "Female" }));

var userLang = (navigator.language || (navigator as any).userLanguage as string || "en").split("-")[0];

const languages = ["en", "de"];
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
