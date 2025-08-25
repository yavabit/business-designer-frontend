import { useCreateProjectMutation } from "@store/api/projects/projectsApi";
import type { RootState } from "@store/index";
import { setCreationModal } from "@store/projects/projectsSlice";
import { Form, Input, message, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import { type FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const ProjectCreationModal: FC = () => {
    const isOpen = useSelector(
        (state: RootState) => state.projects.isCreationModalOpen
    );
    const [createProject, data] = useCreateProjectMutation();

    const dispath = useDispatch();
    const navigate = useNavigate();

    const [form] = useForm();

    const createProjectHandler = () => {
        const newName = form.getFieldValue("project-name");
        if (!newName) {
            message.error(
                'Поле "Название проекта" является обязательным для заполенния!'
            );
            return;
        }

        createProject(newName).then((res) => {
            if (res.data) {
                dispath(setCreationModal(false));
                navigate("/");
                message.success(`Проект "${newName}" создан!`)
            }
            if (res.error) {
                message.error('Ошибка при создании проекта!')
            }
        });
    };

    return (
        <Modal
            open={isOpen}
            onOk={() => createProjectHandler()}
            onCancel={() => dispath(setCreationModal(false))}
            okText="Создать"
            cancelText="Отмена"
            loading={data.isLoading}>
            <Form layout="vertical" form={form}>
                <Form.Item
                    name="project-name"
                    label="Название проекта"
                    rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};
