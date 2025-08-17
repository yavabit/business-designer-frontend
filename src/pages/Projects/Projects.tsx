import { useEffect, useState, type FC } from "react";
import { ItemsPageLayout } from "@app/layouts/ItemsPageLayout/ItemsPageLayout";
import styles from "./Projects.module.scss";
import projects from "../../shared/mocks/projects.json";
import { ProjectItem } from "./components/ProjectItem/ProjectItem";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCreationModal } from "@store/projects/projectsSlice";

export const Projects: FC = () => {
    const [projectsList, setProjectsList] = useState<IProject[]>(
        projects as unknown as IProject[]
    );

    const [checked, setChecked] = useState<number | undefined>();
    const [editing, setEditing] = useState<number | undefined>();
    const [searchString, setSearchString] = useState<string>("");

    const navigate = useNavigate();
	const dispatch = useDispatch();

    const handleItemClick = (id: number | undefined) => {
        setChecked(id);
        if (id === undefined) {
            setEditing(undefined);
        }
    };

    const handleItemDoubleClick = (id: number) => {
        navigate(`/project/${id}`);
    };

    const handleStartEditing = (id: number) => {
        setEditing(id);
    };

    const handleEndEditing = (id: number, newName: string) => {
        if (newName.trim()) {
            setProjectsList(
                projectsList.map((item) =>
                    item.id === id ? { ...item, name: newName } : item
                )
            );
        }
        setEditing(undefined);
    };

    useEffect(() => {
        return () => {
            setChecked(undefined);
        };
    }, []);

    return (
        <ItemsPageLayout
            title="Мои проекты"
            action={() => dispatch(setCreationModal(true))}
            searchAction={(value: string) => setSearchString(value)}
		>
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
                                onDelete={() => alert("Delete project")}
                                onGlobalEdit={() => alert("Edit project")}
                            />
                        </div>
                    ))}
            </div>
        </ItemsPageLayout>
    );
};
