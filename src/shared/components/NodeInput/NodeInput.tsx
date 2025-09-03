import { Input } from "antd";
const { TextArea } = Input;

type NodeInputType = {
	onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
	value: unknown;
	style?: React.CSSProperties;
}

export const NodeInput = ({ onChange, value, style }: NodeInputType) => {
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
};
