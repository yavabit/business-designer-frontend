import { Panel } from "@xyflow/react";
import { Button, Card, List } from "antd";
import { NodeListCard } from "@components/NodeCard/NodeCard";
import { nodeList } from "../../../shared/data/nodes";
import { useDispatch } from "react-redux";
import { setSelectedNode } from "@store/nodes/nodesSlice";
import { useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

export const NodesPanel = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const dispatch = useDispatch();

	const handleProcessSelect = (process: INodeItem) => {
		dispatch(setSelectedNode(process.id));
	};

	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	return (
		<Panel position="top-left">
			{isCollapsed && (
				<Button
					size="large"
					type="primary"
					shape="circle"
					icon={<AiOutlinePlus />}
					onClick={toggleCollapse}					
				/>
			)}
			{!isCollapsed && (
				<Card
					title={
						<div
							style={{ 
								display: "flex",
								alignItems: "center", 
								gap: "8px",
								cursor: 'pointer'
							}}
							onClick={toggleCollapse}
						>
							<Button
								type="text"
								icon={<AiOutlineMinus />}
								size="small"
								style={{ width: 24, height: 24, minWidth: 24, padding: 0 }}
							/>
							<span>Список доступных процессов</span>
						</div>
					}
					style={{ width: 320 }}
				>
					<List
						dataSource={nodeList}
						renderItem={(item) => (
							<List.Item
								onClick={() => handleProcessSelect(item)}
								style={{ padding: 0 }}
							>
								<NodeListCard {...item} style={{ width: "100%" }} />
							</List.Item>
						)}
					/>
				</Card>
			)}
		</Panel>
	);
};
