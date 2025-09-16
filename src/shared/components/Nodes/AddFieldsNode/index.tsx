import { Button, Card } from "antd";
import styles from "./style.module.scss";

type AddFieldsNodeProps = {
	btnLabel: React.ReactNode;
	defaultFields?: [];
};

export const AddFieldsNode = ({
	btnLabel,
	defaultFields = [],
}: AddFieldsNodeProps) => {


	return (
		<div>
			{defaultFields?.length === 0 && (
				<div className={styles["add-btn"]}>
					<Button size="small">{btnLabel}</Button>
				</div>
			)}
			{defaultFields?.length !== 0 && (<Card>index</Card>)}
		</div>
);
};
