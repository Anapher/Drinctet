// tslint:disable-next-line:no-import-side-effect
import "tslib";
// tslint:disable-next-line:no-import-side-effect
import "./env";

import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import Welcome from "./routes/welcome";
import store from "./store";
import "typeface-roboto";
import "./index.css";
import {addSource, loadSourceAsync} from "./features/settings/actions";
import { BrowserRouter as Router, Route } from "react-router-dom";

const Root = () => (
    <div style={{height: "100%"}}>
        <Provider store={store}>
            <Router>
                <Route path="/" component={Welcome} />
            </Router>
        </Provider>
    </div>
);

store.dispatch(addSource("http://localhost:3000/bullshitfact.xml"));
store.dispatch(loadSourceAsync.request("http://localhost:3000/bullshitfact.xml"));

render(<Root />, document.getElementById("root"));
