import { Tooltip } from "antd";

type IconButtonProps = {
	title: string;
	active: boolean;
	onClick: () => void;
	activeIcon: React.ReactNode;
	inactiveIcon: React.ReactNode;
}

export const IconButton = ({ title, active, onClick, activeIcon, inactiveIcon}: IconButtonProps) => (
	<Tooltip title={title}>
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			style={{
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				width: 32,
				height: 32,
				border: "1px solid",
				borderColor: active ? "#1677ff" : "transparent",
				borderRadius: 8,
				background: "transparent",
				cursor: "pointer",
				padding: 0,
				outline: 'none'
			}}
		>
			{active ? activeIcon : inactiveIcon}
		</button>
	</Tooltip>
);
