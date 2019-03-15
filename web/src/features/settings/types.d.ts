declare module "SettingsModels" {
    export interface SourceInfo {
        url: string;
        isLoading: boolean;
        errorMessage: string | undefined;
        cards: import("../../core/cards/card").Card[] | undefined;
        weight: number;
    }
}
