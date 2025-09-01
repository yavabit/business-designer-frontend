import { type Node, type NodeProps } from "@xyflow/react";
import { NodeWrapper } from "../NodeWrapper";

const subProcessNodeStyle = { borderStyle: "dashed" };

export const SubProcessNode = (props: NodeProps<Node<NodeCustomData>>) => (
	<NodeWrapper node={props} style={{ ...subProcessNodeStyle }} />
);
