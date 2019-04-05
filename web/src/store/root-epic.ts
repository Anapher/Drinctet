import { combineEpics } from "redux-observable";
import * as settingsEpics from "../features/settings/epics";
import * as gameEpics from "../features/game/epics";
import * as playEpics from "../features/play/epics";

export default combineEpics(...Object.values(settingsEpics), ...Object.values(gameEpics), ...Object.values(playEpics));
