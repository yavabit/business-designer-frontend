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

const globalToken = {
	fontFamily: `"Roboto Flex", sans-serif`
}

const initialState: IThemeState = {
	currentThemeName: localStorage.getItem('theme') ?? 'light',
	config: {
		light: {
			name: 'light',
			algorithm: theme.defaultAlgorithm,
			token: {
				...globalToken
			}
		},
		dark: {
			name: 'dark',
			algorithm: theme.darkAlgorithm,
			token: {
				...globalToken
			}
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