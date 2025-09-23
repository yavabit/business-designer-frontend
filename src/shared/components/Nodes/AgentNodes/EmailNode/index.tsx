import { type Node, type NodeProps } from "@xyflow/react";
import { NodeWrapper } from "../../NodeWrapper";
import { MdEmail } from "react-icons/md";
import { AddFieldsNode } from "@components/Nodes/AddFieldsNode";
import { memo } from "react";
import { Checkbox, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";

export const EmailNode = memo((props: NodeProps<Node<NodeCustomData>>) => {

	const [emailForm] = useForm();

	return <NodeWrapper 
		node={props}
		isNeedInput={false}
		title={'Письмо'}
		handleBottom={false}
		handleTop={false}
		icon={<MdEmail />}
	>
		<AddFieldsNode btnLabel={'Добавить отправку email'}>
			<Form form={emailForm} layout="vertical">
				<Form.Item label="Кому" required>
					<Input placeholder="https://example.com/api"/>
				</Form.Item>
				<Form.Item label={"Содержание"}>
					<TextArea/>
				</Form.Item>
				<Form.Item>
					<Checkbox>Выполнять если предыдущий этап успешный</Checkbox>
				</Form.Item>
				<Form.Item >
					<Checkbox>Выполнять если предыдущий этап не успешный</Checkbox>
				</Form.Item>
			</Form>
		</AddFieldsNode>
	</NodeWrapper>
});
