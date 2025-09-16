import { type Node, type NodeProps } from "@xyflow/react";
import { NodeWrapper } from "../../NodeWrapper";
import { MdHttp } from "react-icons/md";
import { AddFieldsNode } from "@components/Nodes/AddFieldsNode";

export const RequestNode = (props: NodeProps<Node<NodeCustomData>>) => (
	<NodeWrapper 
		node={props}
		isNeedInput={false}
		title={'Запрос'}
		handleBottom={false}
		handleTop={false}
		icon={<MdHttp />}
	>
		<AddFieldsNode btnLabel={'Добавить запрос'}/>
	</NodeWrapper>
);
