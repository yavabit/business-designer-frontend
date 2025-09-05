import { FolderIcon } from "@components/FolderIcon/FolderIcon";
import { Flex, Input, type InputRef, Dropdown, type MenuProps } from "antd";
import { useEffect, useRef, useState, type FC } from "react";
import styles from "./ProjectItem.module.scss";
import { BsTrashFill } from "react-icons/bs";
import { BsFillPencilFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import type { RootState } from "@store/index";
import dayjs from "dayjs";

export const ProjectItem: FC<
    IProject & {
        checked: boolean;
        editing: boolean;
        onClick: (id: string | undefined) => void;
        onDoubleClick: (id: string) => void;
        onStartEditing: (id: string) => void;
        onEndEditing: (id: string, newName: string) => void;
        onDelete: (id: string) => void;
        onGlobalEdit: (id: string) => void;
    }
> = ({
    id,
    name,
    pict_url,
    author_id,
    author_name,
    updated_at,
    checked,
    editing,
    onClick,
    onDoubleClick,
    onStartEditing,
    onEndEditing,
    onDelete,
    onGlobalEdit,
}) => {
    const [nameValue, setNameValue] = useState<string>(name);

    const inputRef = useRef<InputRef>(null);
    const itemRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    const userId = useSelector((state: RootState) => state.user.id);

    const handleItemClick = () => {
        onClick(id);
    };

    const handleItemDoubleClick = () => {
        onDoubleClick(id);
    };

    const handleTextClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (checked) {
            onStartEditing(id);
        } else {
            onClick(id);
        }
    };

    const handleEditConfirm = () => {
        if (nameValue.trim()) {
            onEndEditing(id, nameValue);
        } else {
            onEndEditing(id, name);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleEditConfirm();
        } else if (e.key === "Escape") {
            onEndEditing(id, name);
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!checked) {
            onClick(id);
        }
    };

    const showDeleteConfirm = () => {
        const shouldDelete = window.confirm(`Удалить проект "${name}"?`);
        if (shouldDelete) {
            onDelete(id);
            onClick(undefined);
        }
    };

    const menu: MenuProps = {
        items: [
            {
                key: "edit",
                label: "Редактировать",
                icon: <BsFillPencilFill size={16} />,
                onClick: () => onGlobalEdit(id),
            },
            {
                key: "delete",
                label: "Удалить",
                icon: <BsTrashFill size={16} />,
                danger: true,
                onClick: () => showDeleteConfirm(),
            },
        ],
    };

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus({ cursor: "all" });
            inputRef.current.select();
        }
    }, [editing]);

    return (
        <Dropdown
            menu={menu}
            trigger={["contextMenu"]}
            disabled={userId !== author_id}>
            <div
                title={`Автор: ${author_name}, обновлено: ${dayjs(
                    updated_at
                ).format("DD.MM.YYYY HH:mm")}`}
                ref={itemRef}
                onDoubleClick={handleItemDoubleClick}
                onClick={handleItemClick}
                onContextMenu={handleContextMenu}
                className={`${styles["project-item"]} ${
                    checked ? styles.checked : ""
                }`}>
                <Flex vertical gap={4}>
                    {pict_url ? (
                        <div
                            className={styles["project-pict"]}
                            style={{
                                background: `url('${pict_url}') center / cover no-repeat`,
                            }}></div>
                    ) : (
                        <FolderIcon />
                    )}
                    {editing ? (
                        <Input
                            ref={inputRef}
                            name="edit"
                            value={nameValue}
                            onChange={(e) => setNameValue(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onPressEnter={handleEditConfirm}
                            onBlur={handleEditConfirm}
                            onKeyDown={handleKeyDown}
                            className={styles.input}
                        />
                    ) : (
                        <p
                            ref={textRef}
                            onClick={(e) => {
                                if (userId == author_id) {
                                    handleTextClick(e);
                                }
                            }}
                            className={styles.text}
                            title={name.length > 15 ? name : ""}>
                            {name}
                        </p>
                    )}
                </Flex>
            </div>
        </Dropdown>
    );
};
