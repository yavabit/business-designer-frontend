import { Avatar, Button, Dropdown, Flex, Switch, type MenuProps } from "antd";
import { useEffect, useMemo, useState, type FC } from "react";
import styles from "./Header.module.scss";
import { BsFillPersonFill } from "react-icons/bs";
import { BsPlus } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@store/index";
import { setCreationModal } from "@store/projects/projectsSlice";
import { useGetProjectsQuery } from "@store/api/projects/projectsApi";
import { AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import { getCurrentThemeConfig, setThemeName } from "@store/user/themeSlice";
import { useAppSelector } from "@hooks/storeHooks";

export const Header: FC = () => {
  const currentTheme = useAppSelector(getCurrentThemeConfig);

  const isDarkMode = currentTheme.name === "light";

  const handleChangeSwitchTheme = (e: boolean) => {
    const selectedTheme = e ? "light" : "dark";

    dispatch(setThemeName(selectedTheme));
  };

  const isAuth = useSelector((state: RootState) => state.user.isAuth);
  const { data: projectsResponse, isLoading } = useGetProjectsQuery(
    {} as IGetAllParams,
    {
      skip: !isAuth,
    }
  );

  const projects = useMemo(
    () => projectsResponse?.data || [],
    [projectsResponse]
  );

  const [curProject, setCurProject] = useState<string | undefined>(undefined);
  // const [curProcess, setCurProcess] = useState<string | undefined>(undefined);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

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
        label: "Процесс",
        onClick: () => alert("Create process"),
        key: "1",
      },
    ],
  };

  useEffect(() => {
    const projects = projectsResponse?.data || [];

    const arrLocation = location.pathname.split("/");
    if (arrLocation[1] === "project" && !!arrLocation[2]) {
      const projectId = arrLocation[2];
      const project = projects.find((p) => p.id == projectId);

      if (project) {
        setCurProject(project.name);
      } else if (!isLoading) {
        setCurProject(undefined);
      }
    } else {
      setCurProject(undefined);
    }
  }, [location.pathname, projects, isLoading]);

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
              {!!curProject && (
                <Link to={`/project/${location.pathname.split("/")[2]}`}>
                  / {curProject}
                </Link>
              )}
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
                  style={{ background: "#FFFFFF", color: "#090909" }}
                />
              </Dropdown>
            </Flex>
          </div>
        )}
      </Flex>
    </header>
  );
};
