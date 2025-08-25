import type { NodeTypes } from "@xyflow/react";
import { nodeList } from "../../data/nodes";

const nodeTypes: NodeTypes = {}

nodeList.forEach(item => {
	nodeTypes[item.code] = item.component
})

export {
	nodeTypes
}