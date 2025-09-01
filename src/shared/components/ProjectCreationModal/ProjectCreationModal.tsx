import { Modal, Button } from "antd";
import { type FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProjectCreationForm } from "./ProjectCreationForm/ProjectCreationForm";
import { setCreationModal } from "@store/projects/projectsSlice";
import type { RootState } from "@store/index";
import { useCreateProjectMutation } from "@store/api/projects/projectsApi";

export const ProjectCreationModal: FC = () => {
    const isOpen = useSelector(
        (state: RootState) => state.projects.isCreationModalOpen
    );
    const [createProject, { isLoading }] = useCreateProjectMutation();
    const dispatch = useDispatch();

    const handleCancel = () => {
        dispatch(setCreationModal(false));
    };

    const handleSuccess = () => {
        dispatch(setCreationModal(false));
    };

    if (!isOpen) {
        return null;
    }

    return (
        <Modal
            open={true}
            onCancel={handleCancel}
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
                    Создать
                </Button>,
            ]}>
            <ProjectCreationForm
                createProject={createProject}
                onSuccess={handleSuccess}
            />
        </Modal>
    );
};
