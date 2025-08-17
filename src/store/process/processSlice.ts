import { createSlice } from "@reduxjs/toolkit";

interface IProcessState {
	listProcesses: IProcess[],
	currentProcess?: IProcess,
	isLoading: boolean
}

interface IProcessPayload {
	payload: IProcess
}

export interface IFilter {
	search?: string
	sortField?: string
	order?: string
	sort?: string
	orderCreatedDate?: string
	orderAlphabet?: string
	projectId?: string
}

interface IFilterPayload {
	payload: IFilter
}

const initialState: IProcessState = {
	listProcesses: [],
	currentProcess: undefined,
	isLoading: false
}


const processSlice = createSlice({
	name: "process",
	initialState,
	reducers: {
		setCurrentProcess: (state, { payload }: IProcessPayload) => {
			state.currentProcess = payload
		},
		deleteProcess: (state, { payload }: IProcessPayload) => {
			state.listProcesses = state.listProcesses.filter(item => item.id !== payload.id)
		},
		saveProcess: (state, { payload }: IProcessPayload) => {
			state.listProcesses = state.listProcesses.map(item => {
				if (item.id === payload.id) {
					return {
						...item,
						...payload
					}
				}

				return item
			})
		},
		fetchProcesses: (state, { payload }: IFilterPayload) => {
			state.isLoading = true
			let listProcesses: IProcess[] = Array(10).fill({
				id: '0',
				name: 'Процесс CI/CD',
				desc: 'Описание процесса CI/CD',
				project_id: '0',
				project_name: '0',
				scheme: '{}',
				pict_url: 'https://svg.template.creately.com/c5JMedWsSpq',
				creation_user_id: '0',
				creation_user_name: '0',
				created_at: new Date().toLocaleDateString(),
				updated_at: new Date().toLocaleDateString(),
			})

			listProcesses = listProcesses.map((item, index) => {
				return {
					...item,
					id: index.toString()
				}
			})

			state.listProcesses = listProcesses.filter(item => item.project_id === payload.projectId)
			state.isLoading = false
		},
		fetchProcess: (state, { payload }: IProcessPayload) => {
			state.currentProcess = state.listProcesses.find(item => item.id === payload.id)
		},
	},
});

export const processReducer = processSlice.reducer;
export const { setCurrentProcess, deleteProcess, saveProcess, fetchProcesses, fetchProcess } = processSlice.actions;