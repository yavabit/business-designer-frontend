import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './user/userSlice'
import projectsReducer from './projects/projectsSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch