import { Weighted } from "@core/weighted";
import { SourceInfo } from "SettingsModels";
import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { Card } from "@core/cards/card";

export const addSource = createStandardAction("ADD_SOURCE").map(
    (url: string): { payload: SourceInfo } => ({
        payload: {
            url,
            isLoading: false,
            errorMessage: undefined,
            cards: undefined,
            weight: 0.5,
            tags: []
        },
    }),
);
export const removeSource = createStandardAction("REMOVE_SOURCE")<string>();

export const loadSourceAsync = createAsyncAction(
    "LOAD_SOURCE_REQUEST",
    "LOAD_SOURCE_SUCCESS",
    "LOAD_SOURCE_FAILURE",
)<string, { url: string; cards: Card[] }, { url: string; message: string }>();

export const setSourceWeight = createStandardAction("SET_SOURCE_WEIGHT")<Weighted<string>>();

export const setPreferOppositeGenders = createStandardAction("SET_PREFER_OPPOSITE_GENDERS")<
    boolean
>();

export const setSocialMediaPlatform = createStandardAction("SET_SOCIAL_MEDIA_PLATFORM")<string>();

export const setSlideWeight = createStandardAction("SET_SLIDE_WEIGHT")<Weighted<string>>();

export const setTagWeight = createStandardAction("SET_TAG_WEIGHT")<Weighted<string>>();
