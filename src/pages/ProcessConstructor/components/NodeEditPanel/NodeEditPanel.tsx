import { useAppSelector } from "@hooks/storeHooks";
import { Panel } from "@xyflow/react";
import { Card, ColorPicker, Form, InputNumber, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import { useCallback, useEffect } from "react";
import { debounce } from "lodash";
import type { AggregationColor } from "antd/es/color-picker/color";
import {
	MdFormatBold,
	MdFormatItalic,
	MdOutlineFormatBold,
	MdOutlineFormatItalic,
} from "react-icons/md";
import { ToggleIcon } from "@components/ToggleIcon/ToggleIcon";
import { TextDecorationGroup } from "../../../../shared/components/TextDecorationGroup/TextDecorationGroup";
import { useDispatch } from "react-redux";
import { updateNodeProperties } from "@store/processConstructor/processConstructorSlice";

export const NodeEditPanel = () => {
	const selectedNode = useAppSelector((state) => state.processConstructor.selectedNode);

	const dispatch = useDispatch()
	const [form] = useForm();

	const normalizeColor = useCallback((value: AggregationColor) => {
		if (value && typeof value === "object" && value.toHexString) {
			return value.toHexString();
		}
		return value;
	}, []);

	useEffect(() => {
		if (selectedNode) {
			form.setFieldsValue({
				backgroundColor: selectedNode.data?.style?.backgroundColor ||  "#1677ff",
				borderColor: selectedNode.data?.style?.borderColor ||  "#1677ff",
				color: selectedNode.data?.style?.color ||  "#1677ff",
				fontSize: selectedNode.data?.style?.fontSize ||  16,
				fontWeight: selectedNode.data?.style?.fontWeight ||  "normal",
				fontStyle: selectedNode.data?.style?.fontStyle ||  "normal",
				textDecoration: selectedNode.data?.style?.textDecoration ||  "none",
			});
		}
	}, [selectedNode, form]);

	const handleValuesChange = debounce((curValue) => {
		const [[key, value]] = Object.entries(curValue);
		dispatch(updateNodeProperties({
			id: selectedNode?.id as string,
			propertyKey: key,
			propertyValue: value as string
		}))
	}, 300);

	useEffect(() => {
		return () => handleValuesChange.cancel();
	}, [handleValuesChange]);

	if (selectedNode === null) {
		return null;
	}

	return (
		<Panel position="top-right">
			<Card title={"Редактирование процесса"} style={{ width: 320 }}>
				<Form form={form} onValuesChange={handleValuesChange}>
					<Form.Item name="backgroundColor" normalize={normalizeColor}>
						<ColorPicker
							showText={(color) => (
								<span>Цвет фона ({color.toHexString()})</span>
							)}
						/>
					</Form.Item>
					<Form.Item name={"borderColor"} normalize={normalizeColor}>
						<ColorPicker
							showText={(color) => (
								<span>Цвет границы ({color.toHexString()})</span>
							)}
						/>
					</Form.Item>
					<Form.Item name={"color"} normalize={normalizeColor}>
						<ColorPicker
							showText={(color) => (
								<span>Цвет текста ({color.toHexString()})</span>
							)}
						/>
					</Form.Item>
					<Form.Item name={"fontSize"} label="Размер текста">
						<InputNumber min={1} max={99} addonAfter="px" />
					</Form.Item>

					<Form.Item label="Стиль">
						<Space size={6}>
							<Form.Item
								name="fontWeight"
								noStyle
								valuePropName="value"
								getValueFromEvent={(v) => v}
							>
								<ToggleIcon
									title="Жирный"
									trueValue="bold"
									falseValue="normal"
									activeIcon={<MdFormatBold size={20} />}
									inactiveIcon={<MdOutlineFormatBold size={20} />}
								/>
							</Form.Item>

							<Form.Item
								name="fontStyle"
								noStyle
								valuePropName="value"
								getValueFromEvent={(v) => v}
							>
								<ToggleIcon
									title="Курсив"
									trueValue="italic"
									falseValue="normal"
									activeIcon={<MdFormatItalic size={20} />}
									inactiveIcon={<MdOutlineFormatItalic size={20} />}
								/>
							</Form.Item>

							<Form.Item
								name="textDecoration"
								noStyle
								valuePropName="value"
								getValueFromEvent={(v) => v}
							>
								<TextDecorationGroup />
							</Form.Item>
						</Space>
					</Form.Item>
				</Form>
			</Card>
		</Panel>
	);
};
