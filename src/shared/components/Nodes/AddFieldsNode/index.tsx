import { Button, Card } from "antd";
import styles from "./style.module.scss";
import { AddNodeActionModal } from "@components/Modals/AddNodeActionModal/AddNodeActionModal";
import { useState } from "react";

type AddFieldsNodeProps = {
	btnLabel: React.ReactNode;
	defaultFields?: [];
	children?: React.ReactNode;
};

export const AddFieldsNode = ({
	btnLabel,
	defaultFields = [],
	children
}: AddFieldsNodeProps) => {

	const [modal, setModal] = useState({open: false})

	const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
		e.stopPropagation()
		setModal(prev => ({...prev, open: true}))
	}

	const handleModalOk = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation()
		setModal(prev => ({...prev, open: false}))
	};

	const handleModalCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation()
		setModal(prev => ({...prev, open: false}))
	};

	return (
		<div>
			{defaultFields?.length === 0 && (
				<div className={styles["add-btn"]}>
					<Button size="small" onClick={handleClick}>{btnLabel}</Button>
				</div>
			)}
			{defaultFields?.length !== 0 && (<Card>index</Card>)}
			<AddNodeActionModal open={modal.open} handleModalOk={handleModalOk} handleModalCancel={handleModalCancel} title={btnLabel}>
				{children}
			</AddNodeActionModal>
		</div>
);
};
