import { Handle, Position } from "@xyflow/react";
import { NodeInput } from "@components/NodeInput/NodeInput";
import { useNodeInput } from "@hooks/useNodeInput";

type HandlePositionType = {
	left?: number; 
	right?: number; 
	bottom?: number; 
	top?: number;
	transform?: string;
}

type NodeWrapperType = {
	data: NodeCustomData;
	children?: React.ReactNode;
	handleLeft?: boolean;
	handleRight?: boolean;
	handleTop?: boolean;
	handleBottom?: boolean;
	style?: React.CSSProperties;
	handleStyle?: {
		left?: HandlePositionType;
		right?: HandlePositionType;
		top?: HandlePositionType;
		bottom?: HandlePositionType;
	};
	inputStyle?: React.CSSProperties;
};

export const NodeWrapper = ({
	data,
	children,
	handleLeft = true,
	handleRight = true,
	handleTop = false,
	handleBottom = false,
	style,
	handleStyle,
	inputStyle
}: NodeWrapperType) => {

	const { inputValue, onChangeInput } = useNodeInput({
		input: data.label as string,
	});

	return (
		<div
			className={`react-flow__node-input nopan selectable draggable `}
			style={{
				...style,
				...data.style,
			}}
		>
			<NodeInput
				value={inputValue}
				onChange={onChangeInput}
				style={{ 
					color: data.style?.color ?? "white", 
					fontSize: data.style?.fontSize,
					...inputStyle 
				}}
			/>

			{children}

			{handleLeft && <Handle type="target" position={Position.Left} style={{...handleStyle?.left}}/>}
			{handleRight && <Handle type="source" position={Position.Right} style={{...handleStyle?.right}}/>}
			{handleTop && <Handle type="source" position={Position.Top} style={{...handleStyle?.top}}/>}
			{handleBottom && <Handle type="source" position={Position.Bottom} style={{...handleStyle?.bottom}}/>}
		</div>
	);
};
