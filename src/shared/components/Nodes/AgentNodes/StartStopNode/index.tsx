import { type Node, type NodeProps } from "@xyflow/react";
import { NodeWrapper } from "../../NodeWrapper";
import { VscDebugStart } from "react-icons/vsc";
import { useAppSelector } from "@hooks/storeHooks";
import { memo, useEffect, useState } from "react";
import { FaStop } from "react-icons/fa6";

const initStartStyle = {
	backgroundColor: '#005200',
	borderColor: 'green'
}

const initEndStyle = {
	backgroundColor: '#7a0101',
	borderColor: 'red'
}

export const StartStopNode = memo((props: NodeProps<Node<NodeCustomData>>) => {

	const [isStartNode, setStartNode] = useState(true)

	const { nodes } = useAppSelector(state => state.processConstructor)

	useEffect(() => {
		const startNode = nodes.find(node => node.type === 'start')
		setStartNode(() => props.id == startNode?.id)
	}, [nodes])

	return <NodeWrapper 
		node={props}
		isNeedInput={false}
		title={isStartNode ? 'Старт' : 'Стоп'}
		handleBottom={false}
		handleTop={false}
		handleLeft={!isStartNode}
		handleRight={isStartNode}
		icon={isStartNode ? <VscDebugStart /> : <FaStop />}
		editable={false}
		style={isStartNode ? {...initStartStyle} : {...initEndStyle}}
	>
	</NodeWrapper>
});
