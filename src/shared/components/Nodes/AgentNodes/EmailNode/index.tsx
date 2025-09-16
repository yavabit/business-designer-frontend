import { type Node, type NodeProps } from "@xyflow/react";
import { NodeWrapper } from "../../NodeWrapper";
import { MdEmail } from "react-icons/md";
import { AddFieldsNode } from "@components/Nodes/AddFieldsNode";
import { memo } from "react";

export const EmailNode = memo((props: NodeProps<Node<NodeCustomData>>) => (
	<NodeWrapper 
		node={props}
		isNeedInput={false}
		title={'Письмо'}
		handleBottom={false}
		handleTop={false}
		icon={<MdEmail />}
	>
		<AddFieldsNode btnLabel={'Добавить отправку email'}/>
	</NodeWrapper>
));
