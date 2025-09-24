import { Button } from "antd";
import styles from "./style.module.scss";
import { AddNodeActionModal } from "@components/Modals/AddNodeActionModal/AddNodeActionModal";
import { useState } from "react";

export type DefaultNodeInfoFieldType = {
	label: React.ReactNode
}

type AddFieldsNodeProps = {
	btnLabel: React.ReactNode;
	defaultFields?: DefaultNodeInfoFieldType[];
	children?: React.ReactNode;
	handleConfirmModal?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const AddFieldsNode = ({
	btnLabel,
	defaultFields = [],
	children,
	handleConfirmModal
}: AddFieldsNodeProps) => {

	const [modal, setModal] = useState({open: false})

	const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
		e.stopPropagation()
		setModal(prev => ({...prev, open: true}))
	}

	const handleModalOk = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation()
		setModal(prev => ({...prev, open: false}))
		handleConfirmModal!(e)
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
			{defaultFields?.length !== 0 && (
				<div 
					className={styles["card-info"]} 
					onClick={(e) => {
						e.stopPropagation();
						setModal(prev => ({...prev, open: true}))
					}
				}>
					{defaultFields.map(item => item.label)}
				</div>
			)}
			<AddNodeActionModal open={modal.open} handleModalOk={handleModalOk} handleModalCancel={handleModalCancel} title={btnLabel}>
				{children}
			</AddNodeActionModal>
		</div>
);
};
