import { LocalizeContextProps } from "react-localize-redux";
import { Translator } from "GameModels";

export function toTranslator(localize: LocalizeContextProps): Translator {
    return {
        languageCode: localize.activeLanguage.code,
        translate: x => localize.translate(x) as string,
    }
}