import { baseApi } from "../api";
import { apiTags } from "../apiTags";

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
            { projectId: string; name: string; desc: string }
        >({
            query: (body) => ({
                url: "/documents",
                method: "POST",
                body: {
                    projectId: body.projectId,
                    name: body.name,
                    desc: body.desc,
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
    }),
});

export const {
    useLazyGetProcessesQuery,
    useGetProcessesQuery,
    useCreateProcessMutation,
    useUpdateProcessNameMutation,
    useDeleteProcessMutation,
    useUpdateProcessDataMutation,
} = processesApi;
