import { CardRadioGroup } from "@components/CardRadioGroup/CardRadioGroup";
import { Form, Input } from "antd";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { NodesCategoryEnum } from "@type/nodes";
import { nodesCategoriesNames } from "@data";
import { ProcessItem } from "../../ProcessItem/ProcessItem";

export const FormStepInfo = () => {
	return (
		<div style={{ width: 600 }}>
			<Form.Item
				name="name"
				label="Название"
				rules={[
					{
						required: true,
						message: "Пожалуйста, введите название процесса!",
					},
				]}
			>
				<Input autoFocus />
			</Form.Item>

			<Form.Item
				name="description"
				label="Описание"
				rules={[
					{
						required: true,
						message: "Пожалуйста, введите описание процесса!",
					},
				]}
			>
				<Input.TextArea style={{minHeight: 150}}/>
			</Form.Item>
		</div>
	);
};

export const FormStepCategories = ({items}: {items: IProcessType[] | undefined}) => {

	const options = items?.map(item => {
		let icon = <></>
		let description = ""
		if(item.name === NodesCategoryEnum.Business_process) {
			icon = <MdOutlineBusinessCenter />
			description = "Постройте схему бизнес-процесса для различных задач"
		} else if(item.name === NodesCategoryEnum.Agent) {
			icon = <IoSettingsOutline />
			description = "Автоматизируйте отправку запросов и Email"
		}
		return {value: item.id, label: nodesCategoriesNames[item.name as keyof typeof nodesCategoriesNames], icon, description}
	})

	return (
		<div>
			<Form.Item
				name="category"
				label="Выберите категорию процесса"
				rules={[{ required: true, message: "Выберите тип процесса!" }]}
			>
				{options && <CardRadioGroup
					options={options}
					style={{marginTop: 20}}
				/>}
			</Form.Item>
		</div>
	);
};

export const FormStepConfirm = ({item}: {item: IProcess}) => {
	return (
		<div>
			<ProcessItem
				item={item}
				isLoading={false}
				disabled={false}
			/>
		</div>
	)
};
