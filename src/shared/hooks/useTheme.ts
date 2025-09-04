import { useAppSelector } from "@hooks/storeHooks";
import { getCurrentThemeConfig } from "@store/user/themeSlice";
import { theme } from "antd";

const { useToken } = theme;

export const useTheme = () => {

	const { token } = useToken();


	const currentTheme = useAppSelector(getCurrentThemeConfig);

	const isDarkMode = currentTheme.name === "light";

	return {
		currentTheme,
		isDarkMode,
		token
	}
}