import type { NodesCategoryEnum } from "@type/nodes";
import { baseApi } from "../api";
import { apiTags } from "../apiTags";

interface ICreateProcess {
	projectId: string;
	name: string;
	desc: string,
	category_id: NodesCategoryEnum,
	trigger_type?: string
}

export const processesApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getProcesses: builder.query<
			{ pagination: IPagination; data: IProcess[] },
			IGetAllParams & { projectId: string }
		>({
			query: (params) => {
				const {
					projectId,
					limit = 50,
					page = 1,
					field,
					order,
					search,
				} = params;
				return {
					url: "/documents",
					params: {
						project_id: projectId,
						limit,
						page,
						field,
						order,
						search,
					},
				};
			},
			providesTags: (result) =>
				result
					? [
						...result.data.map(({ id }) => ({
							type: apiTags.processes,
							id,
						})),
						{ type: apiTags.processes, id: "LIST" },
					]
					: [{ type: apiTags.processes, id: "LIST" }],
		}),

		createProcess: builder.mutation<
			{ data: IProcess },
			ICreateProcess
		>({
			query: (body) => ({
				url: "/documents",
				method: "POST",
				body: {
					projectId: body.projectId,
					name: body.name,
					desc: body.desc,
					category_id: body.category_id,
				},
			}),
			invalidatesTags: [{ type: apiTags.processes, id: "LIST" }],
		}),

		updateProcessName: builder.mutation<
			{ data: IProcess },
			{ id: string; name: string }
		>({
			query: ({ id, name }) => ({
				url: `/documents/${id}/name`,
				method: "PATCH",
				body: { name },
			}),
			invalidatesTags: [{ type: apiTags.processes, id: "LIST" }],
		}),

		updateProcessData: builder.mutation<
			{ message: string },
			{ id: string; data: FormData }
		>({
			query: (body) => ({
				url: `/documents/${body.id}/data`,
				method: "PATCH",
				body: body.data,
				headers: {},
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: apiTags.processes, id },
			],
		}),

		deleteProcess: builder.mutation<void, string>({
			query: (id) => ({
				url: `/documents/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _error, id) => [
				{ type: apiTags.processes, id },
			],
		}),
		typesProcess: builder.query<{ data: IProcessType[] }, void>({
			query: () => ({
				url: `/process_categories`,
				method: "GET",
				invalidatesTags: () => [
					{ type: apiTags.processes, id: "LIST" },
				],
			})
		}),
		getTriggerTypes: builder.query<{data: ITrigger[]}, void>({
			query: () => ({
				url: `/triggers`,
				method: "GET",
			}),
			providesTags: (result) =>
                result
                    ? [
                          ...result.data.map(({ id }) => ({
                              type: apiTags.projects,
                              id,
                          })),
                          { type: apiTags.triggers, id: "LIST" },
                      ]
                    : [{ type: apiTags.triggers, id: "LIST" }],
		}),
	}),
});

export const {
	useLazyGetProcessesQuery,
	useGetProcessesQuery,
	useCreateProcessMutation,
	useUpdateProcessNameMutation,
	useDeleteProcessMutation,
	useUpdateProcessDataMutation,
	useLazyTypesProcessQuery,
	useTypesProcessQuery,
	useLazyGetTriggerTypesQuery,
} = processesApi;
