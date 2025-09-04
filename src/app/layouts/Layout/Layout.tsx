import { type FC } from "react";
import { Header } from "../Header/Header";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.scss";
import { Flex } from "antd";
import { ProjectCreationModal } from "@components/ProjectCreationModal/ProjectCreationModal";
import { ProcessCreationModal } from "@components/ProcessCreationModal/ProcessCreationModal";
import { ProjectEditModal } from "@components/ProjectEditModal/ProjectEditModal";
import { useTheme } from "@hooks/useTheme";

export const Layout: FC = () => {
	
		const { token } = useTheme();

  return (
    <Flex vertical className={styles.layout} style={{ backgroundColor: token.colorBgContainer, color: token.colorTextBase }}>
      <Header />
      <main className={styles["main-layout"]}>
        <Outlet />
      </main>
      <ProjectCreationModal />
      <ProcessCreationModal />
      <ProjectEditModal />
    </Flex>
  );
};
