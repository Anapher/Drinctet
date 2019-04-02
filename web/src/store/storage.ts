import { RootState } from "DrinctetTypes";
import { SettingsState } from "../features/settings/reducer";

export function persistState(store: any) {
    store.subscribe(() => {
        const state: RootState = store.getState();
        const toStore: SettingsState = {
            ...state.settings,
            sources: state.settings.sources.map(x => ({
                url: x.url,
                weight: x.weight,
                isLoading: false,
                cards: null,
                errorMessage: null,
                tags: []
            })),
        };
        localStorage.setItem("settingsState", JSON.stringify(toStore));
    });
}

export function loadState(): Partial<RootState> {
    const settings = localStorage.getItem("settingsState");
    const state = settings !== null ? JSON.parse(settings) : {};
    return { settings: state };
}
