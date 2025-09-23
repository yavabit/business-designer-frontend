import { type Node, type NodeProps } from "@xyflow/react";
import { NodeWrapper } from "../../NodeWrapper";
import { MdHttp } from "react-icons/md";
import { AddFieldsNode } from "@components/Nodes/AddFieldsNode";
import { memo } from "react";
import { Form, Input, InputNumber } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useForm } from "antd/es/form/Form";

export const RequestNode = memo((props: NodeProps<Node<NodeCustomData>>) => {

	const [requestForm] = useForm();


	return <NodeWrapper 
		node={props}
		isNeedInput={false}
		title={'Запрос'}
		handleBottom={false}
		handleTop={false}
		icon={<MdHttp />}
	>
		{<AddFieldsNode btnLabel={'Добавить запрос'}>
			<Form form={requestForm} layout="vertical">
				<Form.Item label="url" required name={'url'}>
					<Input placeholder="https://example.com/api"/>
				</Form.Item>
				<Form.Item label={"Тело запроса"}>
					<TextArea/>
				</Form.Item>
				<Form.Item label={"Идти далее если ответ сервера"}>
					<InputNumber placeholder="200"/>
				</Form.Item>
				<Form.Item label={"Прервать процесс если ответ сервера"}>
					<InputNumber placeholder="500"/>
				</Form.Item>
			</Form>
		</AddFieldsNode>}
	</NodeWrapper>
});
