import { type Node, type NodeProps } from "@xyflow/react";
import { NodeWrapper } from "../../NodeWrapper";
import { MdEmail } from "react-icons/md";
import {
  AddFieldsNode,
  type DefaultNodeInfoFieldType,
} from "@components/Nodes/AddFieldsNode";
import { memo, useEffect, useState } from "react";
import { Badge, Checkbox, Flex, Form, Input, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import useDataNode from "@hooks/useDataNode";

type DefaultEmailInfoProps = {
  text: string;
  success: boolean;
  error: boolean;
};

const DefaultEmailInfo: React.FC<DefaultEmailInfoProps> = ({
  text,
  success,
  error,
}) => {
  return (
    <>
      <Typography.Text ellipsis={{ tooltip: text }}>{text}</Typography.Text>
      <Flex vertical>
        {success && <Badge status="success" text={"В случае успеха"} />}
        {error && <Badge status="success" text={"В случае ошибки"} />}
      </Flex>
    </>
  );
};

interface FieldType extends NodeCustomData {
  to: string;
  prev_success?: string;
  prev_error?: string;
}

export const EmailNode = memo((props: NodeProps<Node<NodeCustomData>>) => {
  const [emailForm] = useForm<FieldType>();
  const [defaultFields, setDefaultFields] = useState<
    DefaultNodeInfoFieldType[]
  >([]);

  const { setDataNode, getDataNode } = useDataNode<FieldType>();
  const nodeData = getDataNode();

  const filingDefaultFields = () => {
    setDefaultFields([
      {
        label: (
          <DefaultEmailInfo
            text={emailForm.getFieldValue("to")}
            success={emailForm.getFieldValue("prev_success")}
            error={emailForm.getFieldValue("prev_error")}
          />
        ),
      },
    ]);
  };

  useEffect(() => {
    emailForm.setFieldsValue(nodeData);

    filingDefaultFields();
  }, [nodeData]);

  const handleConfirmModal = () => {
    filingDefaultFields();
    setDataNode({
      data: emailForm.getFieldsValue(),
    });
  };

  return (
    <NodeWrapper
      node={props}
      handleBottom={false}
      handleTop={false}
      icon={<MdEmail />}
      overrideStyle={{ minWidth: 160 }}
    >
      <AddFieldsNode
        btnLabel={"Добавить отправку email"}
        handleConfirmModal={handleConfirmModal}
        defaultFields={defaultFields}
      >
        <Form form={emailForm} layout="vertical">
          <Form.Item label="Кому" required name={"to"}>
            <Input placeholder="https://example.com/api" />
          </Form.Item>
          <Form.Item label={"Содержание"} name={"text"}>
            <TextArea />
          </Form.Item>
          <Form.Item name={"prev_success"} valuePropName="checked">
            <Checkbox>Выполнять если предыдущий этап успешный</Checkbox>
          </Form.Item>
          <Form.Item name={"prev_error"} valuePropName="checked">
            <Checkbox>Выполнять если предыдущий этап не успешный</Checkbox>
          </Form.Item>
        </Form>
      </AddFieldsNode>
    </NodeWrapper>
  );
});
