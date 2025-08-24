import { useAppSelector } from "@hooks/storeHooks";
import { Panel } from "@xyflow/react";
import { Card, ColorPicker, Form } from "antd";
import { useForm } from "antd/es/form/Form";

export const NodeEditPanel = () => {
	const selectedNode = useAppSelector((state) => state.nodes.selectedNode);
	const [form] = useForm()

	if(selectedNode === null) {
		return
	}

	return (
		<Panel position="top-right">
			<Card title={"Редактирование процесса"} style={{ width: 320 }}>
				<Form form={form}>
					<Form.Item name='backgroundColor'>
						<ColorPicker
							defaultValue="#1677ff"
							showText={(color) => <span>Цвет фона ({color.toHexString()})</span>}
						/>
					</Form.Item>
					<Form.Item name={'borderColor'}>
						<ColorPicker
							defaultValue="#1677ff"
							showText={(color) => <span>Цвет границы ({color.toHexString()})</span>}
						/>
					</Form.Item>
				</Form>
			</Card>
		</Panel>
	);
};
