import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IProcessState {
	isCreationModalOpen: boolean
}

const initialState: IProcessState = {
	isCreationModalOpen: false,
}


const processSlice = createSlice({
	name: "process",
	initialState,
	reducers: {
		setProcessCreationModal(state, action: PayloadAction<boolean>) {
			state.isCreationModalOpen = action.payload;
		},
	},
});

export const processReducer = processSlice.reducer;
export const { setProcessCreationModal } = processSlice.actions;