import { Avatar, Dropdown, Flex, message, Switch, type MenuProps } from "antd";
import { type FC } from "react";
import styles from "./Header.module.scss";
import { BsFillPersonFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { persistor, type RootState } from "@store/index";
import { AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import { useTheme } from "@hooks/useTheme";
import { setThemeName } from "@store/user/themeSlice";
import logoLight from "../../../shared/assets/img/logo_light.svg";
import logoDark from "../../../shared/assets/img/logo_dark.svg";
import { useLogoutMutation } from "@store/api/user/userApi";
import { reset } from "@store/user/userSlice";

export const Header: FC = () => {
    const { isDarkMode, token } = useTheme();

    const handleChangeSwitchTheme = (e: boolean) => {
        const selectedTheme = e ? "dark" : "light";

        dispatch(setThemeName(selectedTheme));
    };

    const isAuth = useSelector((state: RootState) => state.user.isAuth);
    const [logout] = useLogoutMutation();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logoutHandler = () => {
        logout().then((res) => {
            if (res.data) {
                navigate("/login");
                dispatch(reset());
                persistor.purge();
            }
            if (res.error) {
                message.error("Ошибка во время выхода");
            }
        });
    };

    const avatarItems: MenuProps = {
        items: [
            {
                label: <Link to="/me">Профиль</Link>,
                key: "0",
            },
            {
                label: "Выйти",
                key: "1",
                danger: true,
                onClick: () => logoutHandler(),
            },
        ],
    };

    return (
        <header
            className={`${styles.header} ${isDarkMode ? styles.dark : ""}`}
            style={{ borderBottom: `1px solid ${token.colorBorder}` }}
        >
            <Flex justify="space-between" align="center">
                <Flex align="center" gap={40} style={{ height: "2.5rem" }}>
                    <Link
                        to="/"
                        style={{ display: "flex", alignItems: "center" }}>
                        {isDarkMode ? (
                            <img src={logoLight} alt="BD" width={40} />
                        ) : (
                            <img src={logoDark} alt="BD" width={40} />
                        )}
                    </Link>
                </Flex>
                {isAuth && (
                    <div>
                        <Flex justify="center" align="center" gap={10}>
                            <Switch
                                checkedChildren={<AiOutlineSun />}
                                unCheckedChildren={<AiOutlineMoon />}
                                defaultChecked={isDarkMode}
                                onChange={handleChangeSwitchTheme}
                            />
                            <Dropdown trigger={["click"]} menu={avatarItems}>
                                <Avatar
                                    size={"large"}
                                    src={undefined}
                                    icon={<BsFillPersonFill />}
                                />
                            </Dropdown>
                        </Flex>
                    </div>
                )}
            </Flex>
        </header>
    );
};
