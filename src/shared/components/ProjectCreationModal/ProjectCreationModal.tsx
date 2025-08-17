import type { RootState } from "@store/index";
import { setCreationModal } from "@store/projects/projectsSlice";
import { Flex, Form, Input, Modal, Upload } from "antd";
import { type FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsCloudUploadFill } from "react-icons/bs";

export const ProjectCreationModal: FC = () => {
    const isOpen = useSelector(
        (state: RootState) => state.projects.isCreationModalOpen
    );

    const dispath = useDispatch();

    return (
        <Modal
            title="Создать проект"
            open={isOpen}
            onOk={() => {}}
            onCancel={() => dispath(setCreationModal(false))}
            okText="Создать"
            cancelText="Отмена">
            <Form
                layout="vertical"
            >
                <Form.Item name='project-name' label='Название проекта' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="upload"
                    label="Upload"
                    valuePropName="fileList"
                    getValueFromEvent={() => {}}
                >
                    <Upload.Dragger name="project-pict" action="/upload.do" listType="picture">
                        <Flex gap={12}>
                            <BsCloudUploadFill size={24} />
                            <p>Добавить изобажение проекта</p>
                        </Flex>
                    </Upload.Dragger>
                </Form.Item>
            </Form>
        </Modal>
    );
};
