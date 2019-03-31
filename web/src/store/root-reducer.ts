import { combineReducers } from "redux";
import gameReducer from "../features/game/reducer";
import settingsReducer from "../features/settings/reducer";
import playReducer from "../features/play/reducer";
import { localizeReducer } from "react-localize-redux";

const rootReducer = combineReducers({
    play: playReducer,
    game: gameReducer,
    settings: settingsReducer,
    localize: localizeReducer,
});

export default rootReducer;
