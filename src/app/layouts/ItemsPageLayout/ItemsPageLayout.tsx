import { type FC, type ReactNode } from "react";
import styles from "./ItemsPageLayout.module.scss";
import { Button, Flex, Input } from "antd";

export const ItemsPageLayout: FC<{
    children: ReactNode;
    title?: string;
    action?: () => void;
    actionTitle?: ReactNode;
    searchAction?: (value: string) => void;
}> = ({ children, title, action, actionTitle, searchAction }) => {
    return (
        <Flex vertical gap={20} className={styles["items-page"]}>
            <Flex
                align="center"
                justify="space-between"
                className={styles["page-header"]}>
                <h3 style={{ fontSize: "24px" }}>{title}</h3>
                <Flex gap={12}>
                    {!!action && (
                        <Button onClick={() => action()}>
                            {actionTitle ? actionTitle : <b>Создать</b>}
                        </Button>
                    )}
                    {!!searchAction && (
                        <Input
                            placeholder="Найти..."
                            name="projects-search"
                            onChange={(e) => searchAction(e.target.value)}
                        />
                    )}
                </Flex>
            </Flex>
            {children}
        </Flex>
    );
};
