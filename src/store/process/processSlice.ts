import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IProcessState {
	listProcesses: IProcess[]
	currentProcess?: IProcess
	isCreationModalOpen: boolean
	isLoading: boolean
}

interface IProcessPayload {
	payload: IProcess
}

export interface IFilter {
	search: string
	sortField: keyof IProcess
	orderCreatedDate?: string
	order: string
	projectId?: number
}

interface IFilterPayload {
	payload: IFilter
}

interface ICreateProcess {
	name: string
	desc: string
	project_id: string
}

interface ICreateProcessPayload {
	payload: ICreateProcess
}

const initialState: IProcessState = {
	listProcesses: [],
	currentProcess: undefined,
	isCreationModalOpen: false,
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
				id: 0,
				name: 'Процесс CI/CD',
				desc: 'Описание процесса CI/CD',
				project_id: 1,
				project_name: '0',
				content: '{}',
				pict_url: 'https://svg.template.creately.com/c5JMedWsSpq',
				author_id: 0,
				author_name: '0',
				created_at: new Date().toLocaleDateString(),
				updated_at: new Date().toLocaleDateString(),
			})

			listProcesses = listProcesses.map((item, index) => {
				return {
					...item,
					id: index,
					name: `${item.name} ${index}`,
					author_name: `${item.author_name} ${index}`
				}
			})

			state.listProcesses = listProcesses.filter(item => item.project_id === payload.projectId || item.project_id === 1)
			state.isLoading = false
		},
		fetchProcess: (state, { payload }: IProcessPayload) => {
			state.currentProcess = state.listProcesses.find(item => item.id === payload.id)
		},
		setProcessCreationModal(state, action: PayloadAction<boolean>) {
			state.isCreationModalOpen = action.payload;
		},
		createProcess: (state, { payload }: ICreateProcessPayload) => {
			const id = state.listProcesses.length + 1
			state.listProcesses = state.listProcesses.concat([{
				id,
				name: `${payload.name} ${id}`,
				desc: payload.desc,
				project_id: Number(payload.project_id),
				project_name: '0',
				content: '{}',
				pict_url: 'https://svg.template.creately.com/c5JMedWsSpq',
				author_id: 0,
				author_name: '0',
				created_at: new Date(),
				updated_at: new Date(),
			}])
		},
	},
});

export const processReducer = processSlice.reducer;
export const { setCurrentProcess, deleteProcess, saveProcess, fetchProcesses, fetchProcess, setProcessCreationModal, createProcess } = processSlice.actions;