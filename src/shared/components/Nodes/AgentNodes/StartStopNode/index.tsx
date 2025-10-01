import { type Node, type NodeProps } from "@xyflow/react";
import { NodeWrapper } from "../../NodeWrapper";
import { VscDebugStart } from "react-icons/vsc";
import { useAppSelector } from "@hooks/storeHooks";
import { memo, useEffect, useState } from "react";
import { FaStop } from "react-icons/fa6";
import { Popconfirm } from "antd";

type BtnsProps = {
	onConfirm: ()=> void;
}

const initStartStyle = {
	backgroundColor: '#005200',
	borderColor: 'green'
}

const initEndStyle = {
	backgroundColor: '#7a0101',
	borderColor: 'red'
}

const BtnStart = ({onConfirm}: BtnsProps) => {
	return <Popconfirm
			title={"Запустить процесс?"}
			okText="Да"
			cancelText="Нет"
			onConfirm={onConfirm}
			placement="bottom"
		>
			<VscDebugStart style={{cursor: 'pointer'}}/> 
	</Popconfirm>
}

const BtnStop = ({onConfirm}: BtnsProps) => {
	return <Popconfirm
			title={"Остановить процесс?"}
			okText="Да"
			cancelText="Нет"
			onConfirm={onConfirm}
			placement="bottom"
		>
			<FaStop style={{cursor: 'pointer'}}/> 
	</Popconfirm>
}

export const StartStopNode = memo((props: NodeProps<Node<NodeCustomData>>) => {

	const [isStartNode, setStartNode] = useState(true)

	const { nodes } = useAppSelector(state => state.processConstructor)

	const handleStartClick = () => {

	}

	const handleStopClick = () => {

	}

	useEffect(() => {
		const startNode = nodes.find(node => node.type === 'start')
		setStartNode(() => props.id == startNode?.id)
	}, [nodes])

	return <NodeWrapper 
		node={{
			...props,
			data: {
				...props.data,
				label: isStartNode ? 'Старт' : 'Стоп'
			}
		}}
		handleBottom={false}
		handleTop={false}
		handleLeft={!isStartNode}
		handleRight={isStartNode}
		icon={isStartNode ? <BtnStart onConfirm={handleStartClick}/> : <BtnStop onConfirm={handleStopClick}/>}
		editable={false}
		style={isStartNode ? {...initStartStyle} : {...initEndStyle}}
	>
	</NodeWrapper>
});
