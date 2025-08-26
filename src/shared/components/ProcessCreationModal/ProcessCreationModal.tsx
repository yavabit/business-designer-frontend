import type { RootState } from "@store/index";
import {
  createProcess,
  setProcessCreationModal,
} from "@store/process/processSlice";
import { Form, Input, Modal } from "antd";
import { type FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextArea from "antd/es/input/TextArea";
import { useForm } from "antd/es/form/Form";
import { useParams } from "react-router-dom";

interface IFormCreate {
  name: string;
  desc: string;
}

export const ProcessCreationModal: FC = () => {
  const [form] = useForm<IFormCreate>();

  const isOpen = useSelector(
    (state: RootState) => state.process.isCreationModalOpen
  );

  const dispath = useDispatch();

  const { projectId } = useParams();

  const handleClickCreate = () => {
    if (form && projectId) {
      dispath(
        createProcess({
          name: form.getFieldValue("name"),
          desc: form.getFieldValue("desc"),
					project_id: projectId
        })
      );
      dispath(setProcessCreationModal(false));
    }
  };

  return (
    <Modal
      title="Создать процесс"
      open={isOpen}
      onOk={handleClickCreate}
      onCancel={() => dispath(setProcessCreationModal(false))}
      okText="Создать"
      cancelText="Отмена"
    >
      <Form
        layout="vertical"
        onFinish={handleClickCreate}
        autoComplete="off"
        form={form}
      >
        <Form.Item name="name" label="Название" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="desc" label="Описание" rules={[{ required: true }]}>
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};
