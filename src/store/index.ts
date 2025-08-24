import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './user/userSlice'
import { processReducer } from './process/processSlice'
import projectsReducer from './projects/projectsSlice'
import { nodeReducer } from './nodes/nodesSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
		process: processReducer,
    projects: projectsReducer,
    nodes: nodeReducer
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store