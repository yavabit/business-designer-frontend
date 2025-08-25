import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IProjectsStore {
    projects: IProject[];
    isCreationModalOpen: boolean;
    isEditModalOpen: boolean;
    editingId: string | undefined;
}

const initialState: IProjectsStore = {
    projects: [],
    isCreationModalOpen: false,
    isEditModalOpen: false,
    editingId: undefined,
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

        setEditModal(
            state,
            action: PayloadAction<{ modalState: boolean; projectId?: string }>
        ) {
            state.isEditModalOpen = action.payload.modalState;
            state.editingId = action.payload.projectId;
        },
    },
});

export const { setCreationModal, setEditModal, setProjects } =
    projectsSlice.actions;
export default projectsSlice.reducer;
