import { createSlice } from "@reduxjs/toolkit";
import { agentNodesList, nodeList } from "../../shared/data";

interface INodeListPayload {
	payload: {
		type: NodesTypeEnum
	}
}

type initialStateType = {
	nodeList: INodeItem[] | [],
	selectedNode: INodeItem | null,
	nodesType: NodesTypeEnum | null
}

const initialState: initialStateType = {
	nodeList: [],
	selectedNode: null,
	nodesType: null
};

const nodeSlice = createSlice({
	name: "nodes",
	initialState,
	reducers: {
		setNodesByType: (state, { payload }: INodeListPayload) => {
			switch(payload.type) {
				case NodesTypeEnum.Business_process: {
					state.nodeList = nodeList
					break;
				}
				case NodesTypeEnum.Agent: {
					state.nodeList = agentNodesList
					break;
				}
				default:
					state.nodeList = []
			}
		},
		setNodesType: (state, { payload }: {payload: NodesTypeEnum}) => {
			state.nodesType = payload
		},
		reset: () => initialState,
	},
});

export const nodeReducer = nodeSlice.reducer;
export const { setNodesByType, setNodesType, reset } = nodeSlice.actions;
