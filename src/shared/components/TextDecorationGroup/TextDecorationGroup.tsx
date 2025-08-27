import { IconButton } from "@components/IconButton/IconButton";
import { Space } from "antd";
import {
  MdFormatUnderlined, 
  MdStrikethroughS,
  MdOutlineFormatUnderlined,
  MdOutlineStrikethroughS
} from 'react-icons/md';

type TextDecorationGroupProps = {
	value?: "none" | "underline" | "line-through";
	onChange?: (v: "none" | "underline" | "line-through") => void;
};

export const TextDecorationGroup = ({ value, onChange }: TextDecorationGroupProps) => {
	const v = value ?? "none";
	return (
		<Space size={6}>
			<IconButton
				title="Подчёркнутый"
				active={v === "underline"}
				onClick={() => onChange?.(v === "underline" ? "none" : "underline")}
				activeIcon={<MdFormatUnderlined size={20} />}
				inactiveIcon={<MdOutlineFormatUnderlined size={20} />}
			/>
			<IconButton
				title="Зачёркнутый"
				active={v === "line-through"}
				onClick={() =>
					onChange?.(v === "line-through" ? "none" : "line-through")
				}
				activeIcon={<MdStrikethroughS size={20} />}
				inactiveIcon={<MdOutlineStrikethroughS size={20} />}
			/>
		</Space>
	);
};
