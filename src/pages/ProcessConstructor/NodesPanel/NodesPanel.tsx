import { Panel } from "@xyflow/react";
import { Button, Card, Input, List, Tooltip } from "antd";
import { NodeListCard } from "@components/NodeCard/NodeCard";
import { nodeList } from "../../../shared/data/nodes";
import { useDispatch } from "react-redux";
import { setSelectedNode } from "@store/nodes/nodesSlice";
import { useMemo, useState } from "react";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineSearch } from "react-icons/ai";

export const NodesPanel = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const dispatch = useDispatch();

	const handleProcessSelect = (process: INodeItem) => {
		dispatch(setSelectedNode(process.id));
	};

	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	const filteredNodeList = useMemo(() => {
		if (!searchTerm) return nodeList;

		return nodeList.filter(
			(item) =>
				item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(item.description &&
					item.description.toLowerCase().includes(searchTerm.toLowerCase()))
		);
	}, [searchTerm]);

	return (
		<Panel position="top-left">
			{isCollapsed && (
				<Tooltip title="Добавить процесс">
					<Button
						size="large"
						type="primary"
						shape="circle"
						icon={<AiOutlinePlus />}
						onClick={toggleCollapse}
					/>
				</Tooltip>
			)}
			{!isCollapsed && (
				<Card
					title={
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "8px",
								cursor: "pointer",
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
					<Input
						placeholder="Поиск процессов..."
						prefix={<AiOutlineSearch />}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						allowClear
						size="middle"
						style={{marginBottom: 8}}
					/>
					<List
						dataSource={filteredNodeList}
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
