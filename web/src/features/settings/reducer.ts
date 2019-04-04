import { Weighted } from "@core/weighted";
import { RootAction } from "DrinctetTypes";
import { SourceInfo } from "SettingsModels";
import { combineReducers } from "redux";
import { getType } from "typesafe-actions";
import * as actions from "./actions";
import { slideWeights } from "../../preferences";
import _ from "lodash";

export type SettingsState = Readonly<{
    preferOppositeGenders: boolean;
    slides: Array<Weighted<string>>;
    socialMediaPlatform: string;
    sources: SourceInfo[];
    tags: Array<Weighted<string>>;
}>;

export default combineReducers<SettingsState, RootAction>({
    sources: (state = [], action) => {
        switch (action.type) {
            case getType(actions.addSource):
                return [...state, action.payload];
            case getType(actions.removeSource):
                return state.filter(x => x.url !== action.payload);
            case getType(actions.loadSourceAsync.request):
                return state.map(item =>
                    item.url === action.payload ? { ...item, isLoading: true } : item,
                );
            case getType(actions.loadSourceAsync.success):
                return state.map(item =>
                    item.url === action.payload.url
                        ? {
                              ...item,
                              cards: action.payload.cards,
                              errorMessage: null,
                              isLoading: false,
                              tags: _.uniq(
                                  _.flatten(action.payload.cards.map(x => x.tags)).map(x =>
                                      (x as string).toLowerCase(),
                                  ),
                              ),
                          }
                        : item,
                );
            case getType(actions.loadSourceAsync.failure):
                return state.map(item =>
                    item.url === action.payload.url
                        ? { ...item, isLoading: false, errorMessage: action.payload.message }
                        : item,
                );
            case getType(actions.setSourceWeight):
                return state.map(item =>
                    item.url === action.payload.value
                        ? { ...item, weight: action.payload.weight }
                        : item,
                );
            default:
                return state;
        }
    },
    preferOppositeGenders: (state = true, action) => {
        if (action.type === getType(actions.setPreferOppositeGenders)) {
            return action.payload;
        }
        return state;
    },
    slides: (state = GetSlideWeightedArray(), action) => {
        switch (action.type) {
            case getType(actions.setSlideWeight):
                return state.map(x => (x.value === action.payload.value ? action.payload : x));
            case getType(actions.resetWeights):
                return GetSlideWeightedArray();
            default:
                return state;
        }
    },
    socialMediaPlatform: (state = "Snapchat", action) => {
        if (action.type === getType(actions.setSocialMediaPlatform)) {
            return action.payload;
        }

        return state;
    },
    tags: (state = [], action) => {
        switch (action.type) {
            case getType(actions.setTagWeight):
                const value = action.payload.value.toLowerCase();
                const existingTag = state.find(x => x.value === value);
                if (existingTag !== undefined) {
                    return state.map(x =>
                        x.value === value ? { value, weight: action.payload.weight } : x,
                    );
                } else {
                    return [...state, action.payload];
                }
            case getType(actions.resetWeights):
                return state.map(x => ({ ...x, weight: 0.5 }));
            default:
                return state;
        }
    },
});

function GetSlideWeightedArray() {
    const weightsList: Weighted<string>[] = [];
    for (const key in slideWeights) {
        if (slideWeights.hasOwnProperty(key)) {
            const element = slideWeights[key];
            weightsList.push({ value: key, weight: element });
        }
    }

    return weightsList;
}
