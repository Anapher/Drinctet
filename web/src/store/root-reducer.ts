import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import settingsReducer from "../features/settings/reducer";

const rootReducer = combineReducers({
    router: routerReducer,
    settings: settingsReducer
});

export default rootReducer;