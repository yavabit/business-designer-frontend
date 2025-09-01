import { Form, Input, Upload, type UploadFile, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState, type FC } from "react";
import type { UploadChangeParam } from "antd/es/upload";
import { useUpdateProjectDataMutation } from "@store/api/projects/projectsApi";

type UpdateProjectTrigger = ReturnType<typeof useUpdateProjectDataMutation>[0];

interface ProjectEditFormProps {
    project: IProject;
    updateProject: UpdateProjectTrigger;
    onSuccess: () => void;
}

export const ProjectEditForm: FC<ProjectEditFormProps> = ({
    project,
    updateProject,
    onSuccess,
}) => {
    const [form] = useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleUploadChange = (info: UploadChangeParam<UploadFile>) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-1);
        setFileList(newFileList);
    };

    const updateProjectHandler = () => {
        form.validateFields()
            .then(async (values) => {
                try {
                    const newName = values["project-name"];

                    if (!newName) {
                        message.error(
                            'Поле "Название проекта" является обязательным для заполнения!'
                        );
                        return;
                    }

                    const formData = new FormData();
                    formData.append("name", newName);

                    if (fileList.length > 0 && fileList[0].originFileObj) {
                        formData.append("photo", fileList[0].originFileObj);
                    }

                    const result = await updateProject({
                        id: project.id,
                        data: formData,
                    }).unwrap();

                    if (result.message) {
                        message.success("Проект успешно обновлен!");
                        onSuccess();
                    }
                } catch (error) {
                    console.error("Ошибка при обновлении проекта:", error);
                    message.error("Ошибка при обновлении проекта");
                }
            })
            .catch(() => {
                message.error("Пожалуйста, заполните обязательное поле!");
            });
    };

    useEffect(() => {
        form.setFieldsValue({
            "project-name": project.name,
        });
    }, [project, form]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                updateProjectHandler();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [updateProjectHandler]);

    return (
        <Form
            layout="vertical"
            form={form}
            initialValues={{ "project-name": project.name }}>
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
            <Form.Item
                name="project-picture"
                label="Обложка проекта"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                        return e;
                    }
                    return e?.fileList;
                }}>
                <Upload.Dragger
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={() => false}
                    maxCount={1}
                    listType="picture"
                    accept="image/*">
                    <p className="ant-upload-text">
                        Нажмите или перетащите файл
                    </p>
                    <p className="ant-upload-hint">
                        Поддерживаются только изображения
                    </p>
                </Upload.Dragger>
            </Form.Item>
        </Form>
    );
};