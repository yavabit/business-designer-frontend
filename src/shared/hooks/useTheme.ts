import { useAppSelector } from "@hooks/storeHooks";
import { getCurrentThemeConfig } from "@store/user/themeSlice";

export const useTheme = () => {

	const currentTheme = useAppSelector(getCurrentThemeConfig);

	const isDarkMode = currentTheme.name === "light";

	return {
		currentTheme,
		isDarkMode
	}
}