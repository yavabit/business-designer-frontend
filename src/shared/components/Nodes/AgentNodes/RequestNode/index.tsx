import { type Node, type NodeProps } from "@xyflow/react";
import { NodeWrapper } from "../../NodeWrapper";
import { MdHttp } from "react-icons/md";
import { AddFieldsNode, type DefaultNodeInfoFieldType } from "@components/Nodes/AddFieldsNode";
import { memo, useState } from "react";
import { Badge, Form, Input, InputNumber, Space, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useForm } from "antd/es/form/Form";

type DefaultRequestInfoProps = {
	text: string;
	successText: string;
	errorText: string;
}

const DefaultRequestInfo: React.FC<DefaultRequestInfoProps> = ({ text, successText, errorText }) => {
	return (
		<>
			<Typography.Text ellipsis={{ tooltip: text }}>{text}</Typography.Text>
			<Space>
				<Badge status="error" text={errorText}/>
				<Badge status="success" text={successText}/>
			</Space>
		</>
	);
};

type FieldType = {
  url: string;
  passed: string;
  cancel: string;
  body?: string;
};

export const RequestNode = memo((props: NodeProps<Node<NodeCustomData>>) => {
	const [requestForm] = useForm<FieldType>();
	const [defaultFields, setDefaultFields] = useState<DefaultNodeInfoFieldType[]>([]);

	const handleConfirmModal = () => {
		const result = [];
		result.push({
			label: <DefaultRequestInfo 
				text={requestForm.getFieldValue("url")} 
				successText={requestForm.getFieldValue("passed")}
				errorText={requestForm.getFieldValue("cancel")}
			/>,
		});
		setDefaultFields(result);
	};

	return (
		<NodeWrapper
			node={props}
			isNeedInput={false}
			title={"Запрос"}
			handleBottom={false}
			handleTop={false}
			icon={<MdHttp />}
		>
			{
				<AddFieldsNode
					btnLabel={"Добавить запрос"}
					handleConfirmModal={handleConfirmModal}
					defaultFields={defaultFields}
				>
					<Form form={requestForm} layout="vertical">
						<Form.Item label="url" required name={"url"}>
							<Input placeholder="https://example.com/api" />
						</Form.Item>
						<Form.Item label={"Тело запроса"} name={"body"}>
							<TextArea />
						</Form.Item>
						<Form.Item label={"Идти далее если ответ сервера"} name="passed" required>
							<InputNumber placeholder="200" />
						</Form.Item>
						<Form.Item
							label={"Прервать процесс если ответ сервера"}
							name="cancel"
							required
						>
							<InputNumber placeholder="500" />
						</Form.Item>
					</Form>
				</AddFieldsNode>
			}
		</NodeWrapper>
	);
});
