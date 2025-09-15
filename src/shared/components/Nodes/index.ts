import type { NodeTypes } from "@xyflow/react";
import { agentNodesList } from "../../data";

const nodeTypes: NodeTypes = {}

agentNodesList.forEach(item => {
	nodeTypes[item.code] = item.component
})

export {
	nodeTypes
}