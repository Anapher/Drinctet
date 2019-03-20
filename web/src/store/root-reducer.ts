import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import gameReducer from "../features/game/reducer";
import settingsReducer from "../features/settings/reducer";
import { localizeReducer } from "react-localize-redux";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

const rootReducer = combineReducers({
    game: gameReducer,
    router: connectRouter(history),
    settings: settingsReducer,
    localize: localizeReducer,
});

export default rootReducer;
