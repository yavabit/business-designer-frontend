import { Modal, Button } from "antd";
import { useEffect, type FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEditModal } from "@store/projects/projectsSlice";
import type { RootState } from "@store/index";
import {
    useUpdateProjectDataMutation,
    useLazyGetProjectByIdQuery,
} from "@store/api/projects/projectsApi";
import { ProjectEditForm } from "./components/ProjectEditForm";

export const ProjectEditModal: FC = () => {
    const isOpen = useSelector(
        (state: RootState) => state.projects.isEditModalOpen
    );
    const projectId = useSelector(
        (state: RootState) => state.projects.editingId
    );
    const projects = useSelector((state: RootState) => state.projects.projects);

    const [updateProject, { isLoading }] = useUpdateProjectDataMutation();
    const [getProjectById, { data: projectData, isLoading: isProjectLoading }] =
        useLazyGetProjectByIdQuery();
    const dispatch = useDispatch();

    const localProject = projects.find((p) => p.id === projectId);

    useEffect(() => {
        if (isOpen && projectId && !localProject) {
            getProjectById(projectId);
        }
    }, [isOpen, projectId, localProject, getProjectById]);

    const handleCancel = () => {
        dispatch(setEditModal({ modalState: false }));
    };

    const handleSuccess = () => {
        dispatch(setEditModal({ modalState: false }));
    };

    if (!isOpen) {
        return null;
    }

    const project = localProject || projectData?.data;

    return (
        <Modal
            open={true}
            onCancel={handleCancel}
            loading={isProjectLoading}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Отмена
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isLoading}
                    onClick={() => {
                        const event = new KeyboardEvent("keydown", {
                            key: "Enter",
                            bubbles: true,
                        });
                        document.dispatchEvent(event);
                    }}>
                    Сохранить
                </Button>,
            ]}>
            {project ? (
                <ProjectEditForm
                    project={project}
                    updateProject={updateProject}
                    onSuccess={handleSuccess}
                />
            ) : (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <p>Проект не найден</p>
                    <Button onClick={handleCancel}>Закрыть</Button>
                </div>
            )}
        </Modal>
    );
};
