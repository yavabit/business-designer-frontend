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
		reset: () => initialState,
	},
});

export const nodeReducer = nodeSlice.reducer;
export const { reset } = nodeSlice.actions;
