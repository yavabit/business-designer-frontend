import { createSlice } from "@reduxjs/toolkit";
import { agentNodesList, nodeList } from "../../shared/data";
import { processConstructorApi } from "@store/api/processConstructor/processConstructorApi";

type initialStateType = {
	nodeList: INodeItem[] | [];
	selectedNode: INodeItem | null;
	nodesCategory: NodesCategoryEnum | null;
};

const initialState: initialStateType = {
	nodeList: [],
	selectedNode: null,
	nodesCategory: null,
};

const getNodesByType = (type: NodesCategoryEnum) => {
	switch (type) {
		case NodesCategoryEnum.Business_process:
			return nodeList;
		case NodesCategoryEnum.Agent:
			return agentNodesList;
		default:
			return [];
	}
};

const nodeSlice = createSlice({
	name: "nodes",
	initialState,
	reducers: {
		setNodesByCategory: (
			state,
			{ payload }: { payload: NodesCategoryEnum }
		) => {
			state.nodeList = getNodesByType(payload);
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

				state.nodeList = getNodesByType(data.category);
				state.nodesCategory = data.category;
			}
		);
	},
});

export const nodeReducer = nodeSlice.reducer;
export const { setNodesByCategory, setNodesCategory, reset } = nodeSlice.actions;
