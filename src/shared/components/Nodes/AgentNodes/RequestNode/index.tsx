import { type Node, type NodeProps } from "@xyflow/react";
import { NodeWrapper } from "../../NodeWrapper";

export const RequestNode = (props: NodeProps<Node<NodeCustomData>>) => (
	<NodeWrapper 
		node={props}
		isNeedInput={false}
		title={'Запрос'}
		handleBottom={false}
		handleTop={false}
	/>
);
