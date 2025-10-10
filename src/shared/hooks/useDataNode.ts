import { useNodeId, useReactFlow } from "@xyflow/react";

function useDataNode<T extends { style?: object }>() {

	const { setNodes, getNode } = useReactFlow();

	const nodeId = useNodeId();

	const setDataNode = ({
		id,
		data
	}: { id?: string; data: T }) => {

		const currentNodeId = id ?? nodeId

		setNodes((nds) =>
			nds.map((itemNode) => {
				if (itemNode.id === currentNodeId) {

					const style = itemNode.data.style && data.style ? {
						...itemNode.data.style,
						...data.style
					} : itemNode.data.style


					return {
						...itemNode,
						data: {
							...itemNode.data,
							...data,
							style
						},
					};
				}

				return itemNode;
			})
		);
	};

	const getDataNode = (): T => {
		if (!nodeId)
			throw Error("useDataNode -> getDataNode отсутствует идентификатор ноды")

		const nodeData = getNode(nodeId)?.data as T

		return nodeData


	}

	return {
		setDataNode,
		getDataNode
	}
}

export default useDataNode