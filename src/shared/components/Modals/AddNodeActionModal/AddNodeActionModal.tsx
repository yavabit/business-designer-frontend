import { Modal } from "antd";
import { useEffect, useState } from "react";

type AddNodeActionModalType = {
	open: boolean;
	handleModalOk: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	handleModalCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	children?: React.ReactNode;
	title?: React.ReactNode;
}

export const AddNodeActionModal = ({ open, handleModalOk, handleModalCancel, children, title }: AddNodeActionModalType) => {
	const [isModalOpen, setIsModalOpen] = useState(open);

	useEffect(() => {
		setIsModalOpen(open);
	}, [open])

	return (
		<Modal
			title={title ?? ""}
			closable={{ "aria-label": "Custom Close Button" }}
			open={isModalOpen}
			onOk={handleModalOk}
			onCancel={handleModalCancel}
			
		>
			{children}
		</Modal>
	);
};
