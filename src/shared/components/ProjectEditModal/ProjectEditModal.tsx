import { useUpdateProjectDataMutation } from "@store/api/projects/projectsApi";
import type { RootState } from "@store/index";
import { setEditModal } from "@store/projects/projectsSlice";
import { Form, Input, message, Modal, Upload, type UploadFile } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState, type FC } from "react";
import { useDispatch, useSelector } from "react-redux";

export const ProjectEditModal: FC = () => {
    const isOpen = useSelector(
        (state: RootState) => state.projects.isEditModalOpen
    );
    const projectId = useSelector((state: RootState) => state.projects.editingId);
    const projects = useSelector((state: RootState) => state.projects.projects)

    const [project, setProject] = useState<IProject>();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [updateProject, { isLoading }] = useUpdateProjectDataMutation();

    const dispatch = useDispatch();
    const [form] = useForm();

    const handleUploadChange = (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-1);
        setFileList(newFileList);
    };


    const editProjectHandler = async (): Promise<void> => {
        try {
            const values = await form.validateFields();
            const newName = values['project-name'];
            
            if (!newName) {
                message.error('Поле "Название проекта" является обязательным для заполнения!');
                return;
            }

            if (!projectId) {
                message.error('ID проекта не найден');
                return;
            }

            const formData = new FormData();
            formData.append('name', newName);

            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('photo', fileList[0].originFileObj);
            }

            const result = await updateProject({
                id: projectId,
                data: formData
            }).unwrap();

            if (result.message) {
                message.success('Проект успешно обновлен!');
                form.resetFields();
                setFileList([]);
                dispatch(setEditModal({ modalState: false }));
            }

        } catch (error) {
            console.error('Ошибка при обновлении проекта:', error);
            message.error('Ошибка при обновлении проекта');
        }
    };

    useEffect(() => {
        const curProject = projects.find(p => p.id == projectId);
        if (curProject) {
            setProject(curProject);

            form.setFieldsValue({
                'project-name': curProject.name,
            });

        } else {
            dispatch(setEditModal({modalState: false}));
        }
    }, [projectId, projects, form]);

    return (
        <Modal
            open={isOpen}
            onOk={editProjectHandler}
            onCancel={() => dispatch(setEditModal({modalState: false}))}
            okText="Сохранить"
            cancelText="Отмена"
            confirmLoading={isLoading}
        >
            <Form 
                layout="vertical" 
                form={form} 
                initialValues={{
                    'project-name': project?.name,
                }}
            >
                <Form.Item
                    name="project-name"
                    label="Название проекта"
                    rules={[{ 
                        required: true, 
                        message: 'Введите название проекта' 
                    }]}
                >
                    <Input />
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
                    }}
                >
                    <Upload.Dragger 
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={() => false}
                        maxCount={1}
                        listType="picture"
                        accept="image/*"
                    >
                        <p className="ant-upload-text">Нажмите или перетащите файл</p>
                        <p className="ant-upload-hint">Поддерживаются только изображения</p>
                    </Upload.Dragger>
                </Form.Item>
            </Form>
        </Modal>
    );
};
