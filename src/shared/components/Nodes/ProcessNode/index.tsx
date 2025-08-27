import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Flex } from "antd";
import { NodeInput } from "@components/NodeInput/NodeInput";
import { useNodeInput } from "@hooks/useNodeInput";

export default function ProcessNode(props: NodeProps) {

	const {inputValue, onChangeInput} = useNodeInput({input: props.data.label as string})

	return (
		<div
			className={`react-flow__node-input nopan selectable draggable `}
		>
			<Flex vertical>
				
				<NodeInput
					value={inputValue}
					onChange={onChangeInput}
				/>
				<Handle type="target" position={Position.Left} />
				<Handle type="source" position={Position.Right} />
			</Flex>
		</div>
	);
}
