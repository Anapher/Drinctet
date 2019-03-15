import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";
import gameReducer from "../features/game/reducer";
import settingsReducer from "../features/settings/reducer";

const rootReducer = combineReducers({
    game: gameReducer,
    router: routerReducer,
    settings: settingsReducer,
});

export default rootReducer;
