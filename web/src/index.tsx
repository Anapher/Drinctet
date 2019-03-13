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

render(<Root />, document.getElementById("root"));
