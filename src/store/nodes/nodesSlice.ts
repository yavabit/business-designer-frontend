import { createSlice } from "@reduxjs/toolkit";
import { agentNodesList, nodeList } from "../../shared/data";
import { processConstructorApi } from "@store/api/processConstructor/processConstructorApi";
import type { NodeTypes } from "@xyflow/react";
import { nodeTypes } from "@components/Nodes";

type initialStateType = {
	nodeList: INodeItem[] | [];
	selectedNode: INodeItem | null;
	nodesCategory: NodesCategoryEnum | null;
	nodeTypes: NodeTypes
};

const getNodesTypesByCategory = (type: NodesCategoryEnum) => {
	const nodeTypes: NodeTypes = {}

	switch (type) {
		case NodesCategoryEnum.Business_process:
			nodeList.forEach(item => {
				nodeTypes[item.code] = item.component
			})
			break;
		case NodesCategoryEnum.Agent:
			agentNodesList.forEach(item => {
				nodeTypes[item.code] = item.component
			})
			break;
		default:
			break;
	}

	return nodeTypes
}

const getNodesByCategory = (type: NodesCategoryEnum) => {
	switch (type) {
		case NodesCategoryEnum.Business_process:
			return nodeList;
		case NodesCategoryEnum.Agent:
			return agentNodesList;
		default:
			return [];
	}
};

const initialState: initialStateType = {
	nodeList: agentNodesList,
	selectedNode: null,
	nodesCategory: null,
	nodeTypes: nodeTypes
};

const nodeSlice = createSlice({
	name: "nodes",
	initialState,
	reducers: {
		setNodesByCategory: (
			state,
			{ payload }: { payload: NodesCategoryEnum }
		) => {
			state.nodeList = getNodesByCategory(payload);
		},
		setNodesCategory: (state, { payload }: { payload: NodesCategoryEnum }) => {
			state.nodesCategory = payload;
		},
		reset: () => initialState,
	},
	extraReducers(builder) {
		builder.addMatcher(
			processConstructorApi.endpoints.getProcess.matchFulfilled,
			(state, { payload }) => {
				const { data } = payload;

				state.nodeList = getNodesByCategory(data.category);
				state.nodesCategory = data.category;
				state.nodeTypes = getNodesTypesByCategory(data.category);
			}
		);
	},
});

export const nodeReducer = nodeSlice.reducer;
export const { setNodesByCategory, setNodesCategory, reset } = nodeSlice.actions;
