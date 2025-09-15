import { type Node, type NodeProps } from "@xyflow/react";
import { NodeWrapper } from "../../NodeWrapper";

export const EmailNode = (props: NodeProps<Node<NodeCustomData>>) => (
	<NodeWrapper node={props} />
);
