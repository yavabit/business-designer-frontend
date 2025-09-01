import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Flex } from "antd";
import { NodeInput } from "@components/NodeInput/NodeInput";
import { useNodeInput } from "@hooks/useNodeInput";

export default function SubProcessNode(props: NodeProps<Node<NodeCustomData>>) {
	const { data } = props;
	const {inputValue, onChangeInput} = useNodeInput({input: data.label as string})

	return (
		<div
			className={`react-flow__node-input nopan selectable draggable `}
			style={{
				borderStyle: 'dashed',
				...data.style
			}}
		>
			<Flex vertical>
				
				<NodeInput
					value={inputValue}
					onChange={onChangeInput}
					style={{color: data.style?.color ?? "white"}}
				/>
				<Handle type="target" position={Position.Left} />
				<Handle type="source" position={Position.Right} />
			</Flex>
		</div>
	);
}
