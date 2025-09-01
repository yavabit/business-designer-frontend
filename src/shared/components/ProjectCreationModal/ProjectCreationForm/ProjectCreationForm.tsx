import { Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, type FC } from "react";
import { useCreateProjectMutation } from "@store/api/projects/projectsApi";

type CreateProjectTrigger = ReturnType<typeof useCreateProjectMutation>[0]

interface ProjectFormProps {
    createProject: CreateProjectTrigger;
    onSuccess: () => void;
}

export const ProjectCreationForm: FC<ProjectFormProps> = ({
    createProject,
    onSuccess,
}) => {
    const [form] = useForm();

    const createProjectHandler = () => {
        form.validateFields()
            .then((values) => {
                const newName = values["project-name"];
                createProject(newName).then((res) => {
                    if (res.data) {
                        onSuccess();
                        message.success(`Проект "${newName}" создан!`);
                    }
                    if (res.error) {
                        message.error("Ошибка при создании проекта!");
                    }
                });
            })
            .catch(() => {
                message.error("Пожалуйста, заполните обязательное поле!");
            });
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                createProjectHandler();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <Form
            layout="vertical"
            form={form}
            initialValues={{ "project-name": "" }}>
            <Form.Item
                name="project-name"
                label="Название проекта"
                rules={[
                    {
                        required: true,
                        message: "Пожалуйста, введите название проекта!",
                    },
                ]}>
                <Input autoFocus placeholder="Введите название проекта" />
            </Form.Item>
        </Form>
    );
};
