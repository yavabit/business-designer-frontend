import { createSlice } from "@reduxjs/toolkit";
import { nodeList } from "../../shared/data/nodes";

const initialState = {
	nodeList: nodeList,
	selectedNode: null,
};

const nodeSlice = createSlice({
	name: "nodes",
	initialState,
	reducers: {
		setSelectedNode: (state, { payload }) => {
			state.selectedNode = payload;
		},
		reset: () => initialState,
	},
});

export const nodeReducer = nodeSlice.reducer;
export const { setSelectedNode, reset } = nodeSlice.actions;
