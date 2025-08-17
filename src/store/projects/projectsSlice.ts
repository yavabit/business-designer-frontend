import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IProjectsStore {
    projects: IProject[];
    isCreationModalOpen: boolean;
}

const initialState: IProjectsStore = {
    projects: [],
    isCreationModalOpen: false,
};

export const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        setProjects(state, action: PayloadAction<IProject[]>) {
            state.projects = action.payload;
        },

        setCreationModal(state, action: PayloadAction<boolean>) {
            state.isCreationModalOpen = action.payload;
        },
    },
});

export const { setProjects, setCreationModal } = projectsSlice.actions;
export default projectsSlice.reducer;
