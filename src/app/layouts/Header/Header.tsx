import { Avatar, Button, Dropdown, Flex, type MenuProps } from "antd";
import { type FC } from "react";
import styles from "./Header.module.scss";
import { BsFillPersonFill } from "react-icons/bs";
import { BsPlus } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@store/index";
import { setCreationModal } from "@store/projects/projectsSlice";

export const Header: FC = () => {
    const isAuth = useSelector((state: RootState) => state.user.isAuth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logoutHandler = () => {
        const logout: () => Promise<{ message: string }> = () =>
            Promise.resolve({ message: "success" });
        logout().then((res) => {
            if (res.message === "success") {
                navigate("/login");
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

    const createItems: MenuProps = {
        items: [
            {
                label: "Проект",
                key: "0",
                onClick: () => dispatch(setCreationModal(true)),
            },
            {
                label: 'Процесс',
                onClick: () => alert("Create process"),
                key: "1",
            },
        ],
    };

    return (
        <header className={styles.header}>
            <Flex justify="space-between" align="center">
                <Flex align="center" gap={40} style={{ height: "2.5rem" }}>
                    <h2>BD</h2>
                    {isAuth && (
                        <Flex align="center" gap={24}>
                            <Link to="/" className={styles["header-link"]}>
                                Главная
                            </Link>
                            <Dropdown trigger={["click"]} menu={createItems}>
                                <Button style={{ padding: ".5rem" }}>
                                    <Flex align="center" gap={8}>
                                        <BsPlus size={24} />
                                    </Flex>
                                </Button>
                            </Dropdown>
                        </Flex>
                    )}
                </Flex>
                {isAuth && (
                    <Dropdown trigger={["click"]} menu={avatarItems}>
                        <Avatar
                            size={"large"}
                            src={undefined}
                            icon={<BsFillPersonFill />}
                            style={{ background: "#FFFFFF", color: "#090909" }}
                        />
                    </Dropdown>
                )}
            </Flex>
        </header>
    );
};
