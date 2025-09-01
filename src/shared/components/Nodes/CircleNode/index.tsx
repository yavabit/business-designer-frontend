import { type Node, type NodeProps } from "@xyflow/react";
import { NodeWrapper } from "../NodeWrapper";

const circleNodeStyle = {
	width: 100,
	height: 60,
	borderRadius: "50%",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
};

export const CircleNode = (props: NodeProps<Node<NodeCustomData>>) => (
	<NodeWrapper data={props.data} style={{ ...circleNodeStyle }} />
);
