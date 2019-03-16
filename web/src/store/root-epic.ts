import { combineEpics } from "redux-observable";
import * as settingsEpics from "../features/settings/epics";

export default combineEpics(...Object.values(settingsEpics));
