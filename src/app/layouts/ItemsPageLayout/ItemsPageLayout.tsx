import { type FC, type ReactNode } from "react";
import styles from "./ItemsPageLayout.module.scss";
import { Button, Flex, Input } from "antd";
import { BsPlus } from "react-icons/bs";

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
                <h3 
                    style={{ 
                        fontSize: "24px", 
                        fontWeight: 500 
                    }}
                >
                        {title}
                </h3>
                <Flex gap={12}>
                    {!!action && (
                        <Button onClick={() => action()}>
                            {actionTitle 
                                ? actionTitle 
                                : (
                                    <Flex gap={8} align="center">
                                        <BsPlus size={20}/>
                                        <b>Создать</b>
                                    </Flex>
                                )}
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
