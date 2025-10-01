import { Input } from "antd";
const { TextArea } = Input;

type NodeInputType = {
	onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
	value: unknown;
	style?: React.CSSProperties;
	type?: "input" | "text";
	editable?: boolean;
	onDoubleClick?: () => void;
	onClick?: () => void;
	onBlur?: () => void;
	isEditing?: boolean;
}

export const NodeInput = ({ 
	onChange, 
	value, 
	style, 
	type="text",
	editable=true,
	onDoubleClick,
	onClick,
	onBlur,
	isEditing
}: NodeInputType) => {
	if(!editable || !isEditing) {
		return (
			<div
				onDoubleClick={onDoubleClick}
				onClick={onClick}
				onBlur={onBlur}
				style={{
					display: "flex",
					alignItems: "center",
					color: style?.color ?? 'white',
					textAlign: 'center',
					overflow: 'hidden',
					...(style || {}),
					fontSize: style?.fontSize ?? 14,
					height: 'auto'
				}}
			>
				{value as string}
			</div>
		);
	}
	if(type === "text") {
		return (
			<TextArea
				name="text"
				disabled={!editable}
				onChange={onChange}
				onBlur={onBlur}
				autoFocus
				className="nodrag"
				value={value as string}
				variant="borderless"
				style={{
					color: style?.color ?? 'white',
					textAlign: 'center',
					resize: 'none',
					minHeight: 50,
					overflow: 'hidden',
					...(style || {})
				}}
			/>
		);
	}

	if(type === "input") {
		return (
			<Input
				name="text"
				onChange={onChange}
				onBlur={onBlur}
				autoFocus
				className="nodrag"
				value={value as string}
				variant="borderless"
				disabled={!editable}
				style={{
					color: style?.color ?? 'white',
					padding: 0,
					resize: 'none',
					...(style || {})
				}}
			/>
		);
	}
};
