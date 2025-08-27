import { NodeInput } from "@components/NodeInput/NodeInput";
import { useNodeInput } from "@hooks/useNodeInput";
import { Handle, Position, type NodeProps } from "@xyflow/react";

const size = 80;
const handleStyleLeft = {left: -2, top: 80, transform: 'translateY(-5px)'};
const handleStyleRight = {left: 80, top: -2, transform: 'translateX(-5px)'};

export const DiamondNode = (props: NodeProps) => {
	const {inputValue, onChangeInput} = useNodeInput({input: props.data.label as string})

	return (
		<div
			className={`react-flow__node-input nopan selectable draggable `}
			style={{
				width: size,
				height: size,
				transform: "rotate(45deg)",
				transformOrigin: 'center',
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<NodeInput
				value={inputValue}
				onChange={onChangeInput}
				style={{ transform: "rotate(-45deg)" }}
			/>
			<Handle type="target" position={Position.Left} style={handleStyleLeft}/>
			<Handle type="source" position={Position.Right} style={handleStyleRight}/>
		</div>
	);
};
