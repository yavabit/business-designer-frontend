import { type FC } from "react";
import { Header } from "../Header/Header";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.scss";
import { ConfigProvider, Flex } from "antd";
import { ProjectCreationModal } from "@components/ProjectCreationModal/ProjectCreationModal";
import { ProcessCreationModal } from "@components/ProcessCreationModal/ProcessCreationModal";
import { ProjectEditModal } from "@components/ProjectEditModal/ProjectEditModal";
import { getCurrentThemeConfig } from "@store/user/themeSlice";
import { useAppSelector } from "@hooks/storeHooks";

export const Layout: FC = () => {
  const currentTheme = useAppSelector(getCurrentThemeConfig);

  return (
    <ConfigProvider theme={currentTheme}>
      <Flex vertical className={styles.layout}>
        <Header />
        <main className={styles["main-layout"]}>
          <Outlet />
        </main>
        <ProjectCreationModal />
        <ProcessCreationModal />
        <ProjectEditModal />
      </Flex>
    </ConfigProvider>
  );
};
