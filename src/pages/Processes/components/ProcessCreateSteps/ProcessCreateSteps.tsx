import { ItemsPageLayout } from "@app/layouts/ItemsPageLayout/ItemsPageLayout";
import { useTheme } from "@hooks/useTheme";
import { Button, Form, message, Modal, Steps } from "antd";
import { useEffect, useState } from "react";
import {
	FormStepCategories,
	FormStepConfirm,
	FormStepInfo,
} from "./FormSteps/FormSteps";
import { useForm } from "antd/es/form/Form";
import {
	useCreateProcessMutation,
	useLazyTypesProcessQuery,
} from "@store/api/processes/processesApi";
import { useNavigate, useParams } from "react-router-dom";
import type { NodesCategoryEnum } from "@type/nodes";
import { useAppSelector } from "@hooks/storeHooks";

const getRandomIntString = () => {
	return Math.floor(Math.random() * 10e5).toString();
};

const initialPrepareForm = {
	id: getRandomIntString(),
	project_id: getRandomIntString(),
	project_name: "project",
	content: "",
	author_id: "",
	author_name: "",
	created_at: "",
	updated_at: "",
	name: "",
	desc: "",
	category: "",
};

export const ProcessCreateSteps = () => {
	const {projects} = useAppSelector(state => state.projects)
	const {firstname, lastname} = useAppSelector(state => state.user)
	const { token } = useTheme();
	const { projectId } = useParams();
	const navigate = useNavigate();
	const [getProcessTypes, typesProcessData] = useLazyTypesProcessQuery();
	const [createProcess, { isLoading }] = useCreateProcessMutation();
	const [form] = useForm();
	const [current, setCurrent] = useState(0);
	const [commonForm, setCommonForm] = useState<IProcess>(initialPrepareForm);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const steps = [
		{
			title: "Основная информация",
			content: <FormStepInfo />,
		},
		{
			title: "Категория",
			content: <FormStepCategories items={typesProcessData.data?.data} />,
		},
		{
			title: "Подтверждение",
			content: <FormStepConfirm item={commonForm} />,
		},
	];

	const next = () => {
		let prepareItem = { ...commonForm, author_name: `${lastname} ${firstname}` };
		console.log(prepareItem.author_name);
		if (current === 0) {
			prepareItem = {
				...prepareItem,
				name: form.getFieldValue("name"),
				desc: form.getFieldValue("description"),
			};
		} else if (current === 1) {
			prepareItem = {
				...prepareItem,
				category: typesProcessData.data?.data.find(
					(item) => item.id === form.getFieldValue("category")
				)?.name,
			};
		}
		setCommonForm((prev) => ({ ...prev, ...prepareItem }));
		setCurrent(current + 1);
	};

	const prev = () => {
		setCurrent(current - 1);
	};

	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const handleConfirmForm = () => {
		if (typesProcessData.data?.data.length === 0) {
			message.error("Ошибка при создании процесса!");
			return;
		}

		const name = commonForm["name"];
		const desc = commonForm["desc"];
		const category_id = typesProcessData.data?.data.find(
					(item) => item.name === commonForm["category"]
				)?.id as NodesCategoryEnum;

		createProcess({
			projectId: projectId!,
			name,
			desc,
			category_id,
		}).then((res) => {
			if (res.data) {
				setIsModalOpen(false);
				message.success(`Процесс "${name}" создан!`);
				navigate(`/project/${projectId}`, {
					replace: true,
					state: {
						metadata: projects.find(p => p.id === projectId)?.name || ""
					}
				})
			}
			if (res.error) {
				message.error("Ошибка при создании процесса!");
			}
		});
	};

	const items = steps.map((item) => ({ key: item.title, title: item.title }));

	const contentStyle: React.CSSProperties = {
		lineHeight: "260px",
		textAlign: "center",
		color: token.colorTextTertiary,
		backgroundColor: token.colorFillAlter,
		borderRadius: token.borderRadiusLG,
		border: `1px dashed ${token.colorBorder}`,
		marginTop: 16,
	};

	useEffect(() => {
		getProcessTypes();
	}, [getProcessTypes]);

	return (
		<ItemsPageLayout title="Создать процесс">
			<Steps current={current} items={items} />
			<div style={contentStyle}>
				<Form
					layout="vertical"
					form={form}
					initialValues={{ "process-name": "", "process-desc": "" }}
					style={{
						height: current === 2 ? 500 : 350,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{steps[current].content}
				</Form>
			</div>
			<div style={{ marginTop: 24 }}>
				{current < steps.length - 1 && (
					<Button type="primary" onClick={() => next()}>
						Далее
					</Button>
				)}
				{current === steps.length - 1 && (
					<Button type="primary" onClick={showModal}>
						Подтвердить
					</Button>
				)}
				{current > 0 && (
					<Button style={{ margin: "0 8px" }} onClick={() => prev()}>
						Назад
					</Button>
				)}
			</div>
			<Modal
				title="Создать новый процесс?"
				open={isModalOpen}
				onCancel={handleCancel}
				okText="Да"
				cancelText="Нет"
				footer={[
					<Button key="cancel" onClick={handleCancel}>
						Отмена
					</Button>,
					<Button
						key="submit"
						type="primary"
						loading={isLoading}
						onClick={handleConfirmForm}
					>
						Создать
					</Button>,
				]}
			/>
		</ItemsPageLayout>
	);
};
