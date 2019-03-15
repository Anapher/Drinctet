// tslint:disable-next-line:no-import-side-effect
import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "tslib";
import "typeface-roboto";
// tslint:disable-next-line:no-import-side-effect
import "./env";
import { addSource, loadSourceAsync } from "./features/settings/actions";
import "./index.css";
import Welcome from "./routes/welcome";
import store from "./store";

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
