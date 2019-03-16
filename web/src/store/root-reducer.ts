import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";
import gameReducer from "../features/game/reducer";
import settingsReducer from "../features/settings/reducer";
import { localizeReducer } from 'react-localize-redux';

const rootReducer = combineReducers({
    game: gameReducer,
    router: routerReducer,
    settings: settingsReducer,
    localize: localizeReducer,
});

export default rootReducer;
