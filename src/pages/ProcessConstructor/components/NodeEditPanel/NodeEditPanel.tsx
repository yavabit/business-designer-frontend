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

export const NodeEditPanel = () => {
	const selectedNode = useAppSelector((state) => state.nodes.selectedNode);
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
				backgroundColor: /* selectedNode.data?.backgroundColor ||  */ "#1677ff",
				borderColor: /* selectedNode.data?.borderColor ||  */ "#1677ff",
				fontColor: /* selectedNode.data?.fontColor ||  */ "#1677ff",
				fontSize: /* selectedNode.data?.fontSize ||  */ 16,
				fontWeight: /* selectedNode.data?.fontWeight ||  */ "normal",
				fontStyle: /* selectedNode.data?.fontStyle ||  */ "normal",
				textDecoration: /* selectedNode.data?.textDecoration ||  */ "none",
			});
		} else {
			form.resetFields();
		}
	}, [selectedNode, form]);

	const handleValuesChange = debounce((_, allValues) => {
		console.log("Финальные значения:", allValues);
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
					<Form.Item name={"fontColor"} normalize={normalizeColor}>
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
