import { configureStore } from '@reduxjs/toolkit'
import { 
	persistStore, 
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { userReducer } from './user/userSlice'
import { processReducer } from './process/processSlice'
import projectsReducer from './projects/projectsSlice'
import { nodeReducer } from './nodes/nodesSlice'
import { baseApi } from './api/api'
import { processConstructorReducer } from '@store/processConstructor/processConstructorSlice'
import { themeReducer } from '@store/user/themeSlice';

const userPersistConfig = {
	key: 'user',
	storage,
	whitelist: [
		'id', 
		'email', 
		'token', 
		'firstname', 
		'lastname', 
		'name', 
		'pict_url'
	]
}

const rootReducer = {
	[baseApi.reducerPath]: baseApi.reducer,
	user: persistReducer(userPersistConfig, userReducer),
	process: processReducer,
	projects: projectsReducer,
	nodes: nodeReducer,
	processConstructor: processConstructorReducer,
	theme: themeReducer,
}


export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store