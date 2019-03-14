declare module "SettingsModels" {
    export interface SourceInfo {
        url: string;
        isLoading: boolean;
        errorMessage: string | undefined;
        cards: Card[] | undefined;
    }
}