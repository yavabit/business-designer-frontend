import { type Node, type NodeProps } from "@xyflow/react";
import { NodeWrapper } from "../../NodeWrapper";

const circleNodeStyle = {
	borderRadius: "50%",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
};

export const CircleNode = (props: NodeProps<Node<NodeCustomData>>) => (
	<NodeWrapper 
		node={props} 
		style={{ ...circleNodeStyle }}
		inputType="text"
		inputStyle={{
			width: 'auto',
			minWidth: 159,
			justifyContent: 'center'
		}}
	/>
);
