import { Input } from "antd";
const { TextArea } = Input;

type NodeInputType = {
	onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
	value: unknown;
	style?: React.CSSProperties;
	type?: "input" | "text"
}

export const NodeInput = ({ onChange, value, style, type="text" }: NodeInputType) => {
	if(type === "text") {
		return (
			<TextArea
				name="text"
				onChange={onChange}
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
				className="nodrag"
				value={value as string}
				variant="borderless"
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
