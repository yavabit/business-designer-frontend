import { type Node, type NodeProps } from "@xyflow/react";
import { NodeWrapper } from "../../NodeWrapper";

export const ProcessNode = (props: NodeProps<Node<NodeCustomData>>) => (
	<NodeWrapper node={props} />
);
