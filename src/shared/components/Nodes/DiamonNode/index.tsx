import { type NodeProps, type Node } from "@xyflow/react";
import { NodeWrapper } from "../NodeWrapper";

const size = 80;
const handleStyleLeft = { left: -2, top: 80, transform: "translateY(-5px)" };
const handleStyleRight = { left: 80, top: -2, transform: "translateX(-5px)" };

const circleNodeStyle = {
	width: size,
	height: size,
	transform: "rotate(45deg)",
	transformOrigin: "center",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
};

const inputStyle = { transform: "rotate(-45deg)" };

export const DiamondNode = (props: NodeProps<Node<NodeCustomData>>) => {
	return (
		<NodeWrapper
			node={props}
			style={{ ...circleNodeStyle }}
			inputStyle={{ ...inputStyle }}
			handleStyle={{ left: handleStyleLeft, right: handleStyleRight }}
		/>
	);
};
