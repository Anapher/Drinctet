import { createSlice } from '@reduxjs/toolkit';

export interface SettingsState {
   socialMediaPlatform: string;
   preferOppositeGenders: boolean;
   playerArrangements: [string, string][];
}

const initialState: SettingsState = {
   socialMediaPlatform: 'Snapchat',
   preferOppositeGenders: true,
   playerArrangements: [],
};

const settingsSlice = createSlice({ name: 'settings', initialState, reducers: {} });

export default settingsSlice.reducer;
