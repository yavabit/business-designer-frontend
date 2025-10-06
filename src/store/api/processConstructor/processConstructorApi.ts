import { baseApi } from "@store/api/api";
import { apiTags } from "@store/api/apiTags";

export const processConstructorApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getProcess: builder.query<
			{ data: IProcess },
			{ processId: string | undefined; }
		>({
			query: (params) => {
				const { processId } = params
				return {
					url: `/documents/${processId}`
				};
			},
			providesTags: (result) =>
				result
					? [{ type: apiTags.process, id: result.data.id }]
					: [{ type: apiTags.process, id: 'LIST' }],

		}),
		updateProcessScheme: builder.mutation<
			{ data: IProcess },
			{ id: string, content: string }
		>({
			query: (body) => ({
				url: `/documents/${body.id}/content`,
				method: "PATCH",
				body: {
					content: body.content
				}
			}),
			invalidatesTags: [{ type: apiTags.process, id: "LIST" }],
		}),
		updateProcessImage: builder.mutation<
			{ data: IProcess },
			{ id: string, data: FormData }
		>({
			query: (body) => ({
				url: `/documents/${body.id}/picture`,
				method: "PATCH",
				body: body.data
			}),
			invalidatesTags: [{ type: apiTags.process, id: "LIST" }],
		}),
		updateTriggerType: builder.mutation<{message: string}, {process: string, trigger_type: string}>({
			query: ({process, trigger_type}) => ({
				url: `/documents/${process}/trigger`,
				method: 'PATCH',
				body: { trigger_type }
			}),
			invalidatesTags: [apiTags.process]
		}),
		updatePeriod: builder.mutation<{message: string}, {process: string, period: number | null}>({
			query: ({process, period}) => ({
				url: `/documents/${process}/period`,
				method: 'PATCH',
				body: { period }
			}),
			invalidatesTags: [apiTags.process]
		}),
		switchShedule: builder.mutation<{is_started: boolean}, string>({
			query: (process) => ({
				url: `/documents/${process}/switch_shedule`,
				method: 'POST',
			}),
			invalidatesTags: [apiTags.process]
		})
	})
})

export const { 
	useLazyGetProcessQuery, 
	useGetProcessQuery, 
	useUpdateProcessSchemeMutation, 
	useUpdateProcessImageMutation, 
	useUpdateTriggerTypeMutation,
	useUpdatePeriodMutation,
	useSwitchSheduleMutation,
} = processConstructorApi