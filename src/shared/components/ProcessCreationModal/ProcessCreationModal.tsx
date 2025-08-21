import type { RootState } from "@store/index";
import {
  createProcess,
  setProcessCreationModal,
} from "@store/process/processSlice";
import { Form, Input, Modal, type FormInstance } from "antd";
import { useRef, useState, type FC, type RefObject } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextArea from "antd/es/input/TextArea";
import { useForm } from "antd/es/form/Form";

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

  const handleClickCreate = () => {
    if (form) {
      dispath(createProcess(form.getFieldValue()));
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
