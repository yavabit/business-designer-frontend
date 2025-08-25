import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './user/userSlice'
import { processReducer } from './process/processSlice'
import projectsReducer from './projects/projectsSlice'
import { baseApi } from './api/api'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    user: userReducer,
		process: processReducer,
    projects: projectsReducer,
  },
  middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store