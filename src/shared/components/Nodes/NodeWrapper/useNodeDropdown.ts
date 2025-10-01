import { useReactFlow } from "@xyflow/react";
import type { MenuProps } from "antd";
import { useCallback } from "react";

const useNodeDropdown = (id: string) => {
	const { getNode, setNodes, setEdges } = useReactFlow();

	const handleClickDeleteNode = useCallback(() => {
		setNodes((nodes) => nodes.filter((node) => node.id !== id));
		setEdges((edges) => edges.filter((edge) => edge.source !== id));
	}, [id, setNodes, setEdges]);

	const duplicateNode = useCallback(() => {
		const node = getNode(id);


		if (!node) {
			console.warn(`Node id: '${id}' is undefined`);
			return;
		}

		const position = {
			x: node.position.x + 25,
			y: node.position.y + 25,
		};

		const newNode = {
			...node,
			id: crypto.randomUUID(),
			selected: false,
			dragging: false,
			position,
		};

		setNodes((nds) => nds.concat(newNode));

	}, [id, getNode, setNodes]);


	const dropdownItems: MenuProps["items"] = [
		{
			label: 'Удалить',
			key: "0",
			onClick: handleClickDeleteNode,
		},
		{
			type: "divider",
		},
		{
			label: "Дублировать",
			key: "2",
			onClick: duplicateNode
		},
	];

	return {
		dropdownItems,
	};
};

export default useNodeDropdown;
