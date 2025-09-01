import { type FC, type ReactNode, useState } from "react";
import styles from "./ItemsPageLayout.module.scss";
import { Button, Flex, Input, Select } from "antd";
import { BsPlus, BsSortDown, BsSortUp, BsFilter } from "react-icons/bs";

const { Option } = Select;

export const ItemsPageLayout: FC<{
    children: ReactNode;
    title?: string;
    action?: () => void;
    actionTitle?: ReactNode;
    searchAction?: (value: string) => void;
    sortFieldAction?: (value: string) => void;
    sortOrderAction?: (value: string) => void;
}> = ({
    children,
    title,
    action,
    actionTitle,
    searchAction,
    sortFieldAction,
    sortOrderAction,
}) => {
    const [searchValue, setSearchValue] = useState("");
    const [sortField, setSortField] = useState<string>("updated_at");
    const [sortOrder, setSortOrder] = useState<string>("DESC");

    const sortOptions = [
        { value: "name", label: "По названию" },
        { value: "created_at", label: "По дате создания" },
        { value: "updated_at", label: "По дате обновления" },
    ];

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        searchAction?.(value);
    };

    const handleSortFieldChange = (value: string) => {
        setSortField(value);
        sortFieldAction?.(value);
    };

    const toggleSortOrder = () => {
        const newOrder = sortOrder === "ASC" ? "DESC" : "ASC";
        setSortOrder(newOrder);
        sortOrderAction?.(newOrder);
    };

    return (
        <Flex vertical gap={20} className={styles["items-page"]}>
            <Flex
                align="center"
                justify="space-between"
                className={styles["page-header"]}>
                <h3 style={{ fontSize: "24px", fontWeight: 500, margin: 0 }}>
                    {title}
                </h3>
                {!!action && (
                    <Button onClick={() => action()}>
                        {actionTitle ? (
                            actionTitle
                        ) : (
                            <Flex gap={8} align="center">
                                <BsPlus size={20} />
                                <b>Создать</b>
                            </Flex>
                        )}
                    </Button>
                )}
            </Flex>

            <Flex gap={12} align="center" wrap="wrap">
                {!!searchAction && (
                    <Input
                        placeholder="Найти..."
                        value={searchValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        style={{ width: 200 }}
                        allowClear
                    />
                )}

                {!!sortFieldAction && (
                    <Select
                        placeholder="Сортировать по"
                        value={sortField}
                        onChange={handleSortFieldChange}
                        style={{ width: 180 }}
                        suffixIcon={<BsFilter />}>
                        {sortOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                )}

                {!!sortOrderAction && (
                    <Button
                        onClick={toggleSortOrder}
                        disabled={!sortField}
                        icon={
                            sortOrder === "ASC" ? <BsSortUp /> : <BsSortDown />
                        }
                        title={
                            sortOrder === "ASC"
                                ? "По возрастанию"
                                : "По убыванию"
                        }>
                    </Button>
                )}
            </Flex>

            {children}
        </Flex>
    );
};
