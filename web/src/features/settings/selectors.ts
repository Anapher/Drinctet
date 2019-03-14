import {SettingsState} from "./reducer";

export const getPlayers = (state: SettingsState) => state.players;

export const getSources = (state: SettingsState) => state.sources;
