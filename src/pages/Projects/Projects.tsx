import { useEffect, useState, type FC } from "react";
import { ItemsPageLayout } from "@app/layouts/ItemsPageLayout/ItemsPageLayout";
import styles from "./Projects.module.scss";
import { ProjectItem } from "./components/ProjectItem/ProjectItem";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCreationModal, setEditModal, setProjects } from "@store/projects/projectsSlice";
import {
    useDeleteProjectMutation,
    useLazyGetProjectsQuery,
    useUpdateProjectNameMutation,
} from "@store/api/projects/projectsApi";
import { Button, Flex } from "antd";

export const Projects: FC = () => {
    const [checked, setChecked] = useState<string | undefined>();
    const [editing, setEditing] = useState<string | undefined>();
    const [searchString, setSearchString] = useState<string>("");

    const [getProjects, { data: projectsData, isLoading, error }] =
        useLazyGetProjectsQuery();
    const [updateProject] = useUpdateProjectNameMutation();
    const [deleteProject] = useDeleteProjectMutation();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const projectsList = projectsData?.data || [];

    const handleItemClick = (id: string | undefined) => {
        setChecked(id);
        if (id === undefined) {
            setEditing(undefined);
        }
    };

    const handleItemDoubleClick = (id: string) => {
        navigate(`/project/${id}`);
    };

    const handleStartEditing = (id: string) => {
        setEditing(id);
    };

    const handleEndEditing = (id: string, newName: string) => {
        if (newName.trim()) {
            updateProject({ id, name: newName });
        }
        setEditing(undefined);
    };

    const handleDelete = (id: string) => {
        deleteProject(id);
    };

    useEffect(() => {
        return () => {
            setChecked(undefined);
        };
    }, []);

    useEffect(() => {
        getProjects().then(res => {
            if (res.data) {
                dispatch(setProjects(res.data.data))
            }

            if (res.error) {
                console.log(res.error)
            }
        });
    }, []);

    return (
        <ItemsPageLayout
            title="Мои проекты"
            action={() => dispatch(setCreationModal(true))}
            searchAction={(value: string) => setSearchString(value)}>
            {isLoading && <>Loading...</>}
            {error && <>Ошибка!</>}
            {!isLoading && !error && !projectsList.length && (
                <Flex vertical gap={12} align="center">
                    <p>Не создано ни одного проекта.</p>
                    <Button onClick={() => dispatch(setCreationModal(true))}>
                        Создать?
                    </Button>
                </Flex>
            )}
            {projectsData && (
                <div className={styles["folders-grid"]}>
                    {projectsList
                        .filter((p) =>
                            p.name
                                .toLowerCase()
                                .includes(searchString.toLowerCase())
                        )
                        .map((p) => (
                            <div className={styles["grid-item"]} key={p.id}>
                                <ProjectItem
                                    {...p}
                                    checked={checked === p.id}
                                    editing={editing === p.id}
                                    onClick={handleItemClick}
                                    onDoubleClick={handleItemDoubleClick}
                                    onStartEditing={handleStartEditing}
                                    onEndEditing={handleEndEditing}
                                    onDelete={() => handleDelete(p.id)}
                                    onGlobalEdit={() => dispatch(setEditModal({modalState: true, projectId: p.id}))}
                                />
                            </div>
                        ))}
                </div>
            )}
        </ItemsPageLayout>
    );
};
