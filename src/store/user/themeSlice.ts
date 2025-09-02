import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@store/index";
import { theme, type ThemeConfig } from "antd";


type ThemeType = { light: string, dark: string }

interface ThemeConfigExtend extends ThemeConfig {
	name: string
}

interface IConfig {
	[key: string]: ThemeConfigExtend
}

interface IThemeState {
	currentThemeName: string
	config: IConfig
}

const initialState: IThemeState = {
	currentThemeName: localStorage.getItem('theme') ?? 'light',
	config: {
		light: {
			name: 'light',
			algorithm: theme.defaultAlgorithm
		},
		dark: {
			name: 'dark',
			algorithm: theme.darkAlgorithm
		}
	}
}
const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		setThemeName: (state, { payload }: PayloadAction<keyof ThemeType>) => {
			localStorage.setItem('theme', payload)
			state.currentThemeName = payload;
		},
	},
});

export const getCurrentThemeConfig = (state: RootState) => state.theme.config[state.theme.currentThemeName];


export const themeReducer = themeSlice.reducer;
export const { setThemeName } = themeSlice.actions;