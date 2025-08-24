import { IconButton } from "@components/IconButton/IconButton";

type ToggleIconProps = {
	value?: string;
	onChange?: (v: string) => void;
	title: string;
	trueValue: string;
	falseValue: string;
	activeIcon: React.ReactNode;
	inactiveIcon: React.ReactNode;
}

export const ToggleIcon = ({ value, onChange, title, trueValue, falseValue, activeIcon, inactiveIcon}: ToggleIconProps) => {
	const isActive = value === trueValue;
	return (
		<IconButton
			title={title}
			active={isActive}
			onClick={() => onChange?.(isActive ? falseValue : trueValue)}
			activeIcon={activeIcon}
			inactiveIcon={inactiveIcon}
		/>
	);
};
