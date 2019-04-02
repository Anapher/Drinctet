declare module "SettingsModels" {
    export interface SourceInfo {
        url: string;
        isLoading: boolean;
        errorMessage: string | null;
        cards: import("../../core/cards/card").Card[] | null;
        weight: number;
        tags: string[];
    }
}
