import { NodeInput } from "@components/NodeInput/NodeInput";
import { useNodeInput } from "@hooks/useNodeInput";
import { Handle, Position, type NodeProps } from "@xyflow/react";

export const CircleNode = (props: NodeProps) => {
	const {inputValue, onChangeInput} = useNodeInput({input: props.data.label as string})

	return (
		<div
			className={`react-flow__node-input nopan selectable draggable `}
			style={{
				width: 100,    // ширина больше высоты
				height: 60,    // высота меньше ширины
				borderRadius: "50%", // 50% создает овал
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<NodeInput
				value={inputValue}
				onChange={onChangeInput}
			/>
			<Handle type="target" position={Position.Left} />
			<Handle type="source" position={Position.Right} />
		</div>
	);
};
