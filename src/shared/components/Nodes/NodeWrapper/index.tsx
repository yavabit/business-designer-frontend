import { Handle, NodeResizer, Position, type Node, type NodeProps } from "@xyflow/react";
import { NodeInput } from "@components/NodeInput/NodeInput";
import { useNodeInput } from "@hooks/useNodeInput";
import { useDispatch } from "react-redux";
import { updateNodeText } from "@store/processConstructor/processConstructorSlice";
import { useEffect } from "react";

type HandlePositionType = {
	left?: number; 
	right?: number; 
	bottom?: number; 
	top?: number;
	transform?: string;
}

type NodeWrapperType = {
	node: NodeProps<Node<NodeCustomData>>;
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
	node,
	children,
	handleLeft = true,
	handleRight = true,
	handleTop = false,
	handleBottom = false,
	style,
	handleStyle,
	inputStyle
}: NodeWrapperType) => {
	const dispatch = useDispatch()
	const { data } = node

	const { inputValue, onChangeInput, setInput } = useNodeInput({
		input: data.label as string,
	});

	useEffect(() => {
		setInput(data.label as string);
	}, [data.label, setInput]);

	const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value;
		onChangeInput(e);
		dispatch(updateNodeText({ 
			id: node.id,
			text: newValue 
		}));
	};

	return (
		<div
			className={`react-flow__node-input nopan selectable draggable `}
			style={{
				width: '100%',
				height: '100%',
				...style,
				...data.style,
			}}
		>
			<NodeResizer isVisible={node.selected}/>
			<NodeInput
				value={inputValue}
				onChange={handleChangeInput}
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
